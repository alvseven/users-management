import { usersService } from "../services/users";
import { usersRepository } from "../repositories/users";
import { hashSync, compareSync } from "bcryptjs";
import jwt from "jsonwebtoken";
import { cpfMask } from "../helpers/cpf-mask";
import { success } from "../helpers/api-response";

jest.mock("../repositories/users");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../helpers/cpf-mask");
jest.mock("../helpers/api-response", () => ({
  success: jest.fn(),
  error: jest.fn((message, code) => ({
    status: "error",
    message,
    code
  }))
}));

jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn()
      }
    })),
  };
});

jest.mock("../config/envs", () => ({
  parsedEnvs: {
    JWT_SECRET: "test-secret",
    JWT_EXPIRES_IN: "1h",
    PORT: 3333,
    API_URL: "http://localhost:3333"
  }
}));

describe("UsersService", () => {

  const mockUser = {
    name: "Test User",
    email: "test@example.com",
    document: "12345678901",
    password: "Password@123"
  };

  const mockCreatedUser = {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    document: cpfMask("12345678901"), 
    createdAt: new Date()
  };

  const mockUserWithPassword = {
    ...mockCreatedUser,
    document: "12345678901", 
    password: "hashed_Password@123"
  };

  const mockCreate = jest.fn();
  const mockGetAll = jest.fn();
  const mockFindByEmail = jest.fn();
  const mockFindByDocument = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    

    (usersRepository as jest.Mock).mockReturnValue({
      create: mockCreate,
      getAll: mockGetAll,
      findByEmail: mockFindByEmail,
      findByDocument: mockFindByDocument
    });

    (hashSync as jest.Mock).mockImplementation(password => `hashed_${password}`);
    (compareSync as jest.Mock).mockReturnValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mock-jwt-token");
    (cpfMask as jest.Mock).mockImplementation(doc => `123.456.789-01`);
    

    (success as jest.Mock).mockImplementation((data, code = 200) => ({
      status: "success",
      data,
      code
    }));
    
    mockFindByEmail.mockResolvedValue(null);
    mockFindByDocument.mockResolvedValue(null);
    mockCreate.mockResolvedValue(mockCreatedUser);
    mockGetAll.mockResolvedValue([mockCreatedUser]);
  });

  describe("createUser", () => {
    it("should create a user successfully with masked CPF and no password returned", async () => {

           const maskedCpf = "123.***.***-01";
      
      const userWithMaskedCpf = {
        ...mockCreatedUser,
        document: maskedCpf
      };
      
      mockCreate.mockResolvedValueOnce(userWithMaskedCpf);
      (cpfMask as jest.Mock).mockReturnValueOnce(maskedCpf);
      
      const result = await usersService().createUser(mockUser);
      
      expect(result.status).toBe("success");
      expect(result.code).toBe(201);
      
      // @ts-ignore
      expect(result.data).not.toHaveProperty("password");
      // @ts-ignore
      expect(result.data.document).toBe(maskedCpf);
      
      expect(mockFindByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(mockFindByDocument).toHaveBeenCalledWith(mockUser.document);
      expect(hashSync).toHaveBeenCalledWith(mockUser.password);
      expect(mockCreate).toHaveBeenCalledWith({
        ...mockUser,
        password: `hashed_${mockUser.password}`
      });
    });

    it("should return error if email is already in use", async () => {
 
      mockFindByEmail.mockResolvedValueOnce(mockUserWithPassword);
      
      const result = await usersService().createUser(mockUser);
      

      expect(result.status).toBe("error");
      // @ts-ignore
      expect(result.message).toBe("O email já está sendo utilizado");
      expect(result.code).toBe(409);
      

      expect(mockFindByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it("should return error if document is already in use", async () => {

      mockFindByDocument.mockResolvedValueOnce(mockUserWithPassword);
      
      const result = await usersService().createUser(mockUser);
      
  
      expect(result.status).toBe("error");
      // @ts-ignore
      expect(result.message).toBe("O CPF já está sendo utilizado");
      expect(result.code).toBe(409);
      
      
      expect(mockFindByDocument).toHaveBeenCalledWith(mockUser.document);
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  describe("getUsers", () => {
    it("should return all users with masked CPFs and no passwords", async () => {
           const maskedCpf = "123.***.***-01";
      
      const usersWithMaskedCPF = [
        {
          ...mockCreatedUser,
          document: maskedCpf
        }
      ];
      
      mockGetAll.mockResolvedValueOnce(usersWithMaskedCPF);
      (cpfMask as jest.Mock).mockReturnValueOnce(maskedCpf);
      
      const result = await usersService().getUsers();
      
      expect(result.status).toBe("success");
      expect(result.code).toBe(200);
  
      const users = result.data;
      expect(users).toHaveLength(1);
      expect(users[0]).not.toHaveProperty("password");
      expect(users[0].document).toBe(maskedCpf);

      expect(mockGetAll).toHaveBeenCalled();
    });
  });

  describe("authenticate", () => {
    const loginCredentials = {
      email: "test@example.com",
      password: "Password@123"
    };

    it("should return a token when credentials are valid", async () => {

      mockFindByEmail.mockResolvedValueOnce(mockUserWithPassword);
      
      
      (success as jest.Mock).mockReturnValueOnce({
        status: "success",
        data: {
          token: "mock-jwt-token"
        },
        code: 200
      });
      
      const result = await usersService().authenticate(loginCredentials);
      
     
      expect(result.status).toBe("success");
      expect(result.code).toBe(200);
      // @ts-ignore
      expect(result.data).toEqual({ token: "mock-jwt-token" });
      
  
      expect(mockFindByEmail).toHaveBeenCalledWith(loginCredentials.email);
      expect(compareSync).toHaveBeenCalledWith(loginCredentials.password, mockUserWithPassword.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: mockUserWithPassword.id,
          email: mockUserWithPassword.email
        },
        "test-secret",
        {
          expiresIn: "1h"
        }
      );
      
   
      expect(success).toHaveBeenCalledWith({ token: "mock-jwt-token" }, 200);
    });

    it("should return error if email is not found", async () => {
      mockFindByEmail.mockResolvedValueOnce(null);
      
      const result = await usersService().authenticate(loginCredentials);

      expect(mockFindByEmail).toHaveBeenCalledWith(loginCredentials.email);
      expect(compareSync).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();

      expect(result.status).toBe("error");
      // @ts-ignore
      expect(result.message).toBe("Email e/ou senha incorreto(s)");
      expect(result.code).toBe(401);
    });

    it("should return error if password is incorrect", async () => {
      mockFindByEmail.mockResolvedValueOnce(mockUserWithPassword);
      (compareSync as jest.Mock).mockReturnValueOnce(false);
      
      const result = await usersService().authenticate(loginCredentials);

      expect(mockFindByEmail).toHaveBeenCalledWith(loginCredentials.email);
      expect(compareSync).toHaveBeenCalledWith(loginCredentials.password, mockUserWithPassword.password);
      expect(jwt.sign).not.toHaveBeenCalled();

      expect(result.status).toBe("error");
      // @ts-ignore
      expect(result.message).toBe("Email e/ou senha incorreto(s)");
      expect(result.code).toBe(401);
    });
  });
});