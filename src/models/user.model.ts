import mongoose, { Schema, Document } from "mongoose";
import "@/src/models/index";

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

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    year: { type: String, required: true },
    hall: { type: String, required: true },
    department: { type: String, required: true },
    password: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: String },
    reviews: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Review",
      default: [],
    }, // Updated to use mongoose ObjectId type
  },
  { timestamps: true } // Enable timestamps
);

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
