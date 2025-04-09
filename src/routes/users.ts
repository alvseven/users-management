import { Router } from "express";

import { usersController } from "../controllers/users";
import { verifyToken } from "../middlewares/verify-token";

export const usersRoutes = Router();

const { create, getAll, login } = usersController();

usersRoutes.get("/", verifyToken, getAll);
usersRoutes.post("/", create);
usersRoutes.post("/login", login);
