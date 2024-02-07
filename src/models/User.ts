import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, "Email already exists!"],
    required: [true, "An email address is required!"],
  },
  password: {
    type: String,
    required: [true, "A password is required!"],
  },
});

const User = models.User || model("User", UserSchema);
export default User;
