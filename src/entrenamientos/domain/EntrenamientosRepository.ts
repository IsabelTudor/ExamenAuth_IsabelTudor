import Segmento from "./Segmento";
import Entrenamientos from "./Entrenamientos"
export default interface EntrenamientosRepository{
    segmentosPaginados(pagina:number):Promise<Segmento[]|undefined>
    entrenamientos():Promise<Entrenamientos[]|undefined>
    entrenamientosSeguido(alias:string, seguido:string):Promise<Entrenamientos[]|undefined>
    guardarEntrenamiento(entrenamiento:Entrenamientos, alias:string,segmento:any[]):Promise<Entrenamientos[]|undefined>
    getDistancia(id:number):Promise<number|undefined>
    getTiempo(id:number):Promise<number|undefined>
    getSegmentos(id:number):Promise<Segmento[]|undefined>
}