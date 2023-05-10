import { hash } from "bcryptjs";
import { expect, it, describe, beforeEach } from "vitest";

import { InMemoryUsersReprository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let usersRepository: InMemoryUsersReprository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersReprository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it("should be able to athenticated", async () => {
    await usersRepository.create({
      name: "Jhon Doe",
      email: "jhondoe@gmail.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "jhondoe@gmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to athenticated with wrong email", async () => {
    const usersRepository = new InMemoryUsersReprository();
    const sut = new AuthenticateUseCase(usersRepository);

    await expect(() =>
      sut.execute({
        email: "jhondoe@gmail.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to athenticated with wrong password", async () => {
    const usersRepository = new InMemoryUsersReprository();
    const sut = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      name: "Jhon Doe",
      email: "jhondoe@gmail.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        email: "jhondoe@gmail.com",
        password: "123123",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
