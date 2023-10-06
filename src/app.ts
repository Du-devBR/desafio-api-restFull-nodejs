import fastify from "fastify";
import cookie from "@fastify/cookie";

import { userRoutes } from "./routes/user";
import { mealRoutes } from "./routes/meal";
import { metricsRouter } from "./routes/metrics";

export const app = fastify();

app.register(cookie);

app.register(userRoutes, {
  prefix: "user",
});

app.register(mealRoutes, {
  prefix: "/user/:idUser/meal",
});

app.register(metricsRouter, {
  prefix: "/user/:userId/metrics",
});
