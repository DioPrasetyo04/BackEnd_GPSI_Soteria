import type { Prisma } from "../../../generated/prisma/client";
import type { Auth } from "../data_interfaces/AuthenticationInterface";
import type { UserPublicInterface } from "../../user/data_interfaces/UserInterface";

export interface AuthInterfaceRepositories {
  register(data: Prisma.UserCreateInput): Promise<UserPublicInterface>;
  login(email: string): Promise<Auth>;
  logout(tokenOrUserId: string): Promise<void>;
}
