import { Handler, Context, APIGatewayEvent } from 'aws-lambda';
import { Server } from 'http';
import express from 'express';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, INestApplication, LogLevel } from '@nestjs/common';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';

const binaryMimeTypes: string[] = [];

let cachedServer: Server;

process.on('unhandledRejection', (reason) => {
    console.error(reason);
});

process.on('uncaughtException', (reason) => {
    console.error(reason);
});

const configGlobalPrefix = (): string => process.env.BASE_PATH || '<env-var-not-set>';
const configSwaggerPath = (): string => process.env.SWAGGER_PATH || '<env-var-not-set>';

const setupSwagger = (nestApp: INestApplication): INestApplication => {
    const options = new DocumentBuilder()
        .setTitle('Search Ninja - Authentication API')
        .setDescription('The Search Ninja Authentication API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(nestApp, options);
    SwaggerModule.setup(configGlobalPrefix() + '/' + configSwaggerPath(), nestApp, document);
    return nestApp;
};

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
                nestApp.setGlobalPrefix(configGlobalPrefix());
                nestApp.use(eventContext());
                nestApp.useGlobalPipes(new ValidationPipe());
                setupSwagger(nestApp);
                nestApp.init();
            })
            .then(() => {
                cachedServer = createServer(expressServer, undefined, binaryMimeTypes);
                resolve(cachedServer);
            })
            .catch((error) => reject(error));
    });
};

const rewriteSwaggerUrls = (event: APIGatewayEvent): APIGatewayEvent => {
    const globalPrefix = configGlobalPrefix();
    const swaggerPath = configSwaggerPath();

    if (event.path === '/' + globalPrefix + '/' + swaggerPath) {
        event.path = '/' + globalPrefix + '/' + swaggerPath + '/';
    }

    if (event.path.includes('swagger-ui') && !event.path.startsWith(`/${globalPrefix}/${swaggerPath}/`)) {
        event.path = `/${globalPrefix}/${swaggerPath}/${event.path.substring((globalPrefix + '/').length)}`;
    }

    return event;
};

export const handler: Handler = async (event: APIGatewayEvent, context: Context) => {
    event = rewriteSwaggerUrls(event);
    cachedServer = await bootstrapServer();
    return proxy(cachedServer, event, context, 'PROMISE').promise;
};
