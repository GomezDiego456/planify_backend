import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { corsConfig } from "./config/cors";
import { connectDB } from "./config/db";
import authRoutes from "./Routes/authRoutes";
import projectRoutes from "./Routes/projectRoutes";
import profesorRoutes from "./Routes/profesorRoutes";
import morgan from "morgan";
import asignaturaRoutes from "./Routes/asignaturaRoutes";
import salonRoutes from "./Routes/salonRoutes";

dotenv.config();
connectDB();

const app = express();
app.use(cors(corsConfig)); //CORS Middleware

//morgan logger
// app.use(morgan("dev"));

//leer datos del formulario
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/profesores", profesorRoutes);
app.use("/api/asignaturas", asignaturaRoutes);
app.use("/api/salones", salonRoutes);

export default app;
