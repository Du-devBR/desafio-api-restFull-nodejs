import { FastifyInstance } from "fastify";
import transporter from "../../util/emailConfig";

interface EmailRequestBody {
  email: string;
}

export async function email(app: FastifyInstance) {
  app.post("email", async (req, res) => {
    const { email } = req.body as EmailRequestBody;

    if (!email || typeof email !== "string") {
      res.send({ success: false, message: "Endereço de e-mail inválido" });
      return;
    }

    const mailOptions = {
      from: "dubillstestes@gmail.com",
      to: email,
      subject: "Teste google",
      text: "teste google ok",
    };

    try {
      await transporter.sendMail(mailOptions);
      res.send({ success: true, message: "Mail instructions send" });
    } catch (error) {
      res.code(500).send({ success: false, message: "Error submit email" });
    }
  });
}
