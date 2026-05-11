import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import TransactionsPage from "./pages/TransactionsPage";
import BudgetsPage from "./pages/BudgetsPage";
import CategoriesPage from "./pages/CategoriesPage";
import DashboardPage from "./pages/DashboardPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";

function App() {
  const { user, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-primary">
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="grow">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          
          <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          
          <Route path="/forgot-password" element={!user ? <ForgotPasswordPage /> : <Navigate to="/" />} />
          <Route path="/reset-password/:token" element={!user ? <ResetPasswordPage /> : <Navigate to="/" />} />
          
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
          
          <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
          
          <Route path="/transactions" element={user ? <TransactionsPage /> : <Navigate to="/login" />} />
          <Route path="/budgets" element={user ? <BudgetsPage /> : <Navigate to="/login" />} />
          <Route path="/categories" element={user ? <CategoriesPage /> : <Navigate to="/login" />} />
        </Routes>
      </main>
      <Toaster />
      <Footer />
    </div>
  );
}

export default App;
