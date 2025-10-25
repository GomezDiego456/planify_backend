import mongoose, { Schema, Document, PopulatedDoc, Types } from "mongoose";
import { IUser } from "./User";

export interface IProject extends Document {
  projectName: string;
  clientName: string;
  description: string;
  manager: PopulatedDoc<IUser & Document>; //referencia al usuario que es el manager del proyecto
}

//modelo para mongoose
const ProjectSchema: Schema = new Schema({
  projectName: {
    type: String,
    required: true,
    trim: true, //corta los espacios en blanco
  },
  clientName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  manager: {
    type: Types.ObjectId,
    ref: "User",
  },
});

//definir el modelo
const Project = mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
