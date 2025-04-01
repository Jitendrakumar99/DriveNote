import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from '@tinymce/tinymce-react';
import { Save, ArrowLeft, Loader2 } from "lucide-react";

const TextEditor = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (id) {
      console.log("TextEditor mounted with ID:", id);
      fetchDocument();
    } else {
      console.log("TextEditor mounted in create mode");
    }
  }, [id]);

  const fetchDocument = async () => {
    if (!user) {
      console.log("No user found, cannot fetch document");
      return;
    }
    
    setFetching(true);
    try {
      const token = await user.getIdToken();
      console.log("Fetching document with ID:", id);
      console.log("API URL:", `${import.meta.env.VITE_API_BASE_URL}/api/docs/${id}`);
      
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/docs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Document response status:", res.status);
      console.log("Document response data:", res.data);
      
      if (res.status === 200) {
        const doc = res.data;
        console.log("Setting document data:", {
          title: doc.title,
          contentLength: doc.content?.length,
        });
        
        setTitle(doc.title || "");
        setContent(doc.content || "");
      }
    } catch (error: any) {
      console.error("Error fetching document:", error);
      console.error("Error response:", error.response?.data);
      alert(`Failed to load document: ${error.response?.data?.message || error.message}`);
    } finally {
      setFetching(false);
    }
  };

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
  }

  const getStoredAccessToken = () => {
    return localStorage.getItem("googleAccessToken");
  };

  const saveDocument = async (saveAsDraft: boolean = false) => {
    if (!user) {
      alert("You must be logged in to save documents.");
      return;
    }

    setLoading(true);
    const token = await user.getIdToken();

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const endpoint = id ? `${apiBaseUrl}/api/docs/${id}` : `${apiBaseUrl}/api/docs/create`;
      const method = id ? 'put' : 'post';

      const res = await axios[method](
        endpoint,
        { content, title, isDraft: saveAsDraft },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        if (!saveAsDraft) {
          const accessToken = getStoredAccessToken();
          const driveRes = await axios.post(
            `${apiBaseUrl}/api/docs/upload/${res.data._id}`,
            { content, title, accessToken },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if(driveRes.status === 200){
            alert("Document saved successfully!")
            navigate("/dashboard/documents");
          }
        } else {
          alert("Draft saved successfully!")
          navigate("/dashboard/documents");
        }
      }
    } catch (error: any) {
      console.error("Error saving document:", error);
      alert(`Error saving document: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/dashboard/documents")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              {id ? "Edit Document" : "New Document"}
            </h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => saveDocument(true)}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save as Draft</span>
                </>
              )}
            </button>
            <button
              onClick={() => saveDocument(false)}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save to Drive</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Editor Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <Input 
              value={title} 
              onChange={handleTitleChange} 
              placeholder="Enter document title..."
              className="text-2xl font-semibold border-none focus-visible:ring-0 p-0"
            />
          </div>
          <div className="p-6">
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              value={content}
              onEditorChange={(content) => setContent(content)}
              init={{
                height: 600,
                menubar: true,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic backcolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
                skin: 'oxide',
                content_css: 'default'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
