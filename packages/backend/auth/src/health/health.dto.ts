import { ApiProperty } from '@nestjs/swagger';

export class PingResponse {
    @ApiProperty({ example: 201 })
    statusCode!: number;

    @ApiProperty({ example: 'Pong' })
    message!: string;
}
