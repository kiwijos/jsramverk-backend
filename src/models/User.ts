import { Schema, model } from "mongoose";

interface IUser {
    username: string;
    email: string;
    passwordHash: string;
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true }
});

const User = model<IUser>("User", userSchema);
export default User;
