import { User } from "@prisma/client";
import { EventEmitter } from "events";
import nodemailer from "nodemailer";

const emitter = new EventEmitter();

emitter.on("verifyEmail", async (user: User, token: string) => {
  const transport = nodemailer.createTransport({
    host: String(process.env.SENDGRID_HOST),
    port: Number(process.env.SENDGRID_PORT),
    auth: {
      user: String(process.env.SENDGRID_USER),
      pass: String(process.env.SENDGRID_PASS)
    }
  });

  const mailConfiguration = {
    from: "jovioli.dev04@gmail.com",
    to: user.email,
    subject: "Confirmação do e-mail",
    text: `Fala aí, seja muito bem-vindo(a) ao Fatecarona!

          Este e-mail serve para confirmar seu e-mail e validar
          seu cadastro no app.
          
          Por favor, clique no link abaixo para realizar a confirmação.
          
          http://localhost:3000/verify/${token}
          
          Obrigado!`
  };

  await transport.sendMail(mailConfiguration);
});

export default emitter;