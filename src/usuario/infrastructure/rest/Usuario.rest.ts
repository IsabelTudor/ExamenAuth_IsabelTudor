import UsuarioUseCases from "../../application/UsuarioUseCases";
import UsuarioRepository from "../../domain/UsuarioRepository";
import express, { Request, Response } from "express";
import UsuarioRepositoryPostgres from "../../infrastructure/db/Usuario.postgres";
import Usuario from "../../domain/Usuario";
import { createToken, isAuth } from "../../../context/security/auth";

const usuariosRepository: UsuarioRepository = new UsuarioRepositoryPostgres();

const usuarioUseCases: UsuarioUseCases= new UsuarioUseCases(usuariosRepository)

const router = express.Router();

router.post("/registro", async (req: Request, res: Response) => {
    const {alias, password} = req.body;
    const usuarioAPI: Usuario = {alias, password};
    const usuario: any = await usuarioUseCases.registrar(usuarioAPI);
    res.json(usuario);
  });
 
  router.post("/login", async (req: Request, res: Response) => {
    const { alias, password } = req.body;
    const usuarioAPI: Usuario = { alias, password };

    try {
        const usuario: any = await usuarioUseCases.logIn(usuarioAPI);
        const usuarioDB={ alias: usuario.alias}
        const token = createToken(usuario);
        res.json({ token, usuarioDB});
    } catch (error) {
      res.status(401).json({ mensaje: "Usuario o contraseña incorrectos" });

    }
});
router.get("/perfil", isAuth,async(req,res)=>{
    try{
      const alias=req.body.alias;
      const perfil=await usuarioUseCases.getPerflUsuario(alias);
      res.json({alias,perfil})
    }catch (error) {
      res.status(401).json({ mensaje: "Usuario o contraseña incorrectos" });
    }
})

export default router