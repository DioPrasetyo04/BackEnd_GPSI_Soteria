import type { Prisma } from "../../../generated/prisma/client";
import type { UserInterface } from "../data_interfaces/UserInterface";

export interface UserInterfaceRepositories {
  createUser(data: Prisma.UserCreateInput): Promise<UserInterface>;
  getUser(id: string): Promise<UserInterface | null>;
  getUserByEmail(email: string): Promise<UserInterface | null>;
  getAllUser(): Promise<UserInterface[]>;
  updateUser(id: string, data: Prisma.UserUpdateInput): Promise<UserInterface>;
  deleteUser(id: string): Promise<boolean>;
}
