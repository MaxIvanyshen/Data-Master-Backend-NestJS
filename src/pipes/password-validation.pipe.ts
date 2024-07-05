import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { UserDto } from 'src/user/dto/user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';

@Injectable()
export class PasswordValidationPipe implements PipeTransform {
  transform(req: UserDto | LoginUserDto) {
      const password = req.password.trim();

      const isValid = this.validatePassword(password);

      if (!isValid) {
          throw new BadRequestException('Password should be at least 8 characters long and contain at least one number');
      }

      return req;
  }

  private validatePassword(password: string): boolean {
      const minLength = 8;
      const hasNumber = /\d/.test(password);

      return password.length >= minLength && hasNumber;
  }
}
