import { Controller, HttpStatus, Logger, Get } from '@nestjs/common';
import { PingResponse } from './health.dto';
import { ApiBearerAuth, ApiTags, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { InternalServerErrorResponse } from '../common/common.dto';

@Controller('health')
@ApiBearerAuth()
@ApiTags('Health')
@ApiInternalServerErrorResponse({ type: InternalServerErrorResponse })
export class HealthController {
    private readonly logger = new Logger(HealthController.name);

    @Get('ping')
    async ping(): Promise<PingResponse> {
        this.logger.debug('ping()');
        return { statusCode: HttpStatus.OK, message: 'Pong' };
    }
}
