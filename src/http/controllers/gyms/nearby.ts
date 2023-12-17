import { FastifyReply, FastifyRequest } from "fastify";

import { z } from "zod";
import { makeFetchNearByGymsUseCase } from "@/use-cases/factories/make-fetch-nearby-gyms-use-case";

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymQuerySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } = nearbyGymQuerySchema.parse(request.query);

  const fetchNearbyGymUseCase = makeFetchNearByGymsUseCase();

  const { gyms } = await fetchNearbyGymUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(201).send({ gyms });
}
