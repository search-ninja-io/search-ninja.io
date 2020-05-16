import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordRequest {
    @IsEmail()
    @ApiProperty({ example: 'foo@bar.com' })
    readonly email!: string;
}

export class ChangePasswordResponse {
    @ApiProperty({ example: 201 })
    statusCode!: number;

    @ApiProperty({ example: 'SUCCESS' })
    message!: string;
}
