import fastify from "fastify";
import cookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";

import { userRoutes } from "./routes/user";
import { mealRoutes } from "./routes/meal";
import { metricsRouter } from "./routes/metrics";
import fastifyJwt from "@fastify/jwt";

import { env } from "./env";
import { email } from "./routes/email/sendEmail";

export const app = fastify();

app.register(fastifyCors);

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

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

app.register(email, {
  prefix: "user/",
});
