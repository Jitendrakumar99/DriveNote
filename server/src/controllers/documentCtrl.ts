import { Request, Response } from "express";
import { google } from "googleapis";
import Document from "../models/Document";
import admin from "firebase-admin";
import { convertHtmlToDocsRequests, getOrCreateDocumentsFolder } from "../utils/document";

interface AuthenticatedRequest extends Request {
  user?: admin.auth.DecodedIdToken;
  token: string;
}

const createDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { title, content, isDraft } = req.body;

  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    // Convert isDraft to boolean
    const isDraftBoolean = isDraft === true || isDraft === "true";
    const newDoc = new Document({ 
      userId: req.user.uid, 
      title, 
      content,
      isDraft: isDraftBoolean 
    });
    await newDoc.save();
    res.status(201).json(newDoc);
  } catch (error) {
    console.error("Error creating document:", error);
    res.status(500).json({ message: "Error creating document" });
  }
}

const uploadDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      res.status(404).json({ message: "Document not found" });
      return;
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: req.body.accessToken });

    const userDrive = google.drive({ version: "v3", auth: oauth2Client });
    const docs = google.docs({ version: "v1", auth: oauth2Client });
    
    let driveId = document.googleDriveId;

    if (!driveId) {
      // If no Drive ID exists, create a new file
      const folderId = await getOrCreateDocumentsFolder(req.body.accessToken);
      const metadata = {
        name: document.title || "MyDocument",
        mimeType: "application/vnd.google-apps.document",
        parents: [folderId]
      };
      
      const driveResponse = await userDrive.files.create({
        requestBody: metadata,
        fields: "id",
      });

      driveId = driveResponse.data.id;
      document.googleDriveId = driveId;
    } else {
      // Update existing file metadata
      await userDrive.files.update({
        fileId: driveId,
        requestBody: {
          name: document.title || "MyDocument"
        }
      });

      // Get the current document content
      const doc = await docs.documents.get({
        documentId: driveId
      });

      // Get the last content element's end index
      const content = doc.data.body?.content || [];
      const lastContent = content[content.length - 1];
      const endIndex = lastContent?.endIndex || 1;

      // Clear existing content, excluding the newline character
      const clearRequests = [{
        deleteContentRange: {
          range: {
            segmentId: "",
            startIndex: 1,
            endIndex: Math.max(1, endIndex - 1) // Subtract 1 to exclude the newline character
          }
        }
      }];

      await docs.documents.batchUpdate({
        documentId: driveId,
        requestBody: {
          requests: clearRequests
        }
      });
    }

    // Insert the new content
    const requests = convertHtmlToDocsRequests(document.content);
    await docs.documents.batchUpdate({
      documentId: driveId,
      requestBody: {
        requests,
      },
    });

    await document.save();

    res.status(200).json({ 
      message: "Document uploaded", 
      driveId: driveId,
    });
  } catch (error) {
    console.log("Error uploading document:", error?.response?.data || error.message);
    res.status(500).json({ message: "Error uploading document", error: error?.message });
  }
}

const getDocuments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    console.log("No user found in request");
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    console.log("Fetching documents for user:", req.user.uid);
    const documents = await Document.find({ userId: req.user.uid }).sort({ createdAt: -1 });
    console.log("Found documents:", documents.length);
    
    if(documents.length > 0){
      res.status(200).json({ documents });
    } else {
      res.status(200).json({ documents: [] }); // Return empty array instead of 404
    }
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ message: "Something went wrong!", error: error.message });
  }
}

const getDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    console.log("No user found in request");
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    console.log("Fetching document with ID:", req.params.id);
    console.log("For user:", req.user.uid);
    
    // Log the query we're using
    const query = { 
      _id: req.params.id,
      userId: req.user.uid 
    };
    console.log("MongoDB query:", JSON.stringify(query));
    
    const document = await Document.findOne(query);

    if (!document) {
      console.log("Document not found for query:", query);
      res.status(404).json({ message: "Document not found" });
      return;
    }

    console.log("Document found:", {
      id: document._id,
      title: document.title,
      hasContent: !!document.content,
      isDraft: document.isDraft,
      userId: document.userId
    });

    // Ensure we're sending all required fields
    const documentData = {
      _id: document._id,
      userId: document.userId,
      title: document.title,
      content: document.content,
      isDraft: document.isDraft,
      createdAt: document.createdAt,
      googleDriveId: document.googleDriveId
    };

    res.status(200).json(documentData);
  } catch (error: any) {
    console.error("Error fetching document:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      message: "Error fetching document", 
      error: error.message,
      details: error.stack
    });
  }
}

const updateDocument = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const { title, content, isDraft } = req.body;
    const document = await Document.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      { title, content, isDraft },
      { new: true }
    );

    if (!document) {
      res.status(404).json({ message: "Document not found" });
      return;
    }

    res.status(200).json(document);
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ message: "Error updating document" });
  }
}

export const deleteDocument = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user?.uid;
        const accessToken = req.body.accessToken;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const document = await Document.findOne({ _id: id, userId });

        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        // If the document has a Google Drive ID, delete it from Drive
        if (document.googleDriveId && accessToken) {
            try {
                const oauth2Client = new google.auth.OAuth2();
                oauth2Client.setCredentials({ access_token: accessToken });
                const drive = google.drive({ version: "v3", auth: oauth2Client });
                
                await drive.files.delete({
                    fileId: document.googleDriveId
                });
            } catch (driveError) {
                console.error("Error deleting from Google Drive:", driveError);
                // Continue with local deletion even if Drive deletion fails
            }
        }

        await Document.deleteOne({ _id: id, userId });
        res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ message: "Error deleting document" });
    }
};

export { createDocument, uploadDocument, getDocuments, getDocument, updateDocument }