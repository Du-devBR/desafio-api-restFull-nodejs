import { FastifyInstance } from "fastify";
import crypto from "crypto";
import { knex } from "../database";
import { z } from "zod";
import bcrypt from "bcrypt";

export async function userRoutes(app: FastifyInstance) {
  app.post("register", async (req, res) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      lastname: z.string(),
      email: z.string(),
      password: z.string().min(8),
    });

    const id = crypto.randomUUID();

    const { name, lastname, email, password } = createUserBodySchema.parse(
      req.body,
    );

    try {
      const hashPassword = await bcrypt.hash(password, 10);

      const userHasRegitration = await knex("user")
        .where("email", email)
        .first();

      if (userHasRegitration) {
        return res.status(400).send({ message: "Email already exists" });
      }
      await knex("user").insert({
        id,
        name,
        lastname,
        email,
        hashPassword,
      });
      return res.status(201).send({ id });
    } catch (error) {
      return res.status(404);
    }
  });

  app.post("login", async (req, res) => {
    const loginUserBodySchema = z.object({
      email: z.string(),
      password: z.string(),
    });

    const { email, password } = loginUserBodySchema.parse(req.body);

    try {
      const user = await knex("user").where({ email }).first();

      if (!user || !(await bcrypt.compare(password, user.hashPassword))) {
        res.code(401).send({ error: "Invalid crfedentials for the user." });
        return;
      }

      const token = await res.jwtSign(
        {},
        {
          sign: {
            sub: user.id,
          },
        },
      );
      return res.status(201).send({ token });
    } catch (error) {
      console.error(error);
    }
  });
}
