import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export class MongodbOptions {
  constructor(public readonly configService: ConfigService) {}

  async getOptions(): Promise<MongooseModuleOptions> {
    return this.getOptionsFromEnv();
  }

  private getOptionsFromEnv(): MongooseModuleOptions {
    return {
      uri: this.configService.get<string>('MONGO_URL'),
      waitQueueTimeoutMS: this.configService.get<number>(
        'MONGO_DEFAULT_QUERY_LIMIT',
      ),
      retryWrites: this.configService.get<boolean>('MONGO_RETRY_WRITES'),
    };
  }
}
