
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { UserDto } from 'src/user/dto/user.dto';

@Injectable()
export class EmailValidationPipe implements PipeTransform {
  transform(req: UserDto | LoginUserDto) {

      const email = req.email.trim();
      const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

      if (!emailRegex.test(email)) {
          throw new BadRequestException('Invalid email format');
      }

      return req;
  }

}
