import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { 
  LogOut, LayoutDashboard, PiggyBank, Layers, 
  Menu, X, Wallet, User, ChevronDown, Bell
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Transactions", path: "/transactions", icon: <Wallet className="w-4 h-4" /> },
    { name: "Budgets", path: "/budgets", icon: <PiggyBank className="w-4 h-4" /> },
    { name: "Categories", path: "/categories", icon: <Layers className="w-4 h-4" /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-[2] w-full transition-all duration-300 ${
      isScrolled 
        ? "bg-white/80 backdrop-blur-lg shadow-sm py-2" 
        : "bg-background py-4"
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-black text-xl italic">F</span>
            </div>
            <div className="hidden xs:block">
              <span className="text-xl font-black text-text-main tracking-tight group-hover:text-primary transition-colors">Finance</span>
              <span className="text-xl font-light text-text-muted tracking-tight group-hover:text-primary transition-colors">Tracker</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden lg:flex items-center gap-1 bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                    isActive(link.path)
                      ? "bg-white text-primary shadow-sm"
                      : "text-text-muted hover:text-text-main hover:bg-white/50"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
          )}

          {/* User Actions / Auth */}
          <div className="flex items-center gap-2 md:gap-4">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 mr-2">
                   <button className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-colors relative">
                      <Bell className="w-5 h-5" />
                      <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                   </button>
                </div>

                <Link 
                  to="/profile" 
                  className={`flex items-center gap-2 p-1 pr-3 rounded-2xl border transition-all ${
                    isActive('/profile') 
                      ? "bg-primary/5 border-primary/20" 
                      : "bg-surface border-slate-200 hover:border-primary/30"
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                    <img 
                      src={user.profilePic || "https://www.gravatar.com/avatar?d=mp"} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-[10px] font-black uppercase tracking-tighter text-text-muted leading-none">Account</p>
                    <p className="text-xs font-bold text-text-main truncate max-w-[80px]">{user.fullName.split(' ')[0]}</p>
                  </div>
                </Link>

                <button 
                  onClick={logout}
                  className="hidden md:flex items-center justify-center p-2.5 text-text-muted hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2.5 bg-slate-100 text-text-main rounded-xl hover:bg-slate-200 transition-colors"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-5 py-2 text-sm font-bold text-text-muted hover:text-text-main transition-colors">Sign In</Link>
                <Link to="/signup" className="px-5 py-2 text-sm font-bold bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {user && (
        <div className={`lg:hidden fixed inset-x-0 top-[72px] bg-white border-b border-slate-200 shadow-xl transition-all duration-300 ease-in-out transform origin-top ${
          isMobileMenuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
        }`}>
          <div className="container mx-auto px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-4 px-5 py-3 rounded-2xl text-base font-bold transition-all ${
                  isActive(link.path)
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-text-muted hover:bg-slate-50"
                }`}
              >
                <div className={`p-2 rounded-xl ${isActive(link.path) ? "bg-white/20" : "bg-slate-100"}`}>
                  {link.icon}
                </div>
                {link.name}
              </Link>
            ))}
            <hr className="my-4 border-slate-100" />
            <div className="grid grid-cols-2 gap-4">
               <Link to="/profile" className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 text-text-main font-bold">
                  <User className="w-4 h-4" /> Profile
               </Link>
               <button 
                onClick={logout}
                className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-rose-50 text-rose-600 font-bold"
               >
                  <LogOut className="w-4 h-4" /> Logout
               </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
