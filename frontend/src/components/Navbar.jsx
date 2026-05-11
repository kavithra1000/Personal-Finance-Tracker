import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, LayoutDashboard, PiggyBank, Layers } from "lucide-react";

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

              <Link to="/transactions" className="hidden sm:flex items-center gap-2 text-text-muted hover:text-text-main transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Transactions</span>
              </Link>

              <Link to="/budgets" className="hidden sm:flex items-center gap-2 text-text-muted hover:text-text-main transition-colors">
                <PiggyBank className="w-5 h-5" />
                <span>Budgets</span>
              </Link>

              <Link to="/categories" className="hidden sm:flex items-center gap-2 text-text-muted hover:text-text-main transition-colors">
                <Layers className="w-5 h-5" />
                <span>Categories</span>
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
