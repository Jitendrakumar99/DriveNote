import { Link } from "react-router-dom";
import { FileText, ArrowRight } from "lucide-react";

export default function Hero(){
    return(
        <div className="relative flex flex-col items-center justify-center min-h-screen text-center  px-4 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white -z-10"></div>
            
            {/* Animated background shapes */}
            <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

            <div className="space-y-8 relative max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full text-primary font-medium transform hover:scale-105 transition-transform duration-300">
                    <FileText className="w-5 h-5" />
                    <span>DriveNote - Smart Document Management</span>
                </div>
                <h1 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                    Transform Your Document Workflow with DriveNote
                </h1>
                <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Experience seamless document management with DriveNote. Create, edit, and collaborate on documents with real-time Google Drive integration.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md relative">
                <Link 
                    to="/login" 
                    className="group inline-flex items-center justify-center gap-2 px-10 py-5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg"
                >
                    Start Managing Documents
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-base text-gray-500 relative">
                <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Enterprise-grade security</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>Seamless Drive sync</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    <span>Advanced collaboration</span>
                </div>
            </div>
        </div>
    )
}