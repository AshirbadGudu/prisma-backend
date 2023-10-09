import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { configs, prisma } from "../configs";

interface GetUsersOptions {
  skip?: number;
  take?: number;
  search?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const userService = {
  // AUTH
  async signup(input: Prisma.UserCreateInput) {
    // Before creating check if the email already exists or not
    console.log(input);
    const isEmailExists = await prisma.user.findUnique({
      where: { email: input.email },
    });
    if (isEmailExists) throw new Error("Email already exists!");
    const { password, ...rest } = input;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        password: hashedPassword,
        ...rest,
      },
    });
    return user;
  },
  async login(input: LoginInput) {
    const { password } = input;
    const email = input.email.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid login attempt");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid password");
    const token = jwt.sign({ userId: user.id }, configs.JWT_SECRET);
    return {
      user,
      token,
    };
  },
  // CRUD
  async create(input: Prisma.UserCreateInput) {
    // Before creating check if the email already exists or not
    const isEmailExists = await prisma.user.findUnique({
      where: { email: input.email },
    });
    if (isEmailExists) throw new Error("Email already exists!");
    const { password, ...rest } = input;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        ...rest,
        password: hashedPassword,
      },
    });
    return user;
  },
  async readAll(options: GetUsersOptions = {}) {
    const { skip = 0, take = 20, search } = options;
    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};
    const users = await prisma.user.findMany({
      where,
      skip,
      take,
      include: { Business: true },
    });

    return {
      users,
      pagination: { skip, take, total: await prisma.user.count({ where }) },
    };
  },
  async update(id: string, data: Prisma.UserUpdateInput) {
    // check if the user exists or not
    const isUserExists = await prisma.user.findUnique({
      where: { id },
    });
    if (!isUserExists) throw new Error("User not found!");
    const { email } = data;
    // Before updating email check if it already exists or not
    const isEmailExists =
      typeof email === "string"
        ? await prisma.user.findUnique({ where: { email } })
        : false;
    if (isEmailExists) throw new Error("Email already exists!");
    const { password, ...rest } = data;
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...rest,
        password:
          typeof password === "string"
            ? await bcrypt.hash(password, 10)
            : undefined,
      },
    });
    return updatedUser;
  },
  async delete(id: string) {
    // check if the user exists or not
    const isUserExists = await prisma.user.findUnique({
      where: { id },
    });
    if (!isUserExists) throw new Error("User not found!");
    const deletedUser = await prisma.user.delete({ where: { id } });
    return deletedUser;
  },
  async readById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { _count: true },
    });
    return user;
  },
};
