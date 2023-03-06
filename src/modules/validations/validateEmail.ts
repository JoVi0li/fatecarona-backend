import { User } from "@prisma/client";
import { EventEmitter } from "events";
import nodemailer from "nodemailer";
import dotenv from "dotenv"

const emitter = new EventEmitter();

emitter.on("verifyEmail", async (user: User) => {
  dotenv.config();

  const host = process.env.SENDGRID_HOST!;
  const port = Number(process.env.SENDGRID_PORT);
  const authUser = process.env.SENDGRID_USER!;
  const authPass = process.env.SENDGRID_PASS!;
  const mailFrom = process.env.MAIL_FROM!;

  const transport = nodemailer.createTransport({
    host: host,
    port: port,
    auth: {
      user: authUser,
      pass: authPass
    }
  });

  const mailConfiguration = {
    from: mailFrom,
    to: user.email,
    subject: "Confirmação do e-mail",
    text: `Fala aí, seja muito bem-vindo(a) ao Fatecarona!

          Confirme seu e-mail para validar seu cadastro no app.
          
          Por favor, clique no link abaixo para realizar a confirmação.
          
          http://127.0.0.1:3030/api/auth/verifyemail/${user.id}
          
          Obrigado!`
  };

  await transport.sendMail(mailConfiguration);
});

export default emitter;