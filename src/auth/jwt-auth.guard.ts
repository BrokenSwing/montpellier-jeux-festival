import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { User } from '../user/entities/user.entity';

export const AdminRequired = (isRequired: boolean = true) =>
  SetMetadata('adminRequired', isRequired);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let can = super.canActivate(context);
    if (typeof can === 'boolean') {
      can = Promise.resolve(can);
    }
    return (can as Promise<boolean>).then((can) => {
      if (can) {
        const needAdmin = this.reflector.getAllAndOverride('adminRequired', [
          context.getHandler(),
          context.getClass(),
        ]);
        const user: User = context.switchToHttp().getRequest().user;
        if (needAdmin && !user.isAdmin) {
          throw new ForbiddenException('You must be an admin');
        }
      }
      return can;
    });
  }
}
