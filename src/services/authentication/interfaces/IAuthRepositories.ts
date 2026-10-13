import type { Auth } from "../data_interfaces/AuthenticationInterface";

export interface AuthInterfaceRepositories {
  saveSession(userId: string, token: string, expiresAt: Date): Promise<Auth>;
  findByUserId(userId: string): Promise<Auth | null>;
  logout(tokenOrUserId: string): Promise<void>;
}

