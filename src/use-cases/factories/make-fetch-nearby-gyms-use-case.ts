import { FetchNearByGymsUseCase } from "../fetchnearby-gyms";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repositories";

export function makeFetchNearByGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new FetchNearByGymsUseCase(gymsRepository);

  return useCase;
}
