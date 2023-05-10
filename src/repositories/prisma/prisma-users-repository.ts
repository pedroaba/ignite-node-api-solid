import { Prisma, User } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { UsersRepository } from "@/repositories/users-repository";

export class PrismaUsersRepository implements UsersRepository {
  async findById(userId: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
