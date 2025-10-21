import mongoose, { Document, Schema, Types } from "mongoose";

export interface IToken extends Document {
  token: string;
  user: Types.ObjectId; //guardar la referencia al usuario
  createdAt: Date; //fecha de creacion
}

//modelo para mongoose
const TokenSchema: Schema = new Schema({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 3600, //el token expira en una hora
  },
});

const Token = mongoose.model<IToken>("Token", TokenSchema);

export default Token;
