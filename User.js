import mongoose , { Schema } from "mongoose";

const UserSchema = new Schema({
    username: String,
    room: String,
    message: String,
});

export const User = mongoose.model("User", UserSchema);
