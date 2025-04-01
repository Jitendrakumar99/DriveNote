import express, { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

const router = express.Router();

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
    picture?: string;
  };
  token: string;
}

const verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
  
      const decodedToken = await admin.auth().verifyIdToken(token);
      // Map Firebase user data to our User model structure
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.displayName,
        picture: decodedToken.picture || decodedToken.photoURL
      };
      req.token = token;
      next();
    } catch (error) {
      res.status(403).json({ message: "Invalid token" });
      return;
    }
};

export default verifyToken;