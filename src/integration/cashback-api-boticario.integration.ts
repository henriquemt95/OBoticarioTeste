import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AppConfigService } from '../ConfigModule/service/app-config.service';

@Injectable()
export class CashbackApiIntegration {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: AppConfigService,
  ) {}

  getCashBackByCpf(cpf: string): any {
    const url = this.configService
      .getCashbackApiOBoticarioUrl()
      .replace('{cpf}', cpf);
    const token = this.configService.getCashbackApiOBoticarioToken();
    const request$ = this.httpService.get(url, {
      headers: { token },
    });
    return firstValueFrom(request$);
  }
}
