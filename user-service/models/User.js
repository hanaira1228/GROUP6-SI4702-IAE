import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema({
  uuid: { type: String, default: () => uuidv4() },
  userId: { type: Number, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed later
  role: { type: String, enum: ["admin", "user"], default: "user" },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;