import express from "express";
import { verifyToken } from "../verifyToken.js";
import { createTweet, deleteTweet, likeTweet, feed, postComment } from "../controllers/tweet.js";


const router = express.Router();


// Tweet olusturma
router.post('/', createTweet);


// Tweet silme (gerekli degil)
router.delete("/:id", deleteTweet);


// Tweet begenme 
router.put("/:id/like", likeTweet);


// Tum tweet'ler gosterme
router.get("/feed", feed);


// Tweet'e yorum atma
router.post("/comment/:id", postComment);


export default router;