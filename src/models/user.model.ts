import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  year: string;
  hall: string;
  department: string;
  password: string;
  reviews: mongoose.Types.ObjectId[]; // Reference to Review model
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  year: { type: String, required: true },
  hall: { type: String, required: true },
  department: { type: String, required: true },
  password: { type: String, required: true },
  reviews: { type: [String], default: [] }, // New field added
});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
