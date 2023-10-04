import fastify from "fastify";

import { userRoutes } from "./routes/user";
import { mealRoutes } from "./routes/meal";

export const app = fastify();

app.register(userRoutes, {
  prefix: "user",
});

app.register(mealRoutes, {
  prefix: "/user/:userId/meal",
});
