import { FastifyInstance } from "fastify";
import crypto from "crypto";
import { knex } from "../database";
import { z } from "zod";

export async function userRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    const users = await knex("user").select();

    return {
      users,
    };
  });

  app.post("/", async (req, res) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      lastname: z.string(),
      email: z.string(),
    });

    const { name, lastname, email } = createUserBodySchema.parse(req.body);
    await knex("user").insert({
      id: crypto.randomUUID(),
      name,
      lastname,
      email,
    });

    return res.status(201).send();
  });
}
