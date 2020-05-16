import { Controller, Post, Body, HttpStatus, Logger, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ChangePasswordRequest, ChangePasswordResponse } from './user.dto';
import { ApiBearerAuth, ApiBadRequestResponse, ApiTags, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { InternalServerErrorResponse, BadRequestResponse } from '../common/common.dto';

@Controller('user')
@ApiBearerAuth()
@ApiTags('User')
@ApiInternalServerErrorResponse({ type: InternalServerErrorResponse })
@ApiBadRequestResponse({ type: BadRequestResponse })
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(private userService: UserService) {}

    @Post('change-password')
    async changePassword(@Body() changePassword: ChangePasswordRequest): Promise<ChangePasswordResponse> {
        this.logger.debug('changePassword()\n' + JSON.stringify(changePassword, null, 2));
        const result = this.userService.changePassword(changePassword.email);
        return { statusCode: HttpStatus.CREATED, message: result };
    }

    @Get('change-password')
    async changePasswordGet(): Promise<ChangePasswordResponse> {
        this.logger.debug('changePasswordGet()');
        return { statusCode: HttpStatus.OK, message: 'GET SUCCESS' };
    }
}
