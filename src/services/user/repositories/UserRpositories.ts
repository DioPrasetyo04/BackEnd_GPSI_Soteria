import type { Prisma } from "../../../generated/prisma/client";
import type { UserInterface } from "../data_interfaces/UserInterface";
import type { UserInterfaceRepositories } from "../interfaces/IUserRepositories";
import { prisma } from "../../../config/database";

export class UserRepositories implements UserInterfaceRepositories {
  async createUser(data: Prisma.UserCreateInput): Promise<UserInterface> {
    return prisma.user.create({ data });
  }

  async getUser(id: string): Promise<UserInterface | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<UserInterface | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async getAllUser(): Promise<UserInterface[]> {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async updateUser(
    id: string,
    data: Prisma.UserUpdateInput,
  ): Promise<UserInterface> {
    return prisma.user.update({ where: { id }, data });
  }

  async deleteUser(id: string): Promise<boolean> {
    const deleted = await prisma.user.delete({ where: { id } });
    return !!deleted;
  }
}
