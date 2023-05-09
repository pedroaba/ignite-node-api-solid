import { expect, it, describe } from "vitest";
import { RegisterUseCase } from "@/use-cases/register";
import { compare } from "bcryptjs";
import { InMemoryUsersReprository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

describe("Register Use Case", () => {
  it("should hash user password upon registration", async () => {
    const usersRepository = new InMemoryUsersReprository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "Jhon Doe",
      email: "jhondoe@gmail.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should be able to register", async () => {
    const usersRepository = new InMemoryUsersReprository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "Jhon Doe",
      email: "jhondoe@gmail.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to register with same email twice", async () => {
    const usersRepository = new InMemoryUsersReprository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const email = "jhondoe@gmail.com";

    await registerUseCase.execute({
      name: "Jhon Doe",
      email,
      password: "123456",
    });

    await expect(() =>
      registerUseCase.execute({
        name: "Jhon Doe",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
