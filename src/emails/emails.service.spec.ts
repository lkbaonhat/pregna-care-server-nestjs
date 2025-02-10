import { Test, TestingModule } from '@nestjs/testing';
import { EmailsService } from './emails.service';
import { MailerService } from '@nestjs-modules/mailer';

describe('EmailsService', () => {
  let service: EmailsService;
  let fakeMailerService: Partial<MailerService>;

  beforeEach(async () => {
    fakeMailerService = {
      sendMail: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailsService,
        {
          provide: MailerService,
          useValue: fakeMailerService,
        },
      ],
    }).compile();

    service = module.get(EmailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
