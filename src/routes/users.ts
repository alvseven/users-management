import { Router } from "express";
import { usersController } from "../controllers/users";
import { verifyToken } from "../middlewares/verify-token";

export const usersRoutes = Router();
const { create, getAll, login } = usersController();

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: Gerenciamento de usuários
 */

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários cadastrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListUsersResponse'
 *       401:
 *         description: Token não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenNotFoundResponse'
 *       403:
 *         description: Token inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InvalidTokenResponse'
 */
usersRoutes.get("/", verifyToken, getAll);

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserResponse'
 *       409:
 *         description: Conflito - Email ou CPF já cadastrado
 *         content:
 *           application/json:
 *             oneOf:
 *               - $ref: '#/components/schemas/EmailConflictResponse'
 *               - $ref: '#/components/schemas/DocumentConflictResponse'
 */
usersRoutes.post("/", create);

/**
 * @openapi
 * /users/login:
 *   post:
 *     summary: Autentica um usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: error
 *               message: Email e/ou senha incorreto(s)
 */
usersRoutes.post("/login", login);
