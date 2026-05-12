import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  LogOut,
  LayoutDashboard,
  PiggyBank,
  Layers,
  Menu,
  X,
  Wallet,
  User,
  Bell,
  DollarSign,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  /* ─────────────────────────────────────────────
     Scroll Effect
  ───────────────────────────────────────────── */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ─────────────────────────────────────────────
     Close Mobile Menu On Route Change
  ───────────────────────────────────────────── */
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  /* ─────────────────────────────────────────────
     Nav Links
  ───────────────────────────────────────────── */
  const navLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: <Wallet className="w-4 h-4" />,
    },
    {
      name: "Budgets",
      path: "/budgets",
      icon: <PiggyBank className="w-4 h-4" />,
    },
    {
      name: "Categories",
      path: "/categories",
      icon: <Layers className="w-4 h-4" />,
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="mx-auto w-full max-w-8xl px-4 sm:px-6 lg:px-20">
        <div className="flex items-center justify-between gap-4">
          {/* ───────────────── Logo ───────────────── */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <DollarSign className="w-4 h-4 text-white" />
            </div>

            <span className="font-black text-lg text-text-main tracking-tight">
              Wealthly
            </span>
          </Link>

          {/* ───────────────── Desktop Nav ───────────────── */}
          {user && (
            <div className="hidden lg:flex items-center gap-1 bg-slate-100/70 p-1 rounded-2xl border border-slate-200/70">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                    isActive(link.path)
                      ? "bg-white text-primary shadow-sm"
                      : "text-text-muted hover:text-text-main hover:bg-white/60"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
          )}

          {/* ───────────────── Right Side ───────────────── */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                {/* Notifications */}
                <button className="hidden md:flex md:hidden relative p-2.5 text-text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-colors">
                  <Bell className="w-5 h-5" />

                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                </button>

                {/* Profile - Desktop Only */}
                <Link
                  to="/profile"
                  className={`hidden lg:flex items-center gap-2 p-1 pr-3 rounded-2xl border transition-all ${
                    isActive("/profile")
                      ? "bg-primary/5 border-primary/20"
                      : "bg-white border-slate-200 hover:border-primary/30"
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                    <img
                      src={
                        user.profilePic ||
                        "https://www.gravatar.com/avatar?d=mp"
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-wider text-text-muted leading-none">
                      Account
                    </p>

                    <p className="text-xs font-bold text-text-main truncate max-w-[80px]">
                      {user.fullName.split(" ")[0]}
                    </p>
                  </div>
                </Link>

                {/* Logout Desktop */}
                <button
                  onClick={logout}
                  className="hidden lg:flex items-center justify-center p-2.5 text-text-muted hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() =>
                    setIsMobileMenuOpen(!isMobileMenuOpen)
                  }
                  className="lg:hidden p-2.5 bg-slate-100 text-text-main rounded-xl hover:bg-slate-200 transition-colors"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </>
            ) : (
              <>
                {/* Desktop Guest Buttons */}
                <div className="hidden sm:flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-5 py-2 text-sm font-bold text-text-muted hover:text-primary transition-colors"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/signup"
                    className="px-6 py-2.5 text-sm font-black bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                  >
                    Get Started
                  </Link>
                </div>

                {/* Mobile Guest Menu */}
                <button
                  onClick={() =>
                    setIsMobileMenuOpen(!isMobileMenuOpen)
                  }
                  className="sm:hidden p-2.5 bg-slate-100 text-text-main rounded-xl hover:bg-slate-200 transition-colors"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ───────────────── Mobile Drawer ───────────────── */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-slate-200 bg-white/95 backdrop-blur-xl">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-6">
            {user ? (
              <>
                {/* Mobile Nav Links */}
                <div className="space-y-2">
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
                      <div
                        className={`p-2 rounded-xl ${
                          isActive(link.path)
                            ? "bg-white/20"
                            : "bg-slate-100"
                        }`}
                      >
                        {link.icon}
                      </div>

                      {link.name}
                    </Link>
                  ))}
                </div>

                <hr className="my-5 border-slate-100" />

                {/* Mobile Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/profile"
                    className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 text-text-main font-bold"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>

                  <button
                    onClick={logout}
                    className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-rose-50 text-rose-600 font-bold"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              /* Guest Mobile Menu */
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  className="w-full text-center px-5 py-3 rounded-2xl border border-slate-200 font-bold text-text-main hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </Link>

                <Link
                  to="/signup"
                  className="w-full text-center px-5 py-3 rounded-2xl bg-primary text-white font-black shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}