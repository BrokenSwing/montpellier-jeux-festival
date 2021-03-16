import { Injectable } from '@nestjs/common';
import { PasswordService } from '../../src/user/password.service';

@Injectable()
export class PlainPasswordService extends PasswordService {
  hashPassword(plainTextPassword: string): Promise<string> {
    return Promise.resolve(plainTextPassword);
  }

  checkPassword(plainTextPassword, hashedPassword): Promise<boolean> {
    return Promise.resolve(plainTextPassword === hashedPassword);
  }
}
