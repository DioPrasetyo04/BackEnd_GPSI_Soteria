import type { Auth } from "../data_interfaces/AuthenticationInterface";
import type { AuthInterfaceRepositories } from "../interfaces/IAuthRepositories";
export declare class AuthRepositories implements AuthInterfaceRepositories {
    saveSession(userId: string, token: string, expiresAt: Date): Promise<Auth>;
    findByUserId(userId: string): Promise<Auth | null>;
    logout(tokenOrUserId: string): Promise<void>;
}
//# sourceMappingURL=AuthRepositories.d.ts.map