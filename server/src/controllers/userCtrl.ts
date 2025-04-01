import { Request, Response } from "express";
import User from "../models/User";

interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
    picture?: string;
  };
}

const saveUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    
    const { uid, email, name, picture } = req.user;
  
    try {
      let user = await User.findOne({ uid });
      if (!user) {
        user = new User({ uid, email, name, picture });
        await user.save();
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error saving user" });
    }
}

export { saveUser }