import { Controller, Post, Body, HttpStatus, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordRequest, ChangePasswordResponse } from './auth.dto';
import { ApiBearerAuth, ApiBadRequestResponse, ApiTags, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { InternalServerErrorResponse, BadRequestResponse } from '../common/common.dto';

@Controller('auth')
@ApiBearerAuth()
@ApiTags('User')
@ApiInternalServerErrorResponse({ type: InternalServerErrorResponse })
@ApiBadRequestResponse({ type: BadRequestResponse })
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private authService: AuthService) {}

    @Post('change-password')
    async changePassword(@Body() changePassword: ChangePasswordRequest): Promise<ChangePasswordResponse> {
        this.logger.debug('changePassword()\n' + JSON.stringify(changePassword, null, 2));
        const result = this.authService.changePassword(changePassword.email);
        return { statusCode: HttpStatus.CREATED, message: result };
    }
}
