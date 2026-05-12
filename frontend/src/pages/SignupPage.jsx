import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Loader,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { signup, isSigningUp } = useAuthStore();

  const validateField = (name, value, updatedFormData) => {
    let error = "";

    switch (name) {
      case "fullName":
        if (!value.trim()) {
          error = "Full name is required";
        }
        break;

      case "email":
        if (!value) {
          error = "Email is required";
        } else if (!emailRegex.test(value)) {
          error = "Enter a valid email";
        }
        break;

      case "password":
        if (!value) {
          error = "Password is required";
        } else if (!strongPasswordRegex.test(value)) {
          error =
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
        }
        break;

      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== updatedFormData.password) {
          error = "Passwords do not match";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);

    validateField(name, value, updatedFormData);

    // Revalidate confirm password when password changes
    if (name === "password" && updatedFormData.confirmPassword) {
      validateField(
        "confirmPassword",
        updatedFormData.confirmPassword,
        updatedFormData
      );
    }
  };

  const validate = () => {
    const fields = Object.keys(formData);

    fields.forEach((field) => {
      validateField(field, formData[field], formData);
    });

    const newErrors = {};

    if (!formData.fullName.trim())
      newErrors.fullName = "Full name is required";

    if (!formData.email)
      newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Enter a valid email";

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!strongPasswordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
    }

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const { fullName, email, password } = formData;

    const res = await signup({
      fullName,
      email,
      password,
    });

    if (!res.success) {
      toast.error(res.message);
    } else {
      toast.success("Account created! Welcome.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-background">
      <div className="w-full max-w-md p-8 rounded-2xl bg-surface border border-slate-200 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-main mb-2">
            Create Account
          </h1>
          <p className="text-text-muted">
            Start tracking your finances today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">
              Full Name
            </label>

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg bg-background border ${
                  errors.fullName
                    ? "border-rose-500"
                    : "border-surface"
                } focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-text-main placeholder-text-muted/50`}
                placeholder="John Doe"
              />
            </div>

            {errors.fullName && (
              <p className="mt-1 text-rose-600 text-xs">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">
              Email
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg bg-background border ${
                  errors.email
                    ? "border-rose-500"
                    : "border-surface"
                } focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-text-main placeholder-text-muted/50`}
                placeholder="you@example.com"
              />
            </div>

            {errors.email && (
              <p className="mt-1 text-rose-600 text-xs">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-3 rounded-lg bg-background border ${
                  errors.password
                    ? "border-rose-500"
                    : "border-surface"
                } focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-text-main placeholder-text-muted/50`}
                placeholder="••••••••"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1 text-rose-600 text-xs">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">
              Confirm Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />

              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-10 py-3 rounded-lg bg-background border ${
                  errors.confirmPassword
                    ? "border-rose-500"
                    : "border-surface"
                } focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-text-main placeholder-text-muted/50`}
                placeholder="••••••••"
              />
            </div>

            {errors.confirmPassword && (
              <p className="mt-1 text-rose-600 text-xs">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center shadow-md shadow-primary/20"
          >
            {isSigningUp ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-text-muted">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}