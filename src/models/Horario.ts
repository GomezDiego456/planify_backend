import mongoose, { Schema, Document } from "mongoose";

export interface IHorario extends Document {
  dia: string;
  horaInicio: string;
  horaFin: string;
  asignatura: mongoose.Types.ObjectId;
  profesor: mongoose.Types.ObjectId;
  salon: mongoose.Types.ObjectId;
}

const HorarioSchema: Schema = new Schema({
  dia: {
    type: String,
    enum: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    required: true,
  },
  horaInicio: { type: String, required: true },
  horaFin: { type: String, required: true },

  asignatura: {
    type: Schema.Types.ObjectId,
    ref: "Asignatura",
    required: true,
  },
  profesor: {
    type: Schema.Types.ObjectId,
    ref: "Profesor",
    required: true,
  },
  salon: {
    type: Schema.Types.ObjectId,
    ref: "Salon",
    required: true,
  },
});

const Horario = mongoose.model<IHorario>("Horario", HorarioSchema);

export default Horario;
