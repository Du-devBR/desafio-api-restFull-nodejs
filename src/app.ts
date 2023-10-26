import fastify from "fastify";
import cookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";

import { userRoutes } from "./routes/user";
import { mealRoutes } from "./routes/meal";
import { metricsRouter } from "./routes/metrics";
import fastifyJwt from "@fastify/jwt";

import { env } from "./env";
import { email } from "./routes/email/sendEmail";
import { redefinePassword } from "./routes/email/redefinePassword";

export const app = fastify();

app.register(fastifyCors);

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(cookie);

app.register(userRoutes, {
  prefix: "api/",
});

app.register(mealRoutes, {
  prefix: "api/user/:idUser/meal",
});

app.register(metricsRouter, {
  prefix: "api/user/:userId/metrics",
});

app.register(email, {
  prefix: "api/",
});

app.register(redefinePassword, {
  prefix: "api/",
});
