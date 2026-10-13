import { prisma } from "../../../config/database";
import type { Auth } from "../data_interfaces/AuthenticationInterface";
import type { AuthInterfaceRepositories } from "../interfaces/IAuthRepositories";

export class AuthRepositories implements AuthInterfaceRepositories {
  async saveSession(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<Auth> {
    await prisma.authentication.upsert({
      where: {
        userId,
      },
      update: {
        token,
        expiresAt,
      },
      create: {
        userId,
        token,
        expiresAt,
      },
    });

    return {
      userId,
      token,
      expiresAt,
    };
  }

  async findByUserId(userId: string): Promise<Auth | null> {
    const session = await prisma.authentication.findUnique({
      where: { userId },
    });

    if (!session) {
      return null;
    }

    return {
      userId: session.userId,
      token: session.token,
      expiresAt: session.expiresAt,
    };
  }

  async logout(tokenOrUserId: string): Promise<void> {
    await prisma.authentication.deleteMany({
      where: {
        OR: [{ token: tokenOrUserId }, { userId: tokenOrUserId }],
      },
    });
  }
}

