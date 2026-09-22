import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { CustomRequest, Role } from "../types/Request";
import { UserRepositories } from "../services/user/repositories/UserRpositories";
import { UserServices } from "../services/user/services/UserServices";
import responses from "../utils/response";

type JWTPayload = {
  data?: {
    id: string;
  };
  id?: string;
  iat?: number;
  exp?: number;
};

const userRepo = new UserRepositories();
const userServices = new UserServices(userRepo);

export const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const secretKey = process.env.JWT_SECRET_KEY ?? "secret";
  const authHeader = req.headers?.authorization;

  if (!authHeader) {
    return responses(res, 401, "Unauthorized", null);
  }

  const [prefix, token] = authHeader.split(" ");

  if ((prefix === "JWT" || prefix === "Bearer") && token) {
    try {
      const decoded = jwt.verify(token, secretKey) as JWTPayload;
      const userId = decoded.data?.id || decoded.id;

      if (!userId) {
        return responses(res, 401, "Unauthorized", null);
      }

      const findUser = await userServices.getUserById(userId);
      if (!findUser) {
        return responses(res, 401, "User not found", null);
      }

      req.user = {
        id: findUser.id,
        name: findUser.name,
        email: findUser.email,
        role: findUser.role as Role,
      };

      return next();
    } catch {
      return responses(res, 401, "Unauthorized", null);
    }
  } else {
    return responses(res, 401, "Unauthorized", null);
  }
};

export const verifyRole =
  (type: Role) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req?.user?.role === type) {
      return next();
    }

    return responses(res, 403, "Forbidden: Akses ditolak", null);
  };

export const verifyRoles =
  (...types: Role[]) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req?.user?.role && types.includes(req.user.role)) {
      return next();
    }

    return responses(res, 403, "Forbidden: Akses ditolak", null);
  };
