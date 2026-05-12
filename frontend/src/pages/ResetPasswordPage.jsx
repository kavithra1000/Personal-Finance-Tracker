import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Lock, Loader } from "lucide-react";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, isResettingPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const res = await resetPassword(token, password);
    if (res.success) {
      toast.success("Password reset successful! Redirecting...");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-background">
      <div className="w-full max-w-md p-8 rounded-2xl bg-surface border border-slate-200 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-main mb-2">Set New Password</h1>
          <p className="text-text-muted">Enter your new secure password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-background border border-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-text-main placeholder-text-muted/50"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-background border border-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-text-main placeholder-text-muted/50"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isResettingPassword}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center shadow-md shadow-primary/20"
          >
            {isResettingPassword ? <Loader className="w-5 h-5 animate-spin" /> : "Reset Password"}
          </button>
        </form>

        <p className="mt-8 text-center text-text-muted">
          Remembered your password?{" "}
          <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
