import Usuario from "../../domain/Usuario";
import UsuarioRepository from "../../domain/UsuarioRepository";
import executeQuery from "../../../context/db/postgres.connection"


export default class UsuarioRepositoryPostgres implements UsuarioRepository{
    async registrar(usuario: Usuario): Promise<Usuario | undefined> {
        try{
            const sql =`insert into usuarios (alias, password)
             values ('${usuario.alias}', '${usuario.password}') returning *`
             const rows:any[]=await executeQuery(sql);
             const usuarioDB:Usuario={
                alias:rows[0].alias
             }
             return usuarioDB
        }catch (error){
            console.error("No se ha podido registrar el usuario");
        }
    }
    async logIn(usuario: Usuario): Promise<Usuario | undefined> {
        try{
            const {alias}=usuario;
            const sql=`select * from usuarios where alias='${alias}'`
            const rows:any[]=await executeQuery(sql);
            if(rows.length===0){
                throw new Error("Usuario/contraseña no es correcto");
            }else{
                const usuarioDB: Usuario={
                    alias:rows[0].alias,
                    password:rows[0].password
                }
                return usuarioDB
            } 
        }catch(error){
            console.error("No se ha podido logear el usuario");
            return undefined
        }
    }
    async getPerflUsuario(alias: string): Promise<any| undefined> {
        try{
            const sql1=`select count(id)  as entrenamientos from entrenamientos  where usuario in(select alias from usuarios where alias='${alias}')`
            const sqldistancia=`select Sum(distancia) as "distancia" from segmentos join entrenamientos_segmentos on
            segmentos.id=entrenamientos_segmentos.segmento 
            join entrenamientos on
            entrenamientos_segmentos.entrenamiento=entrenamientos.id  where entrenamientos.usuario='${alias}'`;
            const sqlTiempo=`select Sum(tiempo) as "tiempo" from entrenamientos_segmentos
            join entrenamientos on
            entrenamientos_segmentos.entrenamiento=entrenamientos.id  where entrenamientos.usuario='${alias}'`

            const entrenamientos:number=await executeQuery(sql1)
            const distancia:number=await executeQuery(sqldistancia);
            const tiempo:number=await executeQuery(sqlTiempo);
            const usuario={entrenamientos,distancia,tiempo}
            return usuario

        }catch(error){
            console.error("No se ha podido logear el usuario");
            return undefined
        }
        
    }
}