import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { corsConfig } from "./config/cors";
import { connectDB } from "./config/db";
import authRoutes from "./Routes/authRoutes";
import projectRoutes from "./Routes/projectRoutes";
import profesorRoutes from "./Routes/profesorRoutes";

dotenv.config();
connectDB();

const app = express();
app.use(cors(corsConfig)); //CORS Middleware

app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/profesores", profesorRoutes);

export default app;
