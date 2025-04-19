import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Public } from '../decorators/public.decorator';
import { LoginDto } from '../dtos/login.dto';
import { AccessTokenOutput } from '../types/access-token.output';
import { RegisterDto } from '../dtos/register.dto';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto): Promise<AccessTokenOutput> {
    return this.authService.login(body);
  }

  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto): Promise<void> {
    return this.authService.register(body);
  }
}
