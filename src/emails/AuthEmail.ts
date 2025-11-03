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
      to: user.email,
      subject: "Confirma tu cuenta en Planify",
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 40px; text-align: center;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <div style="background-color: #1e293b; color: white; padding: 20px;">
            <h1 style="margin: 0; font-size: 24px;">Planify</h1>
          </div>
          
          <div style="padding: 30px; text-align: left; color: #1e293b;">
            <p>Hola <strong>${user.name}</strong>,</p>
            <p>Has creado tu cuenta en <strong>Planify</strong>. Ya casi está todo listo. Solo debes confirmar tu cuenta para empezar a disfrutar del sistema automático de horarios académicos.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/auth/confirm-account"
                 style="background-color: #3b82f6; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
                 Confirmar cuenta
              </a>
            </div>
            
            <p>Ingresa el siguiente código:</p>
            <div style="background-color: #f1f5f9; border-radius: 8px; padding: 10px; text-align: center; font-size: 18px; font-weight: bold; letter-spacing: 2px; color: #1e40af;">
              ${user.token}
            </div>
            
            <p style="margin-top: 20px; font-size: 14px; color: #64748b;">
              Este código es válido por solo <strong>10 minutos</strong>.
            </p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 15px; font-size: 12px; color: #94a3b8;">
            © ${new Date().getFullYear()} Planify — Todos los derechos reservados.
          </div>
        </div>
      </div>
      `,
    });
    console.log("Mensaje enviado", info.messageId);
  };

  static sendPasswordResetToken = async (user: IEmail) => {
    const info = await transporter.sendMail({
      from: "Planify <admin@planify.com>",
      to: user.email,
      subject: "Restablece tu contraseña en Planify",
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 40px; text-align: center;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <div style="background-color: #1e293b; color: white; padding: 20px;">
            <h1 style="margin: 0; font-size: 24px;">Planify</h1>
          </div>
          
          <div style="padding: 30px; text-align: left; color: #1e293b;">
            <p>Hola <strong>${user.name}</strong>,</p>
            <p>Has solicitado restablecer tu contraseña en <strong>Planify</strong>. Haz clic en el botón a continuación para crear una nueva contraseña.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/auth/new-password"
                 style="background-color: #3b82f6; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
                 Restablecer contraseña
              </a>
            </div>
            
            <p>utiliza el siguiente código:</p>
            <div style="background-color: #f1f5f9; border-radius: 8px; padding: 10px; text-align: center; font-size: 18px; font-weight: bold; letter-spacing: 2px; color: #1e40af;">
              ${user.token}
            </div>
            
            <p style="margin-top: 20px; font-size: 14px; color: #64748b;">
              Este código es válido por solo <strong>10 minutos</strong>.
            </p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 15px; font-size: 12px; color: #94a3b8;">
            © ${new Date().getFullYear()} Planify — Todos los derechos reservados.
          </div>
        </div>
      </div>
      `,
    });
    console.log("Mensaje enviado", info.messageId);
  };
}
