import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import Token from "../models/Token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      //prevenir duplicados
      const userExist = await User.findOne({ email });
      if (userExist) {
        const error = new Error("El usuario ya está registrado");
        return res.status(409).json({ error: error.message });
      }

      //crea un usuario
      const user = new User(req.body);

      //hash password
      user.password = await hashPassword(password);

      //generar token de confirmacion
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      //enviar email de confirmacion
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      //guardar el usuario y el token
      await Promise.allSettled([user.save(), token.save()]);

      res.send(
        "Usuario creado correctamente, por favor revisa tu email para confirmar tu cuenta"
      );
    } catch (error) {
      res.status(500).json({ error: "Error al crear el usuario" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error("Token no válido");
        return res.status(404).json({ error: error.message });
      }

      const user = await User.findById(tokenExist.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
      res.send("Cuenta confirmada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Error al confirmar la cuenta" });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        const error = new Error("El usuario no existe");
        return res.status(404).json({ error: error.message });
      }

      if (!user.confirmed) {
        const token = new Token();
        token.user = user.id;
        token.token = generateToken();
        await token.save();

        //enviar email de confirmacion
        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        });

        const error = new Error(
          "Tu cuenta no ha sido confirmada, hemos enviado un email de confirmacion"
        );
        return res.status(401).json({ error: error.message });
      }

      //revisar password
      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error("La contraseña es incorrecta");
        return res.status(401).json({ error: error.message });
      }

      const token = generateJWT({ id: user._id.toString() });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: "Error al iniciar sesión" });
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      //usuario existe
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("El usuario no esta registrado");
        return res.status(404).json({ error: error.message });
      }

      if (user.confirmed) {
        const error = new Error("La cuenta ya ha sido confirmada");
        return res.status(403).json({ error: error.message });
      }

      //generar token de confirmacion
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      //enviar email de confirmacion
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      //guardar el usuario y el token
      await Promise.allSettled([user.save(), token.save()]);

      res.send(
        "Email de confirmación reenviado, por favor revisa tu bandeja de entrada"
      );
    } catch (error) {
      res.status(500).json({ error: "Error al crear el usuario" });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      //usuario existe
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("El usuario no esta registrado");
        return res.status(404).json({ error: error.message });
      }

      //generar token de confirmacion
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;
      await token.save();

      //enviar email de confirmacion
      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      res.send("Revisa tu email para restablecer tu contraseña");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error("Token no válido");
        return res.status(404).json({ error: error.message });
      }

      res.send("Token válido, define tu nueva contraseña");
    } catch (error) {
      res.status(500).json({ error: "Error al confirmar la cuenta" });
    }
  };

  static updatePasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;

      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error("Token no válido");
        return res.status(404).json({ error: error.message });
      }

      const user = await User.findById(tokenExist.user);
      user.password = await hashPassword(req.body.password);

      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);

      res.send("La contraseña se ha actualizado correctamente");
    } catch (error) {
      res.status(500).json({ error: "Error al confirmar la cuenta" });
    }
  };
}
