import type { Request, Response, NextFunction } from "express";
import type { CustomRequest } from "../../../types/Request";
export declare const login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const googleLogin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const facebookLogin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const refreshToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const resendApproval: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getApprovalInfo: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const processApproval: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const logout: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=AuthenticationController.d.ts.map