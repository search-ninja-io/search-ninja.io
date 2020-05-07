import { ApiProperty } from '@nestjs/swagger';

export class InternalServerErrorResponse {
    @ApiProperty({ example: 500 })
    statusCode!: number;

    @ApiProperty({ example: 'Internal Server Error' })
    error!: string;
}

export class BadRequestResponse {
    @ApiProperty({ example: 400 })
    statusCode!: number;

    @ApiProperty({ example: 'Bad Request' })
    error!: string;

    @ApiProperty({ example: ['field x must be an email', 'field y should not be empty'] })
    message!: string[];
}
