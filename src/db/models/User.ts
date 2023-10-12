import { Schema, model } from "mongoose";

import type IUser from "../../models/IUser.model";

const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true }
});

const User = model<IUser>("User", userSchema);

export default User;
