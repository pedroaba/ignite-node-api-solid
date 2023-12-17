import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Check-in Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to validate check-in", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const user = await prisma.user.findFirstOrThrow();
    const gym = await prisma.gym.create({
      data: {
        title: "JavaScript Gym",
        description: "Some description.",
        phone: "1199999999",
        latitude: -22.3473138,
        longitude: -45.7900359,
      },
    });

    const checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
      },
    });

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(204);

    const checkInAfterValidation = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    });

    expect(checkInAfterValidation.validated_at).toEqual(expect.any(Date));
  });
});
