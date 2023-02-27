import { User } from "@prisma/client";
import { EventEmitter } from "events";
import nodemailer from "nodemailer";
import fastify from "fastify";

const emitter = new EventEmitter();

emitter.on("verifyEmail", (user: User) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "jovioli.dev04@gmail.com",
      pass: "jovioli318940"
    }
  });

  const token = fastify().jwt.sign({
    email: user.email,
    name: user.name,
    userId: user.id,
  }, {
    expiresIn: "10min",
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

  transporter.sendMail(mailConfiguration, (err, msg) => {
    if(err){
      console.log({err})
      return emitter.emit("errorOnEmailValidation", err);
    }
  })
});