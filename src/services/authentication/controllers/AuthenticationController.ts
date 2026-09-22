import type { Request, Response, NextFunction } from "express";
import { authSchema } from "../validator/AuthenticationValidator";
import { AuthRepositories } from "../repositories/AuthRepositories";
import { AuthServices } from "../services/AuthServices";
import { UserRepositories } from "../../user/repositories/UserRpositories";
import responses from "../../../utils/response";
import type { CustomRequest } from "../../../types/Request";

const authRepo = new AuthRepositories();
const userRepo = new UserRepositories();
const authServices = new AuthServices(authRepo, userRepo);

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const parsedData = authSchema
      .omit({
        name: true,
      })
      .parse(req.body);

    const result = await authServices.login(
      parsedData.email,
      parsedData.password,
    );

    responses(res, 200, "Login berhasil", result);
  } catch (error) {
    next(error);
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await authServices.register(req.body);
    responses(res, 201, "Register berhasil", result);
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers?.authorization;
    const token = authHeader?.split(" ")[1];
    const identifier = token || req.user?.id;

    if (!identifier) {
      responses(res, 400, "Token atau sesi login tidak ditemukan", null);
      return;
    }

    await authServices.logout(identifier);
    responses(res, 200, "Logout berhasil", null);
  } catch (error) {
    next(error);
  }
};
