import mongoose, {Schema, Document} from "mongoose";

export interface IProject extends Document {
    projectName: string;
    clientName: string;
    description: string
}

//modelo para mongoose
const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String, 
        required: true,
        trim: true //corta los espacios en blanco
    },
    clientName: {
        type: String, 
        required: true, 
        trim: true 
    },
    description: {
        type: String, 
        required: true,
        trim: true
    }
})

//definir el modelo
const Project = mongoose.model<IProject>('Project', ProjectSchema)

export default Project