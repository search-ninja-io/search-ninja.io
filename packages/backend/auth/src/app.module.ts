import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { HealthController } from './health/health.controller';

@Module({
    imports: [],
    controllers: [UserController, HealthController],
    providers: [UserService],
})
export class AppModule {}
