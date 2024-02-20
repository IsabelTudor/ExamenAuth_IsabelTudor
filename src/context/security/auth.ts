import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import Usuario from "../../usuario/domain/Usuario";
const SECRET_KEY: Secret = "miclave";

const decode = (token: string) => {
  return jwt.decode(token);
};

const createToken = (user: Usuario): string => {
  const payload = {
    alias:user.alias
  };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1 days" });
};

const isAuth = (req: Request, response: Response, next: NextFunction) => {
  try {
      const authHeader = req.headers["authorization"];
      const token: string | undefined = authHeader && authHeader.split(" ")[1];
      
      if (token) {
          const decoded: any = jwt.verify(token, SECRET_KEY);
          if (!decoded) {
            throw new Error("Invalid token");
        }
          console.log("Decoded user:", decoded.alias);
          req.body.alias = decoded.alias;
          next();
      } else {
          response.status(401).json({ mensaje: "No autorizado" });
      }
  } catch (err) {
      console.error("Error during authentication:", err);
      response.status(401).json({ mensaje: "No autorizado" });
  }
};

export { decode, createToken, isAuth };