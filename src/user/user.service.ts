import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/login-response';
import { UserDto } from './dto/user';
import * as bcrypt from 'bcrypt';
import { PrismaClient, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaClient,
  ) {}

  async register(user: UserDto): Promise<void> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    await this.prismaService.user.create({ data: user });
    return;
  }

  async create(user: UserDto) {
    return;
  }

  async validateUser(emailParam: string, password: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { email: emailParam },
    });

    if (!user) {
      return null;
    }
    const hash = user.password;
    const isMatch = await bcrypt.compare(password, hash);

    if (isMatch) {
      return user;
    }

    return null;
  }

  login(email: string, id: number, ): LoginResponseDto {
    const payload = { email: email, sub: id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
