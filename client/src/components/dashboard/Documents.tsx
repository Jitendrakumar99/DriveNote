import { Plus, FileText, Clock, Trash2, Edit2, Filter } from "lucide-react";
import DocumentCard from "./DocumentCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationDialog from "../ui/DeleteConfirmationDialog";

type DocumentType = {
    _id: string;
    userId: string;
    title: string;
    content: string;
    createdAt: Date;
    googleDriveId: string;
    isDraft: boolean;
}

type FilterType = 'all' | 'drafts' | 'published';

export default function Documents(){
    const user = useAuth();
    const navigate = useNavigate();
    const [documents, setDocuments] = useState<DocumentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterType>('all');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<DocumentType | null>(null);

    useEffect(() => {
        async function getDocs(){
            try {
                const token = await user?.getIdToken();
                console.log("Fetching documents with token:", token ? "Token present" : "No token");
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/docs/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Server response:", res.data);
                if(res.status === 200){
                    const docs = Array.isArray(res.data.documents) ? res.data.documents : [];
                    console.log("Processed documents:", docs);
                    setDocuments(docs);
                }
            } catch (err) {
                console.error("Error fetching documents:", err);
                setError("Failed to load documents. Please try again later.");
                setDocuments([]);
            } finally {
                setLoading(false);
            }
        }
        getDocs();
    }, [user]);

    const filteredDocuments = Array.isArray(documents) ? documents.filter(doc => {
        if (filter === 'all') return true;
        if (filter === 'drafts') return doc.isDraft;
        if (filter === 'published') return !doc.isDraft;
        return true;
    }) : [];

    if(loading){
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if(error){
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="bg-red-100 p-4 rounded-lg">
                    <p className="text-red-600 font-medium">{error}</p>
                </div>
                <button 
                    onClick={() => window.location.reload()} 
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    const stripHtml = (html: string): string => {
        return html?.replace(/<[^>]+>/g, "") || "";
    };

    function handleNew(){
        navigate("/dashboard/new");
    }

    function handleEdit(id: string) {
        console.log("Navigating to edit document:", id);
        navigate(`/dashboard/edit/${id}`);
    }

    function handleDeleteClick(doc: DocumentType) {
        setDocumentToDelete(doc);
        setDeleteDialogOpen(true);
    }

    async function handleDeleteConfirm() {
        if (!documentToDelete) return;
        
        try {
            const token = await user?.getIdToken();
            const accessToken = localStorage.getItem("googleAccessToken");
            console.log("Attempting to delete document:", documentToDelete._id);
            const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/docs/${documentToDelete._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: {
                    accessToken
                }
            });
            
            if (response.status === 200) {
                console.log("Document deleted successfully");
                setDocuments(prevDocs => prevDocs.filter(doc => doc._id !== documentToDelete._id));
                setDeleteDialogOpen(false);
                setDocumentToDelete(null);
            }
        } catch (err: any) {
            console.error("Error deleting document:", err);
            const errorMessage = err.response?.data?.message || "Failed to delete document. Please try again.";
            alert(errorMessage);
        }
    }

    return(
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Documents</h1>
                <button 
                    onClick={handleNew}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create New</span>
                </button>
            </div>

            {/* Filter Section */}
            <div className="mb-6 flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            filter === 'all'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('drafts')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            filter === 'drafts'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Drafts
                    </button>
                    <button
                        onClick={() => setFilter('published')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            filter === 'published'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Published
                    </button>
                </div>
            </div>

            {filteredDocuments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocuments.map((doc) => (
                        <div
                            key={doc._id}
                            className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
                                doc.isDraft ? 'border-2 border-red-500' : ''
                            }`}
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800">{doc.title}</h3>
                                    {doc.isDraft && (
                                        <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">
                                            Draft
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-600 mb-4 line-clamp-2">
                                    {stripHtml(doc.content)}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">
                                        {new Date(doc.createdAt).toLocaleDateString()}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(doc._id)}
                                            className="p-2 text-gray-600 hover:text-primary rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(doc)}
                                            className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
                    <div className="p-4 bg-gray-50 rounded-full">
                        <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {filter === 'all' ? 'No documents yet' : 
                             filter === 'drafts' ? 'No drafts found' : 
                             'No published documents'}
                        </h3>
                        <p className="text-gray-600">
                            {filter === 'all' ? 'Create your first document to get started!' :
                             filter === 'drafts' ? 'Create a new document and save it as a draft' :
                             'Publish a document to see it here'}
                        </p>
                    </div>
                    <button 
                        onClick={handleNew}
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
                    >
                        Create New Document
                    </button>
                </div>
            )}

            <DeleteConfirmationDialog
                isOpen={deleteDialogOpen}
                onClose={() => {
                    setDeleteDialogOpen(false);
                    setDocumentToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Delete Document"
                message={`Are you sure you want to delete "${documentToDelete?.title}"? This action cannot be undone.`}
            />
        </div>
    );
}