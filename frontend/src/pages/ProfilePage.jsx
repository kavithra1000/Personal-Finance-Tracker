import { useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { User, Camera, Loader } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, updateProfile, isUpdatingProfile } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePic || "");
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {};
    if (fullName !== user.fullName) data.fullName = fullName;
    if (profilePic) data.profilePic = profilePic;
    
    if (Object.keys(data).length === 0) {
      toast.error("No changes to save");
      return;
    }

    const res = await updateProfile(data);
    if (res.success) {
      toast.success("Profile updated successfully!");
      setProfilePic(null);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="container mx-auto p-4 py-12 max-w-2xl bg-background">
      <div className="bg-surface rounded-2xl p-8 border border-slate-200 shadow-xl">
        <h1 className="text-3xl font-bold text-text-main mb-8">Profile Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col items-center">
            <div className="relative group">
              <img 
                src={previewUrl || "https://www.gravatar.com/avatar?d=mp"} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-surface shadow-xl"
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-8 h-8 text-white" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <p className="text-sm text-text-muted mt-3">Click to update profile picture</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Email Address (Read Only)</label>
              <input 
                type="email" 
                value={user?.email || ""}
                readOnly
                className="w-full px-4 py-3 rounded-lg bg-background border border-surface text-text-muted opacity-70 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-background border border-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-text-main"
                  required
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isUpdatingProfile}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center shadow-md shadow-primary/20"
          >
            {isUpdatingProfile ? <Loader className="w-5 h-5 animate-spin" /> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
