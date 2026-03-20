import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        profilePicture: {
            type: String
        },
        Description: {
            type: String
        },
        followers: {
            type: Array,
            defaultValue: []
        },
        following: {
            type: Array,
            defaultValue: []
        }
    },
    { timestamps: true } //MongoDB'de hesap olusturma zamanini gostermesini saglar.
);

export default mongoose.model("User", userSchema);