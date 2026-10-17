import type { UserPublicInterface } from "../../user/data_interfaces/UserInterface";

export interface Auth {
  id?: string;
  userId?: string;
  token?: string;
  refreshToken?: string;
  expiresAt?: Date;
  name?: string;
  email?: string;
  role?: string;
  roles?: string[];
  permissions?: string[];
  user?: UserPublicInterface;
}

