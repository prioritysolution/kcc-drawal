import { Schema, model, models } from "mongoose";

interface IAdmin {
  society: string;
  username: string;
  password: string;
}

const AdminSchema = new Schema<IAdmin>({
  society: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export default models.Admin || model<IAdmin>("Admin", AdminSchema);
