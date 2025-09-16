import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  // Add the 'async' keyword and change the return type to 'Promise<string>'
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }
}
