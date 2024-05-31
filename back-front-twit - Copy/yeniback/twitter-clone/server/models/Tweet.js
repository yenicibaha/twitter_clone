import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
        max: 300
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const TweetSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        max: 300
    },
    likes: {
        type: Array,
        defaultValue: []
    },
    comments: [CommentSchema]
},
{
    timestamps: true
});

export default mongoose.model("Tweet", TweetSchema);