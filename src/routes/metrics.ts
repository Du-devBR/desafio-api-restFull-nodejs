import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";

export async function metricsRouter(app: FastifyInstance) {
  app.get("/", async (req, res) => {
    const getIdParamsSchema = z.object({
      userId: z.string().uuid(),
    });

    const getMetricsSchrema = z.object({
      totalResgitered: z.number(),
      withinDiet: z.number(),
      offDiet: z.number(),
      percentMealsWithinDiet: z.number(),
    });

    try {
      const { userId } = getIdParamsSchema.parse(req.params);
      const result = await knex("meal")
        .where("userId", userId)
        .select(
          knex.raw("COUNT(*) as totalResgitered"),
          knex.raw("(COUNT(*) FILTER (WHERE isDiet = true)) as withinDiet"),
          knex.raw("(COUNT(*) FILTER (WHERE isDiet = false)) as offDiet"),
          knex.raw(
            "COALESCE(ROUND((COUNT(*) FILTER (WHERE isDiet = true) * 100.0 / NULLIF(COUNT(*), 0)),2),0) as percentMealsWithinDiet",
          ),
        )
        .orderBy("created_at")
        .first();

      const { totalResgitered, offDiet, withinDiet, percentMealsWithinDiet } =
        getMetricsSchrema.parse(result);

      const meals = await knex("meal")
        .where("userId", userId)
        .orderBy("created_at");

      let bestSequence = 0;
      let maxSequence = 0;

      for (let i = 0; i < meals.length; i++) {
        if (meals[i].isDiet) {
          bestSequence++;
          if (bestSequence > maxSequence) {
            maxSequence = bestSequence;
          }
        } else {
          bestSequence = 0;
        }
      }

      const metrics = {
        totalResgitered,
        withinDiet,
        offDiet,
        percentMealsWithinDiet,
        maxSequence,
      };

      return {
        metrics,
      };
    } catch (error) {
      return res.code(404).send({
        message: "Erro ao buscar metricas",
      });
    }
  });
}
