import { expect, it, describe, beforeEach, vi, afterEach } from "vitest";
import { CheckInUseCase } from "@/use-cases/check-in";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    gymsRepository.items.push({
      id: "gym-id-01",
      title: "JavaScript 01",
      description: "",
      phone: "",
      latitude: new Decimal(-22.3473138),
      longitude: new Decimal(-45.7900359),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-id-01",
      userId: "user-id-01",
      userLatitude: -22.3473138,
      userLongitude: -45.7900359,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-id-01",
      userId: "user-id-01",
      userLatitude: -22.3473138,
      userLongitude: -45.7900359,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-id-01",
        userId: "user-id-01",
        userLatitude: -22.3473138,
        userLongitude: -45.7900359,
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-id-01",
      userId: "user-id-01",
      userLatitude: -22.3473138,
      userLongitude: -45.7900359,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-id-01",
      userId: "user-id-01",
      userLatitude: -22.3473138,
      userLongitude: -45.7900359,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-id-02",
      title: "JavaScript 01",
      description: "",
      phone: "",
      latitude: new Decimal(-22.2451207),
      longitude: new Decimal(-45.7045176),
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-id-02",
        userId: "user-id-01",
        userLatitude: -22.3473138,
        userLongitude: -45.7900359,
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
