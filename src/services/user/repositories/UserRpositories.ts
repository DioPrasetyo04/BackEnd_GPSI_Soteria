import type { Prisma } from "../../../generated/prisma/client";
import type {
  UserInterface,
  UserQueryOptions,
  UserQueryResult,
} from "../data_interfaces/UserInterface";
import type { UserInterfaceRepositories } from "../interfaces/IUserRepositories";
import { prisma } from "../../../config/database";
import {
  buildWhereClause,
  buildOrderBy,
  buildPaginationParams,
} from "../builders";

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

  async getAllUser(
    options?: UserQueryOptions,
  ): Promise<UserQueryResult> {
    const { skip, take } = buildPaginationParams(
      options?.page,
      options?.limit,
    );
    const where = buildWhereClause(options);
    const orderBy = buildOrderBy(options?.sort);

    const [totalItems, items] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
    ]);

    return {
      items,
      totalItems,
    };
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
