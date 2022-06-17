import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  public readonly cashbackApiOBoticario = this.configService.get<string>(
    'O_BOTICARIO_CASHBACK_API_URL',
  );

  public readonly cashbackApiOBoticarioToken = this.configService.get<string>(
    'O_BOTICARIO_CASHBACK_API_TOKEN',
  );
  constructor(private readonly configService: ConfigService) {}

  public getCashbackApiOBoticarioUrl(): string {
    return `${this.cashbackApiOBoticario}`;
  }
  public getCashbackApiOBoticarioToken(): string {
    return `${this.cashbackApiOBoticarioToken}`;
  }
}
