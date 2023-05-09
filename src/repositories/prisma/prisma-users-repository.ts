import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { UsersRepository } from "@/repositories/users-repository";

export class PrismaUsersRepository implements UsersRepository {
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
