interface TemplateDataConfirmation {
    title: string;
    codeParameter: string;
    href: string;
    linkParameter: string;
}

interface TemplateDataForgetPassword {
    title: string;
    codeParameter: string;
    linkParameter: string;
}

function confirmationEmailTemplate(data: TemplateDataConfirmation): string {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"/> <meta http-equiv="X-UA-Compatible" content="IE=Edge"/><!--[if (gte mso 9)|(IE)]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--><!--[if (gte mso 9)|(IE)]> <style type="text/css"> body{width: 600px; margin: 0 auto;}table{border-collapse: collapse;}table, td{mso-table-lspace: 0pt; mso-table-rspace: 0pt;}img{-ms-interpolation-mode: bicubic;}</style><![endif]--> <style type="text/css"> body, p, div{font-family: arial, helvetica, sans-serif; font-size: 14px;}body{color: #000000;}body a{color: #1188e6; text-decoration: none;}p{margin: 0; padding: 0;}table.wrapper{width: 100% !important; table-layout: fixed; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -moz-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}img.max-width{max-width: 100% !important;}.column.of-2{width: 50%;}.column.of-3{width: 33.333%;}.column.of-4{width: 25%;}@media screen and (max-width: 480px){.preheader .rightColumnContent, .footer .rightColumnContent{text-align: left !important;}.preheader .rightColumnContent div, .preheader .rightColumnContent span, .footer .rightColumnContent div, .footer .rightColumnContent span{text-align: left !important;}.preheader .rightColumnContent, .preheader .leftColumnContent{font-size: 80% !important; padding: 5px 0;}table.wrapper-mobile{width: 100% !important; table-layout: fixed;}img.max-width{height: auto !important; max-width: 100% !important;}a.bulletproof-button{display: block !important; width: auto !important; font-size: 80%; padding-left: 0 !important; padding-right: 0 !important;}.columns{width: 100% !important;}.column{display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; margin-left: 0 !important; margin-right: 0 !important;}.social-icon-column{display: inline-block !important;}}</style> </head><body> <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:arial,helvetica,sans-serif; color:#000000; background-color:#ebebeb;"> <div class="webkit"> <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#ebebeb"> <tr> <td valign="top" bgcolor="#ebebeb" width="100%"> <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0"> <tr> <td width="100%"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tr> <td><!--[if mso]> <center> <table><tr><td width="600"><![endif]--> <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center"> <tr> <td role="modules-container" style="padding:50px 50px 50px 50px; color:#000000; text-align:left;" bgcolor="#ffffff" width="100%" align="left"> <table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;"> <tr> <td role="module-content"> <p></p></td></tr></table> <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="33613c3c-9c01-48bc-9655-db761828c2d6"> <tbody> <tr> <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center"> <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:50% !important; width:50%; height:auto !important;" width="250" alt="" data-proportionally-constrained="true" data-responsive="true" src="http://cdn.mcauto-images-production.sendgrid.net/ec51cf7e7b6a819f/2297d7b9-da14-43bb-be25-5ad95510a900/300x300.png"/> </td></tr></tbody> </table> <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="15e10ef7-abbc-4e68-a089-3c0e52bbdf37" data-mc-module-version="2019-10-22"> <tbody> <tr> <td style="padding:18px 0px 18px 0px; line-height:40px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"> <div> <h1 style="text-align: center"> <span style="color: #6a6a6a">Search Ninja</span> </h1> <div></div></div></td></tr></tbody> </table> <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="6f49fed4-aba1-41e0-94aa-89509f177885" data-mc-module-version="2019-10-22"> <tbody> <tr> <td style="padding:18px 0px 18px 0px; line-height:20px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content"> <div> <div style="font-family: inherit; text-align: inherit"> <span style="font-size: 16px; color: #666666">You're on your way!<br/> Let's confirm your email address.</span> </div><div></div></div></td></tr></tbody> </table> <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="4d6f8690-3dab-4ab1-9751-969e78b6a8cb" data-mc-module-version="2019-10-22"> <tbody> <tr> <td style="padding:18px 0px 18px 0px; line-height:20px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content"> <div> <div style="font-family: inherit; text-align: inherit"> <span style="font-size: 16px; color: #666666">By clicking on the following link, you are confirming your email address.<br/> </span> </div><div></div></div></td></tr></tbody> </table> <table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="04b0986d-f917-4b9e-bdec-8aaa3b1b25ba"> <tbody> <tr> <td style="padding:0px 0px 15px 0px;" role="module-content" bgcolor=""></td></tr></tbody> </table> <table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%" data-muid="65a4c6dd-32eb-49fd-9555-5ef5c3f2c83c"> <tbody> <tr> <td align="center" bgcolor="" class="outer-td" style="padding:0px 0px 0px 0px;"> <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;"> <tbody> <tr> <td align="center" bgcolor="#333333" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;"> <a href="${data.href}" style="background-color:#333333; border:1px solid #333333; border-color:#333333; border-radius:6px; border-width:1px; color:#ffffff; display:inline-block; font-size:14px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 18px 12px 18px; text-align:center; text-decoration:none; border-style:solid;" target="_blank">Confirm Email Address</a> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="04b0986d-f917-4b9e-bdec-8aaa3b1b25ba.1"> <tbody> <tr> <td style="padding:0px 0px 15px 0px;" role="module-content" bgcolor=""></td></tr></tbody> </table> <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="aeb784f3-1c39-4371-9354-01fef870b339" data-mc-module-version="2019-10-22"> <tbody> <tr> <td style="padding:18px 0px 18px 0px; line-height:20px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content"> <div> <div style="font-family: inherit; text-align: inherit"> <span style="color: #666666; font-size: 16px">Live long and prosper</span> </div><div style="font-family: inherit; text-align: inherit"> <span style="color: #666666; font-size: 16px">Your Search Ninja Team</span> </div><div></div></div></td></tr></tbody> </table> <table class="module" role="module" data-type="code" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="26c6d46f-aeb0-47ce-94ab-b4a3adc08456"> <tbody> <tr> <td height="100%" valign="top" role="module-content"> <div style="display:none"> ${data.linkParameter}</div></td></tr></tbody> </table> </td></tr></table><!--[if mso]> </td></tr></table> </center><![endif]--> </td></tr></table> </td></tr></table> </td></tr></table> </div></center></body></html>`;
}

function confirmationSmsTemplate(data: TemplateDataConfirmation): string {
    return `Welcome to Search Ninja! Confirm Your Phone Number\n\nYou're on your way! Let's confirm your phone number.\n\nBy entering your code on the website, you are confirming your phone number.\n\n${data.codeParameter}\n\nLive long and prosper\nThe Search Ninja Team`;
}

function resetPasswordEmailTemplate(data: TemplateDataForgetPassword): string {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"> <meta http-equiv="X-UA-Compatible" content="IE=Edge"><!--[if (gte mso 9)|(IE)]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--><!--[if (gte mso 9)|(IE)]> <style type="text/css"> body{width: 600px;margin: 0 auto;}table{border-collapse: collapse;}table, td{mso-table-lspace: 0pt;mso-table-rspace: 0pt;}img{-ms-interpolation-mode: bicubic;}</style><![endif]--> <style type="text/css"> body, p, div{font-family: arial, helvetica, sans-serif; font-size: 14px;}body{color: #000000;}body a{color: #1188E6; text-decoration: none;}p{margin: 0; padding: 0;}table.wrapper{width: 100% !important; table-layout: fixed; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -moz-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}img.max-width{max-width: 100% !important;}.column.of-2{width: 50%;}.column.of-3{width: 33.333%;}.column.of-4{width: 25%;}@media screen and (max-width:480px){.preheader .rightColumnContent, .footer .rightColumnContent{text-align: left !important;}.preheader .rightColumnContent div, .preheader .rightColumnContent span, .footer .rightColumnContent div, .footer .rightColumnContent span{text-align: left !important;}.preheader .rightColumnContent, .preheader .leftColumnContent{font-size: 80% !important; padding: 5px 0;}table.wrapper-mobile{width: 100% !important; table-layout: fixed;}img.max-width{height: auto !important; max-width: 100% !important;}a.bulletproof-button{display: block !important; width: auto !important; font-size: 80%; padding-left: 0 !important; padding-right: 0 !important;}.columns{width: 100% !important;}.column{display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; margin-left: 0 !important; margin-right: 0 !important;}.social-icon-column{display: inline-block !important;}}</style> </head><body> <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size:14px; font-family:arial,helvetica,sans-serif; color:#000000; background-color:#ebebeb;"> <div class="webkit"> <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#ebebeb"> <tr> <td valign="top" bgcolor="#ebebeb" width="100%"> <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0"> <tr> <td width="100%"> <table width="100%" cellpadding="0" cellspacing="0" border="0"> <tr> <td><!--[if mso]> <center> <table><tr><td width="600"><![endif]--> <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center"> <tr> <td role="modules-container" style="padding:50px 50px 50px 50px; color:#000000; text-align:left;" bgcolor="#ffffff" width="100%" align="left"> <table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;"> <tr> <td role="module-content"> <p></p></td></tr></table> <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="33613c3c-9c01-48bc-9655-db761828c2d6"> <tbody> <tr> <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center"> <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:50% !important; width:50%; height:auto !important;" width="250" alt="" data-proportionally-constrained="true" data-responsive="true" src="http://cdn.mcauto-images-production.sendgrid.net/ec51cf7e7b6a819f/2297d7b9-da14-43bb-be25-5ad95510a900/300x300.png"> </td></tr></tbody> </table> <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="15e10ef7-abbc-4e68-a089-3c0e52bbdf37" data-mc-module-version="2019-10-22"> <tbody> <tr> <td style="padding:18px 0px 18px 0px; line-height:40px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content"> <div> <h1 style="text-align: center"><span style="color: #6a6a6a">Search Ninja</span></h1> <div></div></div></td></tr></tbody> </table> <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="6f49fed4-aba1-41e0-94aa-89509f177885" data-mc-module-version="2019-10-22"> <tbody> <tr> <td style="padding:18px 0px 18px 0px; line-height:20px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content"> <div> <div style="font-family: inherit; text-align: inherit"> <span style="font-size: 16px; color: #666666">Hello Search Ninja,</span></div><div></div></div></td></tr></tbody> </table> <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="4d6f8690-3dab-4ab1-9751-969e78b6a8cb" data-mc-module-version="2019-10-22"> <tbody> <tr> <td style="padding:18px 0px 18px 0px; line-height:20px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content"> <div> <div style="font-family: inherit; text-align: inherit"> <span style="font-size: 16px; color: #666666">A request has been received to change the password for your Search Ninja account.</span> </div><div></div></div></td></tr></tbody> </table> <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="111abd77-f835-40e5-be0a-f8b2dba8fd96"> <tbody> <tr> <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content"> <div> <div style="font-family: inherit"><span style="font-size: 16px; color: #666666">Please go back to the Search Ninja website and enter the following code and the new password:</span></div><div style="font-family: inherit"><br></div><div></div></div></td></tr></tbody> </table> <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="fe355c6c-a5a9-408d-b467-b3e184a59699"> <tbody> <tr> <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content"> <div> <div style="font-family: inherit; text-align: center"> <span style="color: #666666; font-size: 20px"><strong>${data.codeParameter}</strong></span> </div><div></div></div></td></tr></tbody> </table> <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="672e205d-4062-4778-8810-1602476f02a5"> <tbody> <tr> <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content"> <div> <div style="font-family: inherit"><span style="color: #666666; font-size: 16px">If you did not request a new password, then most probably someone else did by mistake. It is safe to ignore this email, you are still able to login with your old password.</span></div><div></div></div></td></tr></tbody> </table> <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="aeb784f3-1c39-4371-9354-01fef870b339" data-mc-module-version="2019-10-22"> <tbody> <tr> <td style="padding:18px 0px 18px 0px; line-height:20px; text-align:inherit; background-color:#ffffff;" height="100%" valign="top" bgcolor="#ffffff" role="module-content"> <div> <div style="font-family: inherit; text-align: inherit"> <span style="color: #666666; font-size: 16px">Live long and prosper</span></div><div style="font-family: inherit; text-align: inherit"> <span style="color: #666666; font-size: 16px">The Search Ninja Team</span></div><div></div></div></td></tr></tbody> </table> <table class="module" role="module" data-type="code" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="26c6d46f-aeb0-47ce-94ab-b4a3adc08456"> <tbody> <tr> <td height="100%" valign="top" role="module-content"> <div style="display:none"> ${data.linkParameter}</div></td></tr></tbody> </table> </td></tr></table><!--[if mso]> </td></tr></table> </center><![endif]--> </td></tr></table> </td></tr></table> </td></tr></table> </div></center></body></html>`;
}

function resetPasswordSmsTemplate(data: TemplateDataForgetPassword): string {
    return `Hello Search Ninja,\n\nYour Search Ninja password reset code:\n\n${data.codeParameter}\n\nLive long and prosper\nThe Search Ninja Team`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sendForgetPasswordMessage(event: any): void {
    const { codeParameter, linkParameter } = event.request;

    const templateData: TemplateDataForgetPassword = {
        title: 'Your Search Ninja password reset request',
        codeParameter: codeParameter,
        linkParameter: linkParameter,
    };

    const emailSubject = templateData.title;
    console.log('Response - Email Subject: ' + emailSubject);
    event.response.emailSubject = emailSubject;

    const emailMessage = resetPasswordEmailTemplate(templateData);
    console.log('Response - Email Message: ' + emailMessage);
    event.response.emailMessage = emailMessage;

    const smsMessage = resetPasswordSmsTemplate(templateData);
    console.log('Response - SMS Message: ' + smsMessage);
    event.response.smsMessage = smsMessage;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sendConfirmationMessage(event: any): void {
    const { userName } = event;
    const { codeParameter, linkParameter } = event.request;
    const { clientId } = event.callerContext;
    const userPoolDomain = process.env.USER_POOL_DOMAIN;

    const href =
        userPoolDomain +
        '/confirmUser?client_id=' +
        clientId +
        '&user_name=' +
        userName +
        '&confirmation_code=' +
        codeParameter;

    const templateData: TemplateDataConfirmation = {
        title: 'Welcome to Search Ninja! Confirm Your Email',
        href: href,
        linkParameter: linkParameter,
        codeParameter: codeParameter,
    };

    const emailSubject = templateData.title;
    console.log('Response - Email Subject: ' + emailSubject);
    event.response.emailSubject = emailSubject;

    const emailMessage = confirmationEmailTemplate(templateData);
    console.log('Response - Email Message: ' + emailMessage);
    event.response.emailMessage = emailMessage;

    const smsMessage = confirmationSmsTemplate(templateData);
    console.log('Response - SMS Message: ' + smsMessage);
    event.response.smsMessage = smsMessage;
}

export async function preSignUpHandler(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: any,
): Promise<void> {
    console.log('Pre SignUp Handler');
    console.log('Event: ' + JSON.stringify(event));

    callback(null, event);
}

export async function customMessageHandler(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: any,
): Promise<void> {
    console.log('Custom Message Handler');
    console.log('Env[USER_POOL_DOMAIN]: ' + process.env.USER_POOL_DOMAIN);
    console.log('Event - Initial: ' + JSON.stringify(event));
    console.log('Context: ' + JSON.stringify(context));

    if (event.triggerSource === 'CustomMessage_SignUp') sendConfirmationMessage(event);
    if (event.triggerSource === 'CustomMessage_ResendCode') sendConfirmationMessage(event);
    if (event.triggerSource === 'CustomMessage_ForgotPassword') sendForgetPasswordMessage(event);

    console.log('Event - Processed: ' + JSON.stringify(event));

    callback(null, event);
}
