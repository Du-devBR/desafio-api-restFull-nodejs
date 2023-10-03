import fastify from "fastify";
import crypto from "crypto";
import { knex } from "./database";
import { z } from "zod";
export const app = fastify();

app.post("/user", async (req, res) => {
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

app.get("/user", async (req) => {
  const users = await knex("user").select();

  return {
    users,
  };
});
