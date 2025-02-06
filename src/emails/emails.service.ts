import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as ejs from 'ejs';

import { getFullTemplatePath } from 'src/utils/mails';

@Injectable()
export class EmailsService {
  constructor(private mailService: MailerService) {}

  async sendMail(to: string, subject: string, templateFile: string, data: any) {
    const template = await ejs.renderFile(
      getFullTemplatePath(templateFile),
      data as ejs.Data,
    );
    this.mailService
      .sendMail({
        to,
        subject,
        html: template,
      })
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.error('Error sending email', error);
      });
  }
}
