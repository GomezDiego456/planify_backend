import { transporter } from "../config/nodemailer";

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: "Planify <admin@planify.com>",
      to: user.email, //el email del usuario
      subject: "Confirma tu cuenta",
      text: "Planify - Confirma tu cuenta",
      html: `<p>Hola: ${user.name}, has creado tu cuenta en Planify, ya casi esta todo listo, solo debes confirmar tu cuenta</p>
                <p>visita el siguiente enlace:</p>
                <a href="">confirmar cuenta</a>
                <p>E ingresa el codigo: <b>${user.token}</b></p>
                <p>este token es valido por solo 1 hora</p>
        `,
    });
    console.log("Mensaje enviado", info.messageId);
  };
}
