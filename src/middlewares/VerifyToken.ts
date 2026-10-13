import type { Response, NextFunction } from "express";
import type { CustomRequest, Role } from "../types/Request";
import { UserRepositories } from "../services/user/repositories/UserRpositories";
import { UserServices } from "../services/user/services/UserServices";
import { AuthRepositories } from "../services/authentication/repositories/AuthRepositories";
import { verifyJwtToken } from "../utils/jwt";
import responses from "../utils/response";

const userRepo = new UserRepositories();
const userServices = new UserServices(userRepo);
const authRepo = new AuthRepositories();

export const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers?.authorization;

  if (!authHeader) {
    return responses(
      res,
      401,
      "Unauthorized",
      "Not Authorization Please Authentication",
    );
  }

  const [prefix, token] = authHeader.split(" ");

  if ((prefix === "JWT" || prefix === "Bearer") && token) {
    try {
      const decoded = verifyJwtToken(token);
      const userId = decoded.data?.id || decoded.id;

      if (!userId) {
        return responses(res, 401, "Unauthorized", null);
      }

      const [findUser, session] = await Promise.all([
        userServices.getUserById(userId).catch(() => null),
        authRepo.findByUserId(userId).catch(() => null),
      ]);

      if (!findUser) {
        return responses(res, 401, "User not found", null);
      }

      // Pastikan session aktif di database sesuai dengan token (mencegah token yang sudah logout / di-revoke)
      if (!session || session.token !== token) {
        return responses(res, 401, "Unauthorized", null);
      }

      // Pastikan session belum kadaluwarsa di database
      if (session.expiresAt && session.expiresAt <= new Date()) {
        return responses(res, 401, "Unauthorized", null);
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

    return responses(
      res,
      403,
      "Forbidden",
      "Access denied: You do not have permission to access this resource",
    );
  };

export const verifyRoles =
  (...types: Role[]) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req?.user?.role && types.includes(req.user.role)) {
      return next();
    }

    return responses(
      res,
      403,
      "Forbidden",
      "Access denied: You do not have permission to access this resource",
    );
  };
