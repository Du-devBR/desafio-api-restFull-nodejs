import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import crypto from "crypto";

export async function mealRoutes(app: FastifyInstance) {
  // GET MEALS
  app.get("/", async (req, res) => {
    const getIdParamsSchema = z.object({
      idUser: z.string().uuid(),
    });
    try {
      const { idUser } = getIdParamsSchema.parse(req.params);
      const meals = await knex("meal").where("userId", idUser).select();

      return res.code(200).send({
        meals,
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
      idUser: z.string().uuid(),
    });

    try {
      const { id, idUser } = getIdParamsSchema.parse(req.params);
      const meal = await knex("meal")
        .where("id", id)
        .where("userId", idUser)
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
    const id = crypto.randomUUID();
    const getIdParamsSchema = z.object({
      idUser: z.string(),
    });
    const createUserBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isDiet: z.boolean(),
    });

    try {
      const { idUser } = getIdParamsSchema.parse(req.params);
      const { name, description, isDiet } = createUserBodySchema.parse(
        req.body,
      );
      await knex("meal").insert({
        id,
        name,
        description,
        isDiet,
        userId: idUser,
      });

      return res.status(201).send({ id });
    } catch (error) {
      return res.code(404).send({
        message: "error in the request, please check body ",
      });
    }
  });

  // PUT MEAL

  app.put("/:id", async (req, res) => {
    const getIdParamsSchema = z.object({
      id: z.string(),
      idUser: z.string(),
    });
    const uptadeUserBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isDiet: z.boolean(),
    });

    try {
      const { id, idUser } = getIdParamsSchema.parse(req.params);
      const { name, description, isDiet } = uptadeUserBodySchema.parse(
        req.body,
      );

      const checkUserParameter = await knex("meal")
        .where("id", id)
        .andWhere("userId", idUser)
        .first();

      if (!checkUserParameter) {
        return res.code(404).send("user id does match task id");
      }

      await knex("meal").where("id", id).andWhere("userId", idUser).update({
        name,
        description,
        isDiet,
      });

      return res.send("Uptade successful");
    } catch (error) {
      return res.code(400).send("Error, please check your body");
    }
  });

  // DELETE

  app.delete("/:id", async (req, res) => {
    const getIdParamsSchema = z.object({
      id: z.string(),
      idUser: z.string(),
    });

    try {
      const { id, idUser } = getIdParamsSchema.parse(req.params);

      const checkUserParameter = await knex("meal")
        .where("id", id)
        .andWhere("userId", idUser)
        .first();

      if (!checkUserParameter) {
        return res.code(404).send("user id does match task id");
      }

      await knex("meal").where("id", id).andWhere("userId", idUser).delete();

      res.send("Delete successful");
    } catch (error) {
      return res.code(404).send("Error, please check your parameter");
    }
  });
}
