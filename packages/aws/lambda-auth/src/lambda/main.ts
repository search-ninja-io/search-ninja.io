import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/httpexception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import express, { Express } from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

import { Server } from 'http';
import { Context, APIGatewayProxyEvent } from 'aws-lambda';
import * as serverlessExpress from 'aws-serverless-express';

const bootstrap = async (expressServer?: Express): Promise<INestApplication> => {
    if (!expressServer) {
        expressServer = express();
    }

    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressServer), {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter());

    const options = new DocumentBuilder()
        .setTitle('Search Ninja - Authentiation API')
        .setDescription('The Search Ninja Authentication API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);

    return await app.init();
};

const bootstrapLambda = async (): Promise<Server> => {
    const expressServer = express();
    await bootstrap(expressServer);
    return serverlessExpress.createServer(expressServer);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const module: any;
const bootstrapStandalone = async (): Promise<void> => {
    const app = await bootstrap();
    await app.listen(4000);
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
};

let lambdaProxy: Server;
export const handler = (event: APIGatewayProxyEvent, context: Context): void => {
    if (!lambdaProxy) {
        bootstrapLambda().then((server) => {
            lambdaProxy = server;
            serverlessExpress.proxy(lambdaProxy, event, context);
        });
    } else {
        serverlessExpress.proxy(lambdaProxy, event, context);
    }
};

if (!process.env.RUNTIME_LAMBDA) {
    bootstrapStandalone();
}
