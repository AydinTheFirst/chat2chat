import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";

import { PrismaService } from "@/prisma";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(
        "Token is missing from the request header"
      );
    }

    const tokenDoc = await this.prisma.token.findFirst({
      where: { expiresAt: { gte: new Date() }, token },
    });

    if (!tokenDoc) {
      throw new UnauthorizedException("Invalid token");
    }

    const user = await this.prisma.user.findFirst({
      where: { id: tokenDoc.userId },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid token");
    }

    request.user = user;

    return true;
  }
}
