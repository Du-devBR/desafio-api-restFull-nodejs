import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";

export async function metricsRouter(app: FastifyInstance) {
  app.get("/", async (req, res) => {
    await req.jwtVerify();
    const getIdParamsSchema = z.object({
      userId: z.string().uuid(),
    });

    const getMetricsSchrema = z.object({
      totalResgitered: z.number(),
      withinDiet: z.number(),
      offDiet: z.number(),
      maxSequence: z.number(),
      percentMealsWithinDiet: z.number(),
    });

    try {
      const { userId } = getIdParamsSchema.parse(req.params);

      const result = await knex("meal")
        .where("userId", userId)
        .orderBy("createdAt");

      let totalResgitered = 0;
      let withinDiet = 0;
      let offDiet = 0;
      let percentMealsWithinDiet = 0;
      let bestSequence = 0;
      let maxSequence = 0;

      for (let i = 0; i < result.length; i++) {
        totalResgitered++;
        if (result[i].isDiet) {
          withinDiet++;
        } else {
          offDiet++;
        }
      }

      if (totalResgitered > 0) {
        percentMealsWithinDiet = parseFloat(
          ((withinDiet / totalResgitered) * 100).toFixed(2),
        );
      }

      for (let i = 0; i < result.length; i++) {
        if (result[i].isDiet) {
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

      const validateMetrics = getMetricsSchrema.parse(metrics);

      return {
        metrics: validateMetrics,
      };
    } catch (error) {
      return res.code(404).send({
        message: "Erro ao buscar metricas",
      });
    }
  });
}
