import mongoose, { Schema, Document } from "mongoose";

export interface IProfesor extends Document {
  nombreCompleto: string;
  correo: string;
  departamento?: string;
  disponible?: boolean;
}

const ProfesorSchema: Schema = new Schema({
  nombreCompleto: {
    type: String,
    required: true,
    trim: true,
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  departamento: {
    type: String,
    trim: true,
  },
  disponible: {
    type: Boolean,
    default: false,
  },
});

//definir el modelo
const Profesor = mongoose.model<IProfesor>("Profesor", ProfesorSchema);

export default Profesor;
