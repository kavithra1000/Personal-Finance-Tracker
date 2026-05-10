import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, User, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-surface bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-text-main hover:text-primary transition-colors">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          FinanceTracker
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <Link to="/dashboard" className="hidden sm:flex items-center gap-2 text-text-muted hover:text-text-main transition-colors">
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              
              <Link to="/profile" className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors">
                <img 
                  src={user.profilePic || "https://www.gravatar.com/avatar?d=mp"} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-surface object-cover shadow-sm"
                />
                <span className="hidden sm:inline font-medium">{user.fullName}</span>
              </Link>
              
              <button 
                onClick={logout}
                className="flex items-center gap-2 text-text-muted hover:text-red-500 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
