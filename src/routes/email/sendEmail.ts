import { FastifyInstance } from "fastify";
import transporter from "../../util/emailConfig";
import { env } from "../../env";
import { knex } from "../../database";

interface EmailRequestBody {
  email: string;
}

export async function email(app: FastifyInstance) {
  app.post("email", async (req, res) => {
    const { email } = req.body as EmailRequestBody;

    const checkEmailDatabase = await knex("user").where("email", email).first();

    if (!checkEmailDatabase) {
      res.code(400).send({
        success: false,
        message: "E-mail does not exist in the database!",
      });
      return;
    }

    const token = await res.jwtSign({ email }, { expiresIn: "1h" });

    const mailOptions = {
      from: "dubillstestes@gmail.com",
      to: email,
      subject: "Redefinir senha Daily diet",
      html: `
            <html>
              <body>
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                  <p>Olá,</p>
                  <p>Parece que você está tentando resetar sua senha para o email cadastrado. Se você fez essa solicitação, clique no botão abaixo para redefinir a senha.</p>
                  <a href="${env.API_URL}/resetpassword?token=${token}" style="display: inline-block; font-size: 14px; font-weight: bold; color: #fff; text-align: center; text-decoration: none; background-color: #007bff; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Redefinir Senha</a>
                  <p>Ou copie e cole o seguinte link em seu navegador:</p>
                  <p>${env.API_URL}/redefinepassword?token=${token}</p>
                </div>
              </body>
            </html>
          `,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.send({ success: true, message: "Mail instructions send" });
    } catch (error) {
      res.code(500).send({ success: false, message: "Error submit email" });
    }
  });
}
