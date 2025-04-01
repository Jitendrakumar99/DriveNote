import React, { useEffect, useState } from "react";
import { signInWithGoogle } from "../firebase";
import axios from "axios";
import { NotebookText, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import { User } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const currentUser = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      navigate("/dashboard/documents")
    }
  }, [currentUser]);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const userInfo = await signInWithGoogle();
      if (userInfo) {
        setUser(userInfo.user);
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/save`,
          {},
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`
            }
          }
        );
        if(res.status === 200){
          console.log("User created successfully.");
        }
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      alert(`Login failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex items-center justify-center min-h-screen py-12", className)} {...props}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Logo and Title */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-primary/10 rounded-xl">
                <NotebookText className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
              <p className="mt-2 text-gray-600">Sign in to continue to DriveNote</p>
            </div>
          </div>

          {/* Login Button */}
          <div className="mt-8">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-gray-700">Signing in...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="text-gray-700">Continue with Google</span>
                </>
              )}
            </button>
          </div>

          {/* Features */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Secure authentication with Google</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Seamless Google Drive integration</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Access your documents anywhere</span>
            </div>
          </div>

          {/* Terms */}
          <div className="text-center text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <a href="#" className="text-primary hover:text-primary/90">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:text-primary/90">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
