import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class MockedJwtGuard extends AuthGuard('jwt') {
  canActivate() {
    return true;
  }
}
