import type { Request } from "express";

export type Role =
  | "ADMIN"
  | "SUPER_ADMIN"
  | "PENGELOLA"
  | "KOORSEK"
  | "PHMJ"
  | "MAJELIS";

export type UserPayload = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export interface CustomRequest extends Request {
  user?: UserPayload;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
