import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Mail, Loader, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ type: "", text: "", token: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "", token: "" });
    
    const res = await forgotPassword(email);
    if (res.success) {
      setMessage({ type: "success", text: res.message, token: res.resetToken });
    } else {
      setMessage({ type: "error", text: res.message });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-background">
      <div className="w-full max-w-md p-8 rounded-2xl bg-surface border border-slate-200 shadow-xl">
        <Link to="/login" className="inline-flex items-center text-sm text-text-muted hover:text-text-main mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-main mb-2">Reset Password</h1>
          <p className="text-text-muted">Enter your email to receive a reset link</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg border text-sm ${message.type === "error" ? "bg-red-500/10 border-red-500/50 text-red-500" : "bg-green-500/10 border-green-500/50 text-green-500"}`}>
            {message.text}
            {message.token && (
              <div className="mt-4 p-3 bg-background rounded border border-surface text-xs break-all text-text-muted">
                <strong>Dev Note (Token):</strong> <br/>
                <Link to={`/reset-password/${message.token}`} className="text-primary hover:underline mt-2 inline-block">
                  Click here to proceed to reset password
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-background border border-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-text-main placeholder-text-muted/50"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center shadow-md shadow-primary/20"
          >
            {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
