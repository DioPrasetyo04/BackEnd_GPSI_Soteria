import type { Prisma } from "../../../generated/prisma/client";
import type { UserInterface, UserQueryOptions, UserQueryResult } from "../data_interfaces/UserInterface";
import type { UserInterfaceRepositories } from "../interfaces/IUserRepositories";
export declare class UserRepositories implements UserInterfaceRepositories {
    createUser(data: Prisma.UserCreateInput): Promise<UserInterface>;
    getUser(id: string): Promise<UserInterface | null>;
    getUserByEmail(email: string): Promise<UserInterface | null>;
    getUserByApprovalToken(token: string): Promise<UserInterface | null>;
    getAllUser(): Promise<UserInterface[]>;
    getUsers(options?: UserQueryOptions): Promise<UserQueryResult>;
    updateUser(id: string, data: Prisma.UserUpdateInput): Promise<UserInterface>;
    deleteUser(id: string): Promise<boolean>;
    countUser(where?: Prisma.UserWhereInput): Promise<number>;
}
//# sourceMappingURL=UserRpositories.d.ts.map