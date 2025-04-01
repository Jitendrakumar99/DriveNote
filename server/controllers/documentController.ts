import { Request, Response } from "express";
import Document from "../models/Document";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

const oauth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

export const createDocument = async (req: Request, res: Response) => {
  try {
    const { title, content, isDraft } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const document = new Document({
      title,
      content,
      userId,
      isDraft: isDraft || false,
    });

    await document.save();

    res.status(201).json(document);
  } catch (error) {
    console.error("Error creating document:", error);
    res.status(500).json({ error: "Failed to create document" });
  }
};

export const uploadToDrive = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: "Access token is required" });
    }

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    oauth2Client.setCredentials({ access_token: accessToken });
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const fileMetadata = {
      name: document.title,
      mimeType: "application/vnd.google-apps.document",
    };

    const media = {
      mimeType: "text/html",
      body: document.content,
    };

    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });

    document.googleDriveId = file.data.id;
    await document.save();

    res.json({ message: "Document uploaded to Google Drive successfully" });
  } catch (error) {
    console.error("Error uploading to Google Drive:", error);
    res.status(500).json({ error: "Failed to upload document to Google Drive" });
  }
};

export const getDocuments = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const documents = await Document.find({ userId }).sort({ updatedAt: -1 });
    res.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};

export const updateDocument = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const { title, content, isDraft } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const document = await Document.findOne({ _id: documentId, userId });
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    document.title = title;
    document.content = content;
    if (typeof isDraft === "boolean") {
      document.isDraft = isDraft;
    }

    await document.save();

    res.json(document);
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ error: "Failed to update document" });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const document = await Document.findOneAndDelete({ _id: documentId, userId });
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ error: "Failed to delete document" });
  }
}; 