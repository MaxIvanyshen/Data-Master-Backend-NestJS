import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { UserDto } from 'src/user/dto/user.dto';

@Injectable()
export class PasswordValidationPipe implements PipeTransform {
  transform(req: UserDto) {
      if (typeof req.password !== 'string') {
          throw new BadRequestException('Password must be a string');
      }

      const password = req.password.trim();

      const isValid = this.validatePassword(password);

      if (!isValid) {
          throw new BadRequestException('Password should be at least 8 characters long and include at least one number');
      }

      return password;
  }

  private validatePassword(password: string): boolean {
      const minLength = 8;
      const hasNumber = /\d/.test(password);

      return password.length >= minLength && hasNumber;
  }
}
