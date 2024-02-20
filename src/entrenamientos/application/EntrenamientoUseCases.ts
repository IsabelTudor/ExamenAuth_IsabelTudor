import Entrenamientos from "../domain/Entrenamientos";
import EntrenamientosRepository from "../domain/EntrenamientosRepository";
import Segmento from "../domain/Segmento";

export default class EntrenamientosUseCases{
    private entrenamientosRepository:EntrenamientosRepository;

    constructor(entrenamientosRepository:EntrenamientosRepository){
        this.entrenamientosRepository=entrenamientosRepository
    }
    async  segmentosPaginados(pagina:number){
        return await this.entrenamientosRepository.segmentosPaginados(pagina)
    }
    async entrenamientos(){
        return await this.entrenamientosRepository.entrenamientos()
    }
    async entrenamientosSeguidos(alias:string, seguido:string){
        return await this.entrenamientosRepository.entrenamientosSeguido(alias, seguido)

    }
    async  guardarEntrenamiento(entrenamiento:Entrenamientos, alias:string,segmento:any[]){
        return await this.entrenamientosRepository.guardarEntrenamiento(entrenamiento,alias,segmento)
    }
    async getDistancia(id:number){
        return await this.entrenamientosRepository.getDistancia(id)
    }
    async getTiempo(id:number){
        return await this.entrenamientosRepository.getTiempo(id)
    }
    async getSegmentos(id:number){
        return await this.entrenamientosRepository.getSegmentos(id)
    }
}