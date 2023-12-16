import { Gym, Prisma } from "@prisma/client";
import { FindManyNearByParams, GymsRepository } from "../gyms-repository";
import { prisma } from "@/lib/prisma";

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    });

    return gym;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    });

    return gym;
  }

  async findManyNearBy({ latitude, longitude }: FindManyNearByParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT 
        *
      from gyms
      WHERE ( 
        6371 * acos(
          cos(
            radians(${latitude})) * cos(radians(latitude)
          ) * 

          cos(
            radians(longitude) - radians(${longitude})
          ) + 

          sin(
            radians(${latitude})) * sin(radians(latitude)
          )
        ) 
      ) <= 10
    `;

    return gyms;
  }

  async searchMany(query: string, page: number) {
    const MAX_PER_PAGE = 20;
    const currentPageToFetch = (page - 1) * MAX_PER_PAGE;

    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: MAX_PER_PAGE,
      skip: currentPageToFetch,
    });

    return gyms;
  }
}
