import AppSidebar from "@/components/app-sidebar";
import Documents from "@/components/dashboard/Documents";
import TextEditor from "@/components/dashboard/TextEditor";
import Starred from "@/components/dashboard/Starred";
import Trash from "@/components/dashboard/Trash";
import Settings from "@/components/dashboard/Settings";
import Help from "@/components/dashboard/Help";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Routes, Route } from "react-router-dom";

export default function Dashboard() {
    const user = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [showTimeoutPopup, setShowTimeoutPopup] = useState(false);
    const [activeItem, setActiveItem] = useState("documents");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user == undefined) return;
        setLoading(false);
        if (user?.email) {
            navigate("/dashboard/documents")
        } else {
            setLoading(false);
            navigate("/login")
        }
    }, [user])

    useEffect(() => {
        const path = location.pathname;
        if (path.includes("documents")) setActiveItem("documents");
        else if (path.includes("new")) setActiveItem("new");
        else if (path.includes("edit")) setActiveItem("edit");
        else if (path.includes("starred")) setActiveItem("starred");
        else if (path.includes("trash")) setActiveItem("trash");
        else if (path.includes("settings")) setActiveItem("settings");
        else if (path.includes("help")) setActiveItem("help");
        else setActiveItem("");
    }, [location]);

    useEffect(() => {
        if (loading) {
            const timeout = setTimeout(() => {
                setShowTimeoutPopup(true);
            }, 10000); // 20 seconds timeout

            return () => clearTimeout(timeout);
        }
    }, [loading]);

    if(loading){
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <div className="text-gray-600 text-lg">Loading your dashboard...</div>
                
                {showTimeoutPopup && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Session Timeout</h3>
                            <p className="text-gray-600 mb-6">Your session has expired. Please log in again to continue.</p>
                            <button
                                onClick={() => navigate("/login")}
                                className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                            >
                                Log In Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="flex min-h-screen">
            <AppSidebar 
                activeItem={activeItem} 
                setActiveItem={setActiveItem} 
                onCollapseChange={setIsSidebarCollapsed}
            />
            <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-[80px]' : 'ml-[280px]'}`}>
                <div className="min-h-screen">
                    <header className="flex h-[69px] shrink-0 items-center gap-4 border-b px-6">
                        <div className="text-lg font-medium">
                            Welcome, {user?.displayName} 
                        </div>
                    </header>
                    <Routes>
                        <Route path="documents" element={<Documents />} />
                        <Route path="new" element={<TextEditor />} />
                        <Route path="edit/:id" element={<TextEditor />} />
                        <Route path="starred" element={<Starred />} />
                        <Route path="trash" element={<Trash />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="help" element={<Help />} />
                    </Routes>
                </div>
            </main>
        </div>
    )
}