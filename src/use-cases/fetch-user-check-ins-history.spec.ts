import { expect, it, describe, beforeEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { FetchUserCheckInsUseCase } from "./fetch-user-check-ins-history";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInsUseCase;

describe("Fetch User Check-in History Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInsUseCase(checkInsRepository);
  });

  it("should be able to fetch check-in history", async () => {
    await checkInsRepository.create({
      gym_id: "gym_01",
      user_id: "user-id-01",
    });

    await checkInsRepository.create({
      gym_id: "gym_02",
      user_id: "user-id-01",
    });

    const { checkIns } = await sut.execute({
      userId: "user-id-01",
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym_01" }),
      expect.objectContaining({ gym_id: "gym_02" }),
    ]);
  });

  it("should be able to fetch paginated check-in history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym_${i}`,
        user_id: "user-id-01",
      });
    }

    const { checkIns } = await sut.execute({
      userId: "user-id-01",
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym_21" }),
      expect.objectContaining({ gym_id: "gym_22" }),
    ]);
  });
});
