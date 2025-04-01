import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-gray-50">
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
} 