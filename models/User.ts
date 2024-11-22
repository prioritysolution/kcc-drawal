import { Schema, model, models } from "mongoose";

interface IUser {
  name: string;
  secret: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  secret: { type: String, required: true },
});

export default models.User || model<IUser>("User", UserSchema);
