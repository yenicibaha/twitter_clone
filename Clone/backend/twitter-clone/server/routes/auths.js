import express from 'express';
import { signup } from "../controllers/auth.js";
import { signin } from '../controllers/auth.js';

const router = express.Router();


//Kayit olma
router.post("/signup", signup);

//Giris yapma
router.post("/signin", signin);

export default router;