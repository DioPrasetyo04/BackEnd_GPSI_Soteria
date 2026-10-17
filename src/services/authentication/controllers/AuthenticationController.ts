import type { Request, Response, NextFunction } from "express";
import {
  authSchema,
  googleAuthSchema,
  facebookAuthSchema,
  refreshTokenSchema,
  resendApprovalSchema,
  processApprovalSchema,
} from "../validator/AuthenticationValidator";

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
  } catch (error: any) {
    // Jika status akun PENDING atau REJECTED, teruskan error dengan metadata khusus
    if (error.code === "ACCOUNT_PENDING") {
      res.status(403).json({
        status: "fail",
        code: "ACCOUNT_PENDING",
        message: error.message,
        data: error.data || null,
      });
      return;
    }
    if (error.code === "ACCOUNT_REJECTED") {
      res.status(403).json({
        status: "fail",
        code: "ACCOUNT_REJECTED",
        message: error.message,
        data: null,
      });
      return;
    }
    next(error);
  }
};

export const googleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const parsedData = googleAuthSchema.parse(req.body);
    const result = await authServices.googleLogin(parsedData.idToken);
    responses(res, 200, "Login Google berhasil", result);
  } catch (error) {
    next(error);
  }
};

export const facebookLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const parsedData = facebookAuthSchema.parse(req.body);
    const result = await authServices.facebookLogin(parsedData.accessToken);
    responses(res, 200, "Login Facebook berhasil", result);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers?.authorization;
    const bearerToken =
      authHeader &&
      (authHeader.startsWith("Bearer ") || authHeader.startsWith("JWT "))
        ? authHeader.split(" ")[1]
        : undefined;

    const bodyToken = req.body?.refreshToken || req.body?.token;
    const tokenToRefresh = bodyToken || bearerToken;

    if (!tokenToRefresh) {
      responses(res, 400, "Token atau refresh token tidak ditemukan", null);
      return;
    }

    const result = await authServices.refreshToken(tokenToRefresh);
    responses(res, 200, "Token berhasil diperbarui", result);
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
    responses(
      res,
      201,
      "Pendaftaran berhasil. Akun Anda sedang menunggu verifikasi oleh Administrator.",
      result,
    );
  } catch (error) {
    next(error);
  }
};

export const resendApproval = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const parsed = resendApprovalSchema.parse(req.body);
    const result = await authServices.resendApproval(parsed.email);
    responses(res, 200, result.message, result);
  } catch (error: any) {
    if (error.statusCode === 429 || error.status === 429) {
      res.status(429).json({
        status: "fail",
        code: "RATE_LIMITED",
        message: error.message,
        data: error.data || null,
      });
      return;
    }
    next(error);
  }
};

export const getApprovalInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = String(req.query.token || req.params.token || "");
    const result = await authServices.getApprovalInfo(token);
    responses(res, 200, "Informasi pendaftaran ditemukan", result);
  } catch (error) {
    next(error);
  }
};

export const processApproval = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const parsed = processApprovalSchema.parse(req.body);
    const result = await authServices.processApproval(
      parsed.token,
      parsed.action,
      parsed.reason,
    );
    responses(res, 200, result.message, result);
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
