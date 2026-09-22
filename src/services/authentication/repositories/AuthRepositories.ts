import type { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../../config/database";
import type { Auth } from "../data_interfaces/AuthenticationInterface";
import type { UserPublicInterface } from "../../user/data_interfaces/UserInterface";
import jwt from "jsonwebtoken";
import { expiresInMs } from "../../../utils/helpers";
import type { AuthInterfaceRepositories } from "../interfaces/IAuthRepositories";

export class AuthRepositories implements AuthInterfaceRepositories {
  async login(email: string): Promise<Auth> {
    const findEmailUser = await prisma.user.findUnique({ where: { email } });

    if (!findEmailUser) {
      throw new Error("User email not found");
    }

    const secretKey = (process.env.JWT_SECRET_KEY ?? "secret") as jwt.Secret;
    const expValue = process.env.JWT_EXPIRES_IN ?? "1h";
    const exp = expValue as jwt.SignOptions["expiresIn"];

    // Menyediakan payload id dan data.id untuk kompatibilitas penuh
    const token = jwt.sign(
      {
        id: findEmailUser.id,
        data: { id: findEmailUser.id },
      },
      secretKey,
      { expiresIn: exp },
    );

    const expiresAt = new Date(Date.now() + expiresInMs(expValue));

    await prisma.authentication.upsert({
      where: {
        userId: findEmailUser.id,
      },
      update: {
        token,
        expiresAt,
      },
      create: {
        userId: findEmailUser.id,
        token,
        expiresAt,
      },
    });

    const data: Auth = {
      userId: findEmailUser.id,
      token,
      expiresAt,
    };

    return data;
  }

  async logout(tokenOrUserId: string): Promise<void> {
    await prisma.authentication.deleteMany({
      where: {
        OR: [{ token: tokenOrUserId }, { userId: tokenOrUserId }],
      },
    });
  }

  async register(data: Prisma.UserCreateInput): Promise<UserPublicInterface> {
    return prisma.user.create({ data });
  }
}
