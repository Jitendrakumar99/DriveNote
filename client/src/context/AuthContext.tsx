import { createContext, useEffect, useState, useContext } from "react";
import { User, getAuth } from "firebase/auth";

type UserType = User | null;
type ContextState = { user: UserType };

const AuthContext = createContext<ContextState | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode; // Explicitly define children type
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserType>(null);
  const value: ContextState = { user };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        localStorage.setItem("user", JSON.stringify({ uid: currentUser.uid, email: currentUser.email }));
      } else {
        localStorage.removeItem("user");
      }
    });
    return () => unsubscribe();
  }, []);
  

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth must be used within a FirebaseAuthProvider"
    );
  }
  return context.user;
}

export { AuthProvider, useAuth };
