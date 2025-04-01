import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import admin from "firebase-admin";
import morgan from "morgan";
import connectDB from "./config/db";
import serviceAccount from "./config/firebase-account";
import {userRouter} from "./routes/userRoutes";
import { documentRouter } from "./routes/documentRoutes";

dotenv.config();
const app = express();
const allowedOrigin = process.env.FRONTEND_URL || "*";
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const PORT = process.env.PORT;

connectDB();

app.get("/", (req: Request, res: Response) => {
    res.send({ "message": "Welcome to DriveNote!" })
})

app.use("/api/user", userRouter);
app.use("/api/docs", documentRouter);

app.listen(PORT, () => {
    console.log(`Server is listing on port ${PORT}`);
})