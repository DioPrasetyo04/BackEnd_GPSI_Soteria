import type { UserInterfaceRepositories } from "../../user/interfaces/IUserRepositories";
import type { Auth } from "../data_interfaces/AuthenticationInterface";
import type { AuthInterfaceRepositories } from "../interfaces/IAuthRepositories";
import type { Prisma } from "../../../generated/prisma/client";
import type { UserPublicInterface } from "../../user/data_interfaces/UserInterface";
export declare class AuthServices {
    private readonly authRepository;
    private readonly userRepositories;
    constructor(authRepository: AuthInterfaceRepositories, userRepositories: UserInterfaceRepositories);
    private resolveUserAuthInfo;
    login(email: string, password: string): Promise<Auth>;
    googleLogin(idToken: string): Promise<Auth>;
    facebookLogin(accessToken: string): Promise<Auth>;
    refreshToken(tokenInput: string): Promise<Auth>;
    logout(tokenOrUserId: string): Promise<void>;
    register(data: Prisma.UserCreateInput): Promise<UserPublicInterface>;
    resendApproval(email: string): Promise<{
        message: string;
        nextAllowedSeconds: number;
    }>;
    getApprovalInfo(token: string): Promise<UserPublicInterface>;
    processApproval(token: string, action: "approve" | "reject", reason?: string): Promise<{
        status: string;
        message: string;
        user: UserPublicInterface;
    }>;
}
//# sourceMappingURL=AuthServices.d.ts.map