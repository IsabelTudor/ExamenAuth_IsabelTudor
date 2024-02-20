import executeQuery from "../../../context/db/postgres.connection"
import Entrenamientos from "../../domain/Entrenamientos";
import EntrenamientosRepository from "../../domain/EntrenamientosRepository";
import Segmentos from "../../domain/Segmento";

export default class EntrenamientosRepositoryPostgres implements EntrenamientosRepository{
    async getSegmentos(id: number): Promise<Segmentos[] | undefined> {
        const sql=`select segmentos.* from segmentos join entrenamientos_segmentos on
        segmentos.id=entrenamientos_segmentos.segmento
        join entrenamientos on entrenamientos_segmentos.entrenamiento=entrenamientos.id
        where entrenamientos.id='${id}'`;
        const segmentos:any[]=await executeQuery(sql)
        return segmentos
    }
    async getTiempo(id: number): Promise<number | undefined> {
        const sql=`select Sum(tiempo) as "tiempo" from entrenamientos_segmentos 
        join entrenamientos on
        entrenamientos_segmentos.entrenamiento=entrenamientos.id where entrenamientos.id=1 group by entrenamientos.id`
        const tiempo=await executeQuery(sql)
        return tiempo
    }
    async getDistancia(id:number): Promise<number|undefined> {
        const sql=`select Sum(distancia) as "distancia" from segmentos 
        join entrenamientos_segmentos on
        segmentos.id=entrenamientos_segmentos.segmento 
        join entrenamientos on
        entrenamientos_segmentos.entrenamiento=entrenamientos.id where entrenamientos.id='${id}' `
           const numero=await executeQuery(sql)
           console.log(numero);
           
        return numero
     
    }
   async segmentosPaginados(pagina: number): Promise<Segmentos[] | undefined> {

       try{
            const sql=`select *
            from segmentos
            limit 25 offset '${pagina}' * 25`;
            const segmentos:any[]=await executeQuery(sql);
            return segmentos
        }catch (error){
            throw new Error("No se pudo traer los 10 libros");
        }
    }
    async entrenamientos(): Promise<Entrenamientos[] | undefined> {
        const sqlEntrenamientos=`select entrenamientos.id,entrenamientos.usuario,entrenamientos.tipo, segmentos.id as "idSeg", segmentos.nombre as "nombreSeg",segmentos.distancia as "distanciaSeg"
        from entrenamientos join entrenamientos_segmentos on entrenamientos.id=entrenamientos_segmentos.entrenamiento
        join segmentos on entrenamientos_segmentos.segmento=segmentos.id 
        `  
        const entrenamientos:Entrenamientos[]=[]
        const entrenamientosDB:any[]=await executeQuery(sqlEntrenamientos)
        
        for(const item of entrenamientosDB){
            const distancia:any=await this.getDistancia(item.id)
            const tiempo:any=await this.getTiempo(item.id);
            const segmentosDb= await this.getSegmentos(item.id)
           
            const entrenamiento:Entrenamientos={
                id:item.id,
                usuario:item.usuario,
                tipo:item.tipo,
                segmentos:segmentosDb
                
            }
            for(const elem of distancia){
                entrenamiento.distancia=elem
            }
            
            for(const element of tiempo ){
                entrenamiento.tiempo=element
            }
           entrenamientos.push(entrenamiento) 
        }
        return entrenamientos
        
    }
    async entrenamientosSeguido(alias: string,seguido:string): Promise<Entrenamientos[] | undefined> {
        const siguiendo=`select * from seguidos where usuario='${alias}' and seguido='${seguido}'`
        const seguidoRespuesta=await executeQuery(siguiendo)
        if(seguidoRespuesta.length>0){
            const entrenamientosId=`select entrenamientos.id,entrenamientos.usuario,entrenamientos.tipo from entrenamientos where usuario='${seguido}'`
            const entrenamientos:Entrenamientos[]=[]
            const entrenamientosDB:any[]=await executeQuery(entrenamientosId)
            
            for(const item of entrenamientosDB){
                const distancia:any=await this.getDistancia(item.id)
                const tiempo:any=await this.getTiempo(item.id);
                const segmentosDb= await this.getSegmentos(item.id)
               
                const entrenamiento:Entrenamientos={
                    id:item.id,
                    usuario:item.usuario,
                    tipo:item.tipo,
                    segmentos:segmentosDb
                    
                }
                for(const elem of distancia){
                    entrenamiento.distancia=elem
                }
                
                for(const element of tiempo ){
                    entrenamiento.tiempo=element
                }
               entrenamientos.push(entrenamiento) 
            }
            return entrenamientos
            
        }
        }

    async guardarEntrenamiento(entrenamiento:Entrenamientos, alias: string, segmento:any[]): Promise<Entrenamientos[] | undefined> {
        const consulta=`INSERT INTO entrenamientos (fechahora,usuario,tipo) values
       (now(),'${alias}','${entrenamiento.tipo}') returning *`;
       const inserccion:any[]=await executeQuery(consulta)
        const inserccionId=inserccion[0].id
        const sql=`insert into entrenamientos_segmentos (entrenamiento,segmento,tiempo)
        values (${inserccionId},${segmento[0].segmento.id},${segmento[0].tiempo})`
        await executeQuery(sql)
        return this.entrenamientos()
      
    }
    
}
