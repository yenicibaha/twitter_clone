import Tweet from "../models/Tweet.js";
import { handleError } from "../error.js";



export const createTweet = async (req, res, next) => {
    const userId = req.body.userId; // Veya isteğin yapıldığı yerden kullanıcı kimliğini al
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: You must be logged in to create a tweet." });
    }
    
    const newTweet = new Tweet(req.body);
    try {
        const savedTweet = await newTweet.save();
        res.status(200).json(savedTweet);
        console.log("ENDPOINT TEST: Post a new tweet is DONE!\n\n");
    } catch(err) {
        console.error(err);
        handleError(500, err);
    }
};



export const deleteTweet = async (req, res, next) => {
    try {
        console.log("ENDPOINT TEST: Delete the tweet is DONE!\n\n");
        const tweet = await Tweet.findById(req.params.id);
        if (tweet.userId === req.body.id) {
            await tweet.deleteOne();
            res.status(200).json("Tweet has been deleted!");
        }
        else {
            console.error(err);
            handleError(500, err);
        }
    } catch(err) {
        console.error(err);
        handleError(500, err);
    }
};

export const likeTweet = async (req, res, next) => {
    try {
        console.log("ENDPOINT TEST: Like/Dislike the tweet is DONE!\n\n");
        const tweet = await Tweet.findById(req.params.id);
        if (!tweet.likes.includes(req.body.id)) {
            await tweet.updateOne({ $push: { likes: req.body.id } });
            res.status(200).json("Tweet has been liked!");
        }
        else {
            await tweet.updateOne( { $pull: { likes: req.body.id } });
            res.status(200).json("Tweet has been disliked!");
        }
    } catch(err) {
        console.error(err);
        handleError(500, err);
    }
};


export const feed = async (req, res, next) => {
    try {
        console.log("ENDPOINT TEST: Viewing the all tweets is DONE!\n\n");
        const twitterFeed = await Tweet.find({ likes: { $exists: true } });
        res.status(200).json(twitterFeed);
    } catch(err) {
        console.error(err);
        handleError(500, err);
    }
};


export const postComment = async (req, res, next) => {
    const tweetId = req.params.id;
    const { userId, text } = req.body;

    try {
        console.log("ENDPOINT TEST: Post a new comment to tweet is DONE!\n\n");
        const tweet = await Tweet.findById(tweetId);
        if (!tweet) {
            return res.status(404).json({ message: "Tweet not found" });
        }

        // Add the new comment to the tweet's comments array
        tweet.comments.push({ userId, text });
        await tweet.save();

        res.status(201).json(tweet);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};