import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { expect, it, describe, beforeEach } from "vitest";
import { FetchNearByGymsUseCase } from "./fetchnearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearByGymsUseCase;

describe("Search Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearByGymsUseCase(gymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    // 1.1041397,-66.268836
    await gymsRepository.create({
      title: "Near Gym",
      description: "",
      phone: "",
      latitude: -22.2451207,
      longitude: -45.7045176,
    });

    await gymsRepository.create({
      title: "Far Gym",
      description: "",
      phone: "",
      latitude: 1.1041397,
      longitude: -66.268836,
    });

    const { gyms } = await sut.execute({
      userLatitude: -22.2451207,
      userLongitude: -45.7045176,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
