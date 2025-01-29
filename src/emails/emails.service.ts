import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as ejs from 'ejs';

import { getFullTemplatePath } from 'src/utils/mails';

@Injectable()
export class EmailsService {
  constructor(private mailService: MailerService) {}

  sendMail(to: string, subject: string, templateFile: string, data: any) {
    ejs.renderFile(getFullTemplatePath(templateFile), data, (err, template) => {
      if (err) {
        console.error('Error rendering email template', err);
        throw new BadRequestException('Error rendering email template');
      }
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
    });
  }
}
