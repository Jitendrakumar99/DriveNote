import express from "express";
import dotenv from "dotenv";
import { createDocument, uploadDocument, getDocuments, getDocument, updateDocument, deleteDocument } from "../controllers/documentCtrl";
import verifyToken from "../middleware";

dotenv.config();

const router = express.Router();

router.post("/create", verifyToken, createDocument);

router.post("/upload/:id", verifyToken, uploadDocument);

router.get("/", verifyToken, getDocuments);

router.get("/:id", verifyToken, getDocument);

router.put("/:id", verifyToken, updateDocument);

router.delete("/:id", verifyToken, deleteDocument);

export { router as documentRouter }
