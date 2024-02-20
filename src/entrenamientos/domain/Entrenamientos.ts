import Usuario from "../../usuario/domain/Usuario"
import Segmentos from "./Segmento"
export default interface Entrenamientos{
    id?:number,
    fechahora?:Date,
    usuario?:Usuario,
    tipo?:string,
    segmentos?:any[],
    distancia?:any,
    tiempo?:any
}