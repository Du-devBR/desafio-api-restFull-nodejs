import { app } from "./app";
import { env } from "./env";

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log("Http server runing");
  });
export { app };
