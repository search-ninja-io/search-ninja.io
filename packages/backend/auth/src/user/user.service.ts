import { Injectable, HttpStatus, HttpException, BadRequestException, Logger } from '@nestjs/common';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    changePassword(email: string): string {
        this.logger.debug('changePassword() - Email: ' + email);

        if (email === 'error1@test.com') this.throwEx(new BadRequestException(['This is a error 1']));
        if (email === 'error2@test.com') this.throwEx(new BadRequestException('This is a error 2'));
        if (email === 'error3@test.com') this.throwEx(new HttpException(['This is a error 3'], HttpStatus.BAD_GATEWAY));
        if (email === 'error4@test.com') this.throwEx(new HttpException('This is a error 4', HttpStatus.BAD_GATEWAY));
        if (email === 'error5@test.com') this.throwEx(new Error('This is a error 5'));

        const result = 'SUCCCESS';
        this.logger.log('changePassword() - Result: ' + result);
        return result;
    }

    private throwEx(ex: unknown): void {
        this.logger.log('changePassword() - Exception: ' + ex);
        throw ex;
    }
}
