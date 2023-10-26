import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../../database";
import bcrypt from "bcrypt";

export async function redefinePassword(app: FastifyInstance) {
  app.get("redefinepassword", async (req, res) => {
    const tokenSchema = z.object({
      token: z.string(),
    });
    const { token } = tokenSchema.parse(req.query);
    if (!token) {
      res.code(401).send({ error: "Authotization token is missing!" });
      return;
    }

    try {
      app.jwt.verify(token);
      res.send("Successfull Valid token!");
    } catch (error) {
      res.code(401).send({ error: "Expired token!" });
    }
  });

  app.put("redefinepassword", async (req, res) => {
    const updatePasswordSchema = z.object({
      password: z.string(),
    });

    try {
      const { password } = updatePasswordSchema.parse(req.body);

      const decodedToken = await req.jwtVerify();

      const passwordSchema = z
        .object({
          email: z.string(),
        })
        .parse(decodedToken);

      const updatePassword = await bcrypt.hash(password, 10);
      await knex("user")
        .where({ email: passwordSchema.email })
        .update({ hashPassword: updatePassword });

      res.send("Successful password reset!");
    } catch (error) {
      res.code(400).send("Error when resetting password! ");
    }
  });
}
