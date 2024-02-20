import express from "express";
import dotenv from "dotenv";
import routerUsuario from "./src/usuario/infrastructure/rest/Usuario.rest";
import routerEntrenamientos from "./src/entrenamientos/infrastructure/rest/Entrenamientos.rest";
dotenv.config();
const app = express();
const port = 8080;

app.use(express.json());
app.use("/api/usuarios",routerUsuario)
app.use("/api",routerEntrenamientos)
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });