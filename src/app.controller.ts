import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from './types/core';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Response {
    return { data: null, message: this.appService.getHello() };
  }
}
