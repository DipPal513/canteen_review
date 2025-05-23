"use client";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import Cookies from "js-cookie";
import axios from "axios";

// Define the shape of your context
interface AppContextType {
  user: string | null;
  setUser: (user: string | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// Create Context
const AppContext = createContext<AppContextType>({
  user: null,
  setUser: () => {},
  loading: false,
  setLoading: () => {},
});

// Provider Component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("token");

      // if (!token) {
      //   setUser(null);
      //   console.log("there is no token")
      //   setLoading(false);
      //   return;
      // }

      try {
        const { data } = await axios.get("/api/auth/me");
        
        setUser(data); // Ensure API returns { user: "..." }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
