import { expect, it, describe, beforeEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe("Get User Metrics Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it("should be able to fetch check-in count from metrics", async () => {
    await checkInsRepository.create({
      gym_id: "gym_01",
      user_id: "user-id-01",
    });

    await checkInsRepository.create({
      gym_id: "gym_02",
      user_id: "user-id-01",
    });

    const { checkInsCount } = await sut.execute({
      userId: "user-id-01",
    });

    expect(checkInsCount).toEqual(2);
  });
});
