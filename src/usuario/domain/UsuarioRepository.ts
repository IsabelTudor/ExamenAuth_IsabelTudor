import Usuario from "./Usuario"

export default interface UsuarioRepository {
    registrar(usuario:Usuario):Promise<Usuario|undefined>
    logIn(usuario:Usuario): Promise<Usuario|undefined>
    getPerflUsuario(alias:string):Promise<any|undefined>
}