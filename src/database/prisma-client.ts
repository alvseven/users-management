import { PrismaClient, type User } from "@prisma/client";

export const prisma = new PrismaClient();
export type UserModel = User;
