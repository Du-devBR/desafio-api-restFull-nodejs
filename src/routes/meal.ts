import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import crypto from "crypto";

export async function mealRoutes(app: FastifyInstance) {
  // GET MEALS
  app.get("/", async (req, res) => {
    const getIdParamsSchema = z.object({
      userId: z.string().uuid(),
    });
    try {
      const { userId } = getIdParamsSchema.parse(req.params);
      const meal = await knex("meal").where("userId", userId).select();

      return res.code(200).send({
        meal,
      });
    } catch (error) {
      return res.code(401).send({
        message: "User Unauthorized",
      });
    }
  });

  // GET MEALS:ID
  app.get("/:id", async (req, res) => {
    const getIdParamsSchema = z.object({
      id: z.string().uuid(),
      userId: z.string().uuid(),
    });

    try {
      const { id, userId } = getIdParamsSchema.parse(req.params);
      const meal = await knex("meal")
        .where("id", id)
        .where("userId", userId)
        .select();
      if (meal.length <= 0) {
        return res.code(404).send({
          message: "Meal not registered",
        });
      }
      return {
        meal,
      };
    } catch (error) {
      return res.code(400).send({
        message: "meal id format is not correct, please enter a 'uuid'",
      });
    }
  });

  // POST MEALS
  app.post("/", async (req, res) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isDiet: z.boolean(),
      userId: z.string(),
    });

    const { name, description, isDiet, userId } = createUserBodySchema.parse(
      req.body,
    );
    await knex("meal").insert({
      id: crypto.randomUUID(),
      name,
      description,
      isDiet,
      userId,
    });

    return res.status(201).send();
  });
}
