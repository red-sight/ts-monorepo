import { Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { SigninLocalDto } from '@repo/dtos';
import { PrismaService } from '../../prisma.service';
import { Password } from '../../utils/Password';

@Injectable()
export class SigninService {
  constructor(private prisma: PrismaService) {}

  async signinLocal({ email, password }: SigninLocalDto) {
    const localAuth = await this.prisma.localAuth.findUnique({
      where: { email },
      include: {
        authMethod: { include: { profile: { include: { role: true } } } },
      },
    });
    if (!localAuth || !localAuth.authMethod || !localAuth.authMethod.profile) {
      throw new NotFoundException('Access not found');
    }
    const passwordInstance = new Password({
      password,
      salt: localAuth.salt,
    });

    const passwordMatched = passwordInstance.verify(localAuth.password);
    if (!passwordMatched)
      throw new RpcException({ statusCode: 403, message: 'Unauthorized' });

    return localAuth.authMethod.profile;
  }
}
