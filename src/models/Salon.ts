import mongoose, { Schema, Document } from "mongoose";

export interface ISalon extends Document {
  nombre: string; // Nombre del salón
  tipo: string; // Tipo de salón (Aula, Laboratorio, Auditorio, etc.)
  capacidad: number; // Capacidad máxima de estudiantes
  ubicacion: string; // Lugar físico donde se encuentra
  recursos: string[]; // Recursos disponibles (proyector, tablero, etc.)
}

const SalonSchema: Schema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  tipo: {
    type: String,
    required: true,
    enum: ["Aula", "Laboratorio", "Auditorio", "Sala de Cómputo", "Otro"],
    default: "Aula",
  },
  capacidad: {
    type: Number,
    required: true,
  },
  ubicacion: {
    type: String,
    required: true,
    trim: true,
  },
  recursos: {
    type: [String],
    default: [],
  },
});

const Salon = mongoose.model<ISalon>("Salon", SalonSchema);

export default Salon;
