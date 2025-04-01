import axios from "axios";
import { JSDOM } from "jsdom";

const findFolder = async (folderName: string, accessToken: string) => {
  const response = await axios.get(
    "https://www.googleapis.com/drive/v3/files",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: "files(id, name)",
      },
    }
  );

  return response.data.files.length > 0 ? response.data.files[0].id : null;
};

const createFolder = async (folderName: string, accessToken: string) => {
  const response = await axios.post(
    "https://www.googleapis.com/drive/v3/files",
    {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.id; // Return the newly created folder ID
};

const getOrCreateDocumentsFolder = async (accessToken: string) => {
  let folderId = await findFolder("DriveNote", accessToken);
  if (!folderId) {
    folderId = await createFolder("DriveNote", accessToken);
  }
  return folderId;
};

function convertHtmlToDocsRequests(html: string) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const requests: any[] = [];
  let index = 1;

  function processNode(node: ChildNode, styles: any = {}) {
    if (node.nodeType === 3) {
      // Plain text
      const text = node.textContent || "";
      if (text.trim() !== "") {
        requests.push({
          insertText: { location: { index }, text },
        });

        // Apply styles after inserting the text
        if (Object.keys(styles).length > 0) {
          requests.push({
            updateTextStyle: {
              range: { startIndex: index, endIndex: index + text.length },
              textStyle: styles,
              fields: Object.keys(styles).join(","),
            },
          });
        }

        index += text.length;
      }
    } else if (node.nodeName === "IMG") {
      // Handle image insertion
      const imgSrc = (node as HTMLImageElement).src;
      if (imgSrc) {
        requests.push({
          insertInlineImage: {
            location: { index },
            uri: imgSrc,
            objectSize: {
              height: { magnitude: 200, unit: "PT" }, // Adjust size as needed
              width: { magnitude: 200, unit: "PT" },
            },
          },
        });
        index++; // Move index forward for the image
      }
    } else {
      // Detect styles
      let newStyles = { ...styles };
      if (node.nodeName === "STRONG" || node.nodeName === "B") {
        newStyles.bold = true;
      } else if (node.nodeName === "EM" || node.nodeName === "I") {
        newStyles.italic = true;
      } else if (node.nodeName === "U") {
        newStyles.underline = true;
      }

      // Process child nodes
      node.childNodes.forEach((child) => processNode(child, newStyles));

      if (node.nodeName === "P" || node.nodeName === "BR") {
        requests.push({
          insertText: { location: { index }, text: "\n" },
        });
        index++;
      }
    }
  }

  doc.body.childNodes.forEach((node) => processNode(node));

  return requests;
}

export { convertHtmlToDocsRequests, getOrCreateDocumentsFolder }