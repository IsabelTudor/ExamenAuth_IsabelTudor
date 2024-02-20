import EntrenamientosUseCases from "../../application/EntrenamientoUseCases";
import EntrenamientosRepository from "../../domain/EntrenamientosRepository";
import EntrenamientosRepositoryPostgres from "../db/Entrenamientos.postgres";
import express from "express";
import {isAuth } from "../../../context/security/auth";
import Entrenamientos from "../../domain/Entrenamientos";
import Segmentos from "../../domain/Segmento";

const entrenamientosRepository:EntrenamientosRepository=new EntrenamientosRepositoryPostgres();
const entrenamientosUseCases:EntrenamientosUseCases=new EntrenamientosUseCases(entrenamientosRepository);
const router=express.Router();


router.get("/segmentos/:pagina",async(req,res)=>{
    try{
    const paginaBuscada=parseInt(req.params.pagina);
    const segmentos=await entrenamientosUseCases.segmentosPaginados(paginaBuscada);
    res.json(segmentos)
}catch(error){
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
}  
})

router.get("/entrenamientos",isAuth,async(req,res)=>{
    try{
        const entrenamiento=await entrenamientosUseCases.entrenamientos();
        res.json(entrenamiento)
    }catch(error){
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
}  
})
router.get("/entrenamientos/:usuario",isAuth,async(req,res)=>{
    try{
        const alias=req.body.alias;
        const seguido=req.params.usuario;
        const entrenamientoSeguido=await entrenamientosUseCases.entrenamientosSeguidos(alias,seguido);
        res.json(entrenamientoSeguido)
    }catch(error){
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });}})


router.post("/entrenamientos",isAuth,async(req,res)=>{
    try{
        const alias=req.body.alias;//no tocar
        const entrenamiento=req.body.tipo;//no tocar
        const segmentos:any[]=req.body.segmentos;
    
        const entrenamientos=await entrenamientosUseCases.guardarEntrenamiento(entrenamiento,alias,segmentos)
        res.json(entrenamientos)
    }catch(error){
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });}})

export default router