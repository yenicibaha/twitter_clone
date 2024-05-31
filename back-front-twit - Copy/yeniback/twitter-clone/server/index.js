import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from "./routes/auths.js";
import tweetRoutes from "./routes/tweets.js";

const app = express();
dotenv.config();

const connect = () => {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log('The app working without problems and connected to MongoDB!');
    })
    .catch((err) => {
        throw err;
    });
}
app.get("/", (req, res) => {
    res.send("Hello!");
});

app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/tweets", tweetRoutes);

app.listen(9000, () => {
    connect();
    console.log('Listening to port 9000');
});