import { FetchNearByGymsUseCase } from "../fetchnearby-gyms";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repositories";

export function makeFetchUserCheckInsHistoryUseCase() {
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new FetchNearByGymsUseCase(gymsRepository);

  return useCase;
}
