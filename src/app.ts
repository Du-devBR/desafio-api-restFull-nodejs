import fastify from "fastify";
import cookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";

import { userRoutes } from "./routes/user";
import { mealRoutes } from "./routes/meal";
import { metricsRouter } from "./routes/metrics";

export const app = fastify();

app.register(fastifyCors);

// app.register(fastifyCors, {
//   origin: "*", // Ou a origem permitida que você deseja configurar
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   // Outras opções conforme suas necessidades...
// });

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
