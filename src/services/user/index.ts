import express from "express";
import userRoutes from "./routes/UserRoutes";
import {
  verifyRoles,
  verifyToken,
  verifyRoleOrPermission,
} from "../../middlewares/VerifyToken";

const indexUserRoutes: express.Router = express.Router();

// Autentikasi token pengguna
indexUserRoutes.use(verifyToken);

// Multi-enable authorization: Lolos jika memiliki salah satu role (ADMIN, SUPER_ADMIN)
// atau memiliki permission 'users.view' / 'users.manage'
indexUserRoutes.use(
  verifyRoleOrPermission({
    roles: ["ADMIN", "SUPER_ADMIN"],
    permissions: ["users.view", "users.manage"],
  }),
);

indexUserRoutes.use(userRoutes);

export default indexUserRoutes;
