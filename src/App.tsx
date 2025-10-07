import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, createContext, useContext } from "react";
import Layout from "./components/Layout";
import Landing from "./components/Landing";
import FarmingGame from "./pages/FarmingGame";
import Analysis from "./pages/Analysis";
import Community from "./pages/Community";
import Shop from "./pages/Shop";
import Settings from "./pages/Settings";
import Dashboard from "./components/Dashboard";
import Chatbot from "./components/Chatbot";
import AuthFlow from "./components/AuthFlow";
import CommunityLogin from "./pages/CommunityLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  language: string;
  isAuthenticated: boolean;
};

type AuthContextType = {
  user: User | null;
  login: (userData: Partial<User>) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const App = () => {
  // Initialize user from localStorage if available
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('farmtech_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = (userData: Partial<User>) => {
    const newUser: User = {
      id: userData.id || Date.now().toString(),
      name: userData.name || 'John Doe',
      email: userData.email || 'john.doe@email.com',
      phone: userData.phone || '+1 (555) 123-4567',
      language: userData.language || 'English',
      isAuthenticated: true,
    };
    setUser(newUser);
    // Save to localStorage for persistence
    localStorage.setItem('farmtech_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    // Remove from localStorage
    localStorage.removeItem('farmtech_user');
  };

  const authValue: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={authValue}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Landing page route */}
              <Route path="/" element={<Landing />} />
              
              {/* Auth route */}
              <Route path="/auth" element={<AuthFlow onBack={() => window.history.back()} onSuccess={() => window.location.href = '/dashboard'} />} />
              
              {/* Community login route */}
              <Route path="/community-login" element={<CommunityLogin />} />
              
              {/* Protected routes with layout */}
              <Route path="/*" element={authValue.isAuthenticated ? <Layout /> : <Navigate to="/auth" replace />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="farming-game" element={<FarmingGame />} />
                <Route path="analysis" element={<Analysis />} />
                <Route path="community" element={<Community />} />
                <Route path="shop" element={<Shop />} />
                <Route path="settings" element={<Settings />} />
                <Route path="chatbot" element={<Chatbot onBack={() => window.history.back()} />} />
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
