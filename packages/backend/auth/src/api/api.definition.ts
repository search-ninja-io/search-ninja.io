import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { OpenAPIObject } from '@nestjs/swagger';

let openAPIDocument: OpenAPIObject;

export const getOpenAPIDocument = (): OpenAPIObject => {
    if (!openAPIDocument) throw new Error('OpenAPI document not initialized.');
    return openAPIDocument;
};

export const generateOpenAPIDocument = (nestApp: INestApplication): void => {
    const authorizationUrl = 'https://search-ninja.auth0.com/authorize';

    const options = new DocumentBuilder()
        .setTitle('Search Ninja - Authentication API')
        .setDescription('The Search Ninja Authentication API')
        .setVersion('1.0')
        .addBearerAuth({
            type: 'oauth2',
            flows: {
                implicit: {
                    authorizationUrl: authorizationUrl,
                    scopes: {
                        'read:user': 'Read User',
                        'write:otheruser': 'Write Other User',
                    },
                },
            },
        })
        .build();

    openAPIDocument = SwaggerModule.createDocument(nestApp, options);

    // TODO: Delete scheme and bearerFormat from OpenAPIDocument
    // delete openAPIDocument.components.securitySchemes.bearer.scheme;
    // delete openAPIDocument.components.securitySchemes.bearer.bearerFormat;
};
