import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set, get) => ({
  user: null,
  isCheckingAuth: true,
  isLoggingIn: false,
  isSigningUp: false,
  isUpdatingProfile: false,
  isResettingPassword: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      set({ user: res.data });
    } catch (error) {
      console.error("Error in checkAuth:", error);
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ user: res.data.user });
      return { success: true };
    } catch (error) {
      console.error("Error in signup:", error);
      return { success: false, message: error.response?.data?.message || "Signup failed" };
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/signin", data);
      set({ user: res.data.user });
      return { success: true };
    } catch (error) {
      console.error("Error in login:", error);
      return { success: false, message: error.response?.data?.message || "Login failed" };
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null });
    } catch (error) {
      console.error("Error in logout:", error);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/profile", data);
      set({ user: res.data });
      return { success: true };
    } catch (error) {
      console.error("Error in updateProfile:", error);
      return { success: false, message: error.response?.data?.message || "Update failed" };
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  forgotPassword: async (email) => {
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      return { success: true, message: res.data.message, resetToken: res.data.resetToken };
    } catch (error) {
      console.error("Error in forgotPassword:", error);
      return { success: false, message: error.response?.data?.message || "Failed to generate token" };
    }
  },

  resetPassword: async (token, password) => {
    set({ isResettingPassword: true });
    try {
      const res = await axiosInstance.post(`/auth/reset-password/${token}`, { password });
      return { success: true, message: res.data.message };
    } catch (error) {
      console.error("Error in resetPassword:", error);
      return { success: false, message: error.response?.data?.message || "Password reset failed" };
    } finally {
      set({ isResettingPassword: false });
    }
  },
}));
