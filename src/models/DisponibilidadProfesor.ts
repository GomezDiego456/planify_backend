// models/DisponibilidadProfesor.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBloqueDisponibilidad {
  dia: string;
  horaInicio: string;
  horaFin: string;
}

export interface IDisponibilidadProfesor extends Document {
  profesor: Types.ObjectId;
  bloques: IBloqueDisponibilidad[];
  createdAt: Date;
  updatedAt: Date;
}

const BloqueDisponibilidadSchema = new Schema(
  {
    dia: {
      type: String,
      enum: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
      required: true,
    },
    horaInicio: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: "Formato de hora inválido. Use HH:MM",
      },
    },
    horaFin: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: "Formato de hora inválido. Use HH:MM",
      },
    },
  },
  { _id: false }
);

const DisponibilidadProfesorSchema: Schema = new Schema(
  {
    profesor: {
      type: Schema.Types.ObjectId,
      ref: "Profesor",
      required: true,
      unique: true, // Un profesor solo puede tener un documento de disponibilidad
    },
    bloques: {
      type: [BloqueDisponibilidadSchema],
      required: true,
      validate: {
        validator: function (bloques: IBloqueDisponibilidad[]) {
          return bloques.length > 0;
        },
        message: "Debe haber al menos un bloque de disponibilidad",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Índice para búsquedas rápidas
DisponibilidadProfesorSchema.index({ profesor: 1 });

const DisponibilidadProfesor = mongoose.model<IDisponibilidadProfesor>(
  "DisponibilidadProfesor",
  DisponibilidadProfesorSchema
);

export default DisponibilidadProfesor;
