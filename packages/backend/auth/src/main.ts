import { Handler, Context, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Server } from 'http';
import express from 'express';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, LogLevel } from '@nestjs/common';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { generateOpenAPIDocument } from './api/api.definition';

const binaryMimeTypes: string[] = [];

let cachedServer: Server;

process.on('unhandledRejection', (reason) => {
    console.error(reason);
});

process.on('uncaughtException', (reason) => {
    console.error(reason);
});

const isAPIGateway = (event: APIGatewayEvent) => event.headers.Host.includes('.execute-api.');

const configBasePath = (): string => process.env.BASE_PATH || '<env-var-not-set>';
const configDomainName = (): string => process.env.DOMAIN_NAME || '<env-var-not-set>';

const prefix = (path: string): string => (path.startsWith('/') ? path : '/' + path);
const remove = (path: string): string => (path.endsWith('/') ? path.substring(0, path.length - 1) : path);

const globalPath = (): string => prefix(remove(configBasePath()));

const bootstrapServer = async (): Promise<Server> => {
    return new Promise<Server>((resolve, reject) => {
        if (cachedServer) {
            resolve(cachedServer);
            return;
        }

        const expressServer = express();
        const logLevel = process.env.LOG_LEVEL || 'error warn log';
        NestFactory.create(AppModule, new ExpressAdapter(expressServer), {
            logger: logLevel.split(' ') as LogLevel[],
        })
            .then((nestApp) => {
                nestApp.setGlobalPrefix(globalPath());
                nestApp.enableCors();
                nestApp.use(eventContext());

                // TODO: Security Checks e.g. helmet, csrf, ...

                nestApp.useGlobalPipes(new ValidationPipe());

                generateOpenAPIDocument(nestApp);

                nestApp.init();
            })
            .then(() => {
                cachedServer = createServer(expressServer, undefined, binaryMimeTypes);
                resolve(cachedServer);
            })
            .catch((error) => reject(error));
    });
};

const redirectIfNecessary = (event: APIGatewayEvent): APIGatewayProxyResult | undefined => {
    if (isAPIGateway(event)) {
        return {
            statusCode: 301,
            body: '',
            headers: {
                Location: 'https://' + configDomainName() + '/' + configBasePath() + event.path,
            },
        };
    }
};

export const handler: Handler = async (event: APIGatewayEvent, context: Context) => {
    console.log('Event:', event.headers.Host, event.path);

    const response = redirectIfNecessary(event);
    if (response) return response;

    cachedServer = await bootstrapServer();

    return proxy(cachedServer, event, context, 'PROMISE').promise;
};
