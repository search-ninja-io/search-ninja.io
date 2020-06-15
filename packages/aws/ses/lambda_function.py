# Copyright 2010-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
#
# This file is licensed under the Apache License, Version 2.0 (the "License").
# You may not use this file except in compliance with the License. A copy of the
# License is located at
#
# http://aws.amazon.com/apache2.0/
#
# This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
# OF ANY KIND, either express or implied. See the License for the specific
# language governing permissions and limitations under the License.

import os
import boto3
import email
import re
import json
from functools import reduce
from botocore.exceptions import ClientError
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

config = json.loads(os.environ['CONFIG'])

region = config['Region']

def get_message_from_s3(message_id):
    incoming_email_bucket = config['MailS3Bucket']
    incoming_email_prefix = config['MailS3Prefix']

    if incoming_email_prefix:
        object_path = (incoming_email_prefix + "/" + message_id)
    else:
        object_path = message_id

    object_http_path = (f"http://s3.console.aws.amazon.com/s3/object/{incoming_email_bucket}/{object_path}?region={region}")

    client_s3 = boto3.client("s3")

    object_s3 = client_s3.get_object(Bucket=incoming_email_bucket, Key=object_path)
    file = object_s3['Body'].read()

    file_dict = {
        "file": file,
        "path": object_http_path
    }

    return file_dict

def create_message(file_dict, original_sender, original_recipients):

    sender = config['MailSender']

    msg = email.message_from_string(file_dict['file'].decode('utf-8'))

    recipients = set()
    for email_to in original_recipients:
        if email_to in config['Inbox']:
            for recipient in config['Inbox'][email_to]['MailRecipients']:
                recipients.add(recipient)

    if len(recipients) == 0:
        print('WARNING! Default recepient selected.')
        for default_recipient in config['MailDefaultRecipient']:
            recipients.add(default_recipient)

    recipients_reduced = reduce((lambda x, y: x + ',' +  y), recipients)
    
    msg['Reply-To'] = original_sender
    msg['X-Original-to'] = msg['To']
    msg.replace_header('From', sender)
    msg.replace_header('To', recipients_reduced)

    message = {
        "Source": sender,
        "Destinations": list(recipients),
        "Data": msg.as_string()
    }

    return message

def send_email(message):

    client_ses = boto3.client('ses', region)

    try:
        #Provide the contents of the email.
        response = client_ses.send_raw_email(
            Source=message['Source'],
            Destinations= message['Destinations'],
            RawMessage={
                'Data':message['Data']
            }
        )

    except ClientError as e:
        output = e.response['Error']['Message']
    else:
        output = "Email sent! Message ID: " + response['MessageId']

    return output

def lambda_handler(event, context):

    message_id = event['Records'][0]['ses']['mail']['messageId']
    print(f"Received message ID {message_id}")

    file_dict = get_message_from_s3(message_id)

    original_sender = event['Records'][0]['ses']['mail']['source']
    original_recipients = event['Records'][0]['ses']['receipt']['recipients']
    message = create_message(file_dict, original_sender, original_recipients)

    result = send_email(message)
    print(result)