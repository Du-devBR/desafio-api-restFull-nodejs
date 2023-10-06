import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { execSync } from "child_process";

describe("User routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  describe("User regitration", () => {
    test("User can regiter", async () => {
      const response = await request(app.server).post("/user").send({
        name: "New user",
        lastname: "Lastname User",
        email: "newuser@teste.com",
      });
      expect(response.statusCode).toEqual(201);
    });
  });

  describe("User can manege meals", () => {
    let idUser: string;
    let idMeal: string;

    beforeEach(async () => {
      const createUserResponse = await request(app.server).post("/user").send({
        name: "New user",
        lastname: "Lastname User",
        email: "newuser@teste.com",
      });
      idUser = createUserResponse.body.id;

      const createMealresponse = await request(app.server)
        .post(`/user/${idUser}/meal`)
        .send({
          name: "Refeição teste",
          description: "Refeição feita para teste",
          isDiet: true,
          userId: idUser,
        });

      idMeal = createMealresponse.body.id;
    });
    test("User can register a meal", async () => {
      const response = await request(app.server)
        .post(`/user/${idUser}/meal`)
        .send({
          name: "Refeição teste",
          description: "Refeição feita para teste",
          isDiet: true,
          userId: idUser,
        });
      expect(response.statusCode).toEqual(201);
    });
    test("User can view yours meals", async () => {
      const response = await request(app.server).get(`/user/${idUser}/meal`);
      expect(response.statusCode).toEqual(200);
    });
    test("User can view details of a meal by id", async () => {
      const response = await request(app.server).get(`/user/${idUser}/meal`);

      expect(response.statusCode).toEqual(200);
    });
    test("User can edit a meal by id", async () => {
      const response = await request(app.server)
        .put(`/user/${idUser}/meal/${idMeal}`)
        .send({
          name: "Modificado refeição",
          description: "Modificado Refeição feita para teste",
          isDiet: true,
        });

      expect(response.statusCode).toEqual(200);
    });

    test("User can delete a meal by id", async () => {
      const response = await request(app.server).delete(
        `/user/${idUser}/meal/${idMeal}`,
      );
      expect(response.statusCode).toEqual(200);
    });
  });

  describe("User metrics", () => {
    test("User can view your metrics", async () => {
      const createUserResponse = await request(app.server).post("/user").send({
        name: "New user",
        lastname: "Lastname User",
        email: "newuser@teste.com",
      });

      const idUser = createUserResponse.body.id;

      await request(app.server).post(`/user/${idUser}/meal`).send({
        name: "Refeição teste",
        description: "Refeição feita para teste",
        isDiet: true,
        userId: idUser,
      });

      const response = await request(app.server).get(`/user/${idUser}/metrics`);

      expect(response.statusCode).toEqual(200);
    });
  });
});
