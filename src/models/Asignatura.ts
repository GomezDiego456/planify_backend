import mongoose, { Schema, Document, Types } from "mongoose";
import { IProfesor } from "./Profesor";

export interface IAsignatura extends Document {
  nombre: string;
  codigo: string;
  departamento?: string;
  profesor?: Types.ObjectId | IProfesor; // Referencia al profesor asignado
  creditos?: number;
  duracionHoras?: number; // duración por sesión
}

const AsignaturaSchema: Schema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  codigo: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  departamento: {
    type: String,
    trim: true,
  },
  profesor: {
    type: Types.ObjectId,
    ref: "Profesor", // referencia al modelo de profesor
  },
  creditos: {
    type: Number,
    min: 0,
  },
  duracionHoras: {
    type: Number,
    min: 1,
  },
});

const Asignatura = mongoose.model<IAsignatura>("Asignatura", AsignaturaSchema);

export default Asignatura;
