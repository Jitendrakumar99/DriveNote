import { FileText, Plus, Star, Trash2, Settings, HelpCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";

interface AppSidebarProps {
    activeItem: string;
    setActiveItem: (item: string) => void;
    onCollapseChange: (collapsed: boolean) => void;
}

export default function AppSidebar({ activeItem, setActiveItem, onCollapseChange }: AppSidebarProps) {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

const data = {
  navMain: [
        {
          title: "My Documents",
          url: "dashboard/documents",
                icon: <FileText className="h-5 w-5" />,
        },
        {
          title: "Create New",
          url: "dashboard/new",
                icon: <Plus className="h-5 w-5" />,
            },
            {
                title: "Starred (working)",
                url: "dashboard/starred",
                icon: <Star className="h-5 w-5" />,
            },
            {
                title: "Trash (working)",
                url: "dashboard/trash",
                icon: <Trash2 className="h-5 w-5" />,
            },
        ],
        navFooter: [
            {
                title: "Settings (working)",
                url: "dashboard/settings",
                icon: <Settings className="h-5 w-5" />,
            },
            {
                title: "Help & Support (working)",
                url: "dashboard/help",
                icon: <HelpCircle className="h-5 w-5" />,
            },
        ],
    };

    const handleClick = (url: string) => {
        setActiveItem(url.split('/').pop() || '');
        navigate(`/${url}`);
    };

    const handleSignOut = async () => {
        try {
      const auth = getAuth();
        await signOut(auth);
            navigate("/login");
      } catch (error) {
        console.error("Error signing out:", error);
      }
  };

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
        onCollapseChange(!isCollapsed);
    };

  return (
        <div className={`fixed left-0 top-0 h-full bg-white border-r transition-all duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[280px]'}`}>
            <div className="flex flex-col h-full">
                {/* Logo and Toggle */}
                <div className="flex items-center justify-between p-4 border-b">
                    {!isCollapsed && (
                        <div className="flex items-center gap-2">
                            <FileText className="w-6 h-6 text-primary" />
                            <span className="text-xl font-semibold text-gray-900">DriveNote</span>
                        </div>
                    )}
                    <button
                        onClick={toggleCollapse}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg
                            className={`w-5 h-5 text-gray-500 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* Main Navigation */}
                <nav className="flex-1 py-4">
                    <ul className="space-y-1 px-2">
        {data.navMain.map((item) => (
                            <li key={item.title}>
                                <button
                                    onClick={() => handleClick(item.url)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                        activeItem === item.title.toLowerCase()
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {item.icon}
                                    {!isCollapsed && <span>{item.title}</span>}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer Navigation */}
                <div className="border-t py-4">
                    <ul className="space-y-1 px-2">
                        {data.navFooter.map((item) => (
                            <li key={item.title}>
                                <button
                                    onClick={() => handleClick(item.url)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                        activeItem === item.title.toLowerCase()
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {item.icon}
                                    {!isCollapsed && <span>{item.title}</span>}
                                </button>
                            </li>
                        ))}
                        <li>
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                {!isCollapsed && <span>Sign Out</span>}
            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
