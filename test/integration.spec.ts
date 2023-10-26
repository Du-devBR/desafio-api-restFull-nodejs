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

  describe("User authentication", () => {
    test("User can register", async () => {
      const response = await request(app.server).post("/api/register").send({
        name: "New user",
        lastname: "Lastname User",
        email: "newuser@teste.com",
        password: "12345678",
      });
      expect(response.statusCode).toEqual(201);
    });
    test("User can login", async () => {
      const response = await request(app.server).post("/api/register").send({
        name: "New user",
        lastname: "Lastname User",
        email: "newuser@teste.com",
        password: "12345678",
      });
      const userLoginResponse = await request(app.server)
        .post("/api/login")
        .send({
          email: "newuser@teste.com",
          password: "12345678",
        });
      expect(userLoginResponse.statusCode).toEqual(201);
    });
  });

  describe("User can manege meals", () => {
    let idUser: string;
    let idMeal: string;
    let authToken: string;

    beforeEach(async () => {
      const createUserResponse = await request(app.server)
        .post("/api/register")
        .send({
          name: "New user",
          lastname: "Lastname User",
          email: "newuser@teste.com",
          password: "12345678",
        });
      idUser = createUserResponse.body.id;

      const response = await request(app.server).post("/api/login").send({
        email: "newuser@teste.com",
        password: "12345678",
      });
      authToken = response.body.token;

      const createMealresponse = await request(app.server)
        .post(`/api/user/${idUser}/meal`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Refeição teste",
          description: "Refeição feita para teste",
          isDiet: true,
          createdAt: "2023-11-28T21:00:00.000-03",
          userId: idUser,
        });

      idMeal = createMealresponse.body.id;
    });
    test("User can register a meal", async () => {
      const response = await request(app.server)
        .post(`/api/user/${idUser}/meal`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Refeição teste",
          description: "Refeição feita para teste",
          isDiet: true,
          createdAt: "2023-11-28T21:00:00.000-03",
          userId: idUser,
        });
      expect(response.statusCode).toEqual(201);
    });
    test("User can view yours meals", async () => {
      const response = await request(app.server)
        .get(`/api/user/${idUser}/meal`)
        .set("Authorization", `Bearer ${authToken}`);
      expect(response.statusCode).toEqual(200);
    });
    test("User can view details of a meal by id", async () => {
      const response = await request(app.server)
        .get(`/api/user/${idUser}/meal`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.statusCode).toEqual(200);
    });
    test("User can edit a meal by id", async () => {
      const response = await request(app.server)
        .put(`/api/user/${idUser}/meal/${idMeal}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Modificado refeição",
          description: "Modificado Refeição feita para teste",
          createdAt: "2023-11-28T21:00:00.000-03",
          isDiet: true,
        });

      expect(response.statusCode).toEqual(200);
    });

    test("User can delete a meal by id", async () => {
      const response = await request(app.server)
        .delete(`/api/user/${idUser}/meal/${idMeal}`)
        .set("Authorization", `Bearer ${authToken}`);
      expect(response.statusCode).toEqual(200);
    });
  });

  describe("User metrics", () => {
    test("User can view your metrics", async () => {
      const createUserResponse = await request(app.server)
        .post("/api/register")
        .send({
          name: "New user",
          lastname: "Lastname User",
          email: "newuser@teste.com",
          password: "12345678",
        });

      const idUser = createUserResponse.body.id;

      const userLoginResponse = await request(app.server)
        .post("/api/login")
        .send({
          email: "newuser@teste.com",
          password: "12345678",
        });

      const authToken = userLoginResponse.body.token;
      console.log(authToken);

      await request(app.server)
        .post(`/api/user/${idUser}/meal`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Refeição teste",
          description: "Refeição feita para teste",
          isDiet: true,
          createdAt: "2023-11-28T21:00:00.000-03",
          userId: idUser,
        });

      const response = await request(app.server)
        .get(`/api/user/${idUser}/metrics`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.statusCode).toEqual(200);
    });
  });
});
