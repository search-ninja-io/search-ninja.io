import { Controller, HttpStatus, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { getOpenAPIDocument } from './api.definition';

@Controller('api')
export class ApiController {
    @Get('swagger.json')
    swaggerJson(@Res() res: Response): void {
        const openAPIDocument = getOpenAPIDocument();
        res.status(HttpStatus.OK).json(openAPIDocument);
    }
}
