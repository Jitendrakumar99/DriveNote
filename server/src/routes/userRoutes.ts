import express from "express";
import verifyToken from "../middleware";
import { saveUser } from "../controllers/userCtrl";

const router = express.Router();

router.post("/save", verifyToken, saveUser);

export { router as userRouter }