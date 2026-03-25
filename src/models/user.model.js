import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            minLength: 1,
            maxLength: 50,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
            maxLength: 50
        },
        email: {
            type: String,
            required: true,
            unique: true,
            minLength: 5,
            maxLength: 255,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

export const User = mongoose.model("User", userSchema);