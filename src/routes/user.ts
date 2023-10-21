import { FastifyInstance } from "fastify";
import crypto from "crypto";
import { knex } from "../database";
import { z } from "zod";
import bcrypt from "bcrypt";

export async function userRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    const users = await knex("user").select();

    return {
      users,
    };
  });

  app.post("/register", async (req, res) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      lastname: z.string(),
      email: z.string(),
      password: z.string(),
    });

    const id = crypto.randomUUID();

    const { name, lastname, email, password } = createUserBodySchema.parse(
      req.body,
    );
    const hashPassword = await bcrypt.hash(password, 10);

    await knex("user").insert({
      id,
      name,
      lastname,
      email,
      hashPassword,
    });

    return res.status(201).send({ id });
  });

  app.post("/login", async (req, res) => {
    const loginUserBodySchema = z.object({
      email: z.string(),
      password: z.string(),
    });

    const { email, password } = loginUserBodySchema.parse(req.body);

    try {
      const user = await knex("user").where({ email }).first();

      if (!user || !(await bcrypt.compare(password, user.hashPassword))) {
        res.code(401).send({ error: "Credenciais inválidas." });
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
