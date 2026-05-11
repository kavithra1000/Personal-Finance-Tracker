import { useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { User, Camera, Loader, Mail, Calendar, ShieldCheck, Edit3, Check, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const { user, updateProfile, isUpdatingProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
  });
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
        if (!isEditing) setIsEditing(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setFormData({ fullName: user?.fullName || "" });
    setPreviewUrl(user?.profilePic || "");
    setProfilePic(null);
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {};
    if (formData.fullName !== user.fullName) data.fullName = formData.fullName;
    if (profilePic) data.profilePic = profilePic;
    
    if (Object.keys(data).length === 0) {
      setIsEditing(false);
      return;
    }

    const res = await updateProfile(data);
    if (res.success) {
      toast.success("Profile updated successfully!");
      setProfilePic(null);
      setIsEditing(false);
    } else {
      toast.error(res.message);
    }
  };

  const joinedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    day: 'numeric'
  }) : "Recent Member";

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 max-w-5xl">
      {/* Page Header */}
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-text-main tracking-tight">Account Settings</h1>
        <p className="text-sm md:text-base text-text-muted mt-1">Manage your personal information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column: Avatar and Quick Stats */}
        <div className="space-y-6">
          <div className="bg-surface rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm text-center">
            <div className="relative inline-block mx-auto">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl overflow-hidden border-4 border-slate-50 shadow-xl bg-slate-100">
                <img 
                  src={previewUrl || "https://www.gravatar.com/avatar?d=mp&s=200"} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-2 md:p-2.5 bg-primary text-white rounded-xl shadow-lg border-2 border-surface hover:bg-primary-dark transition-all active:scale-90"
              >
                <Camera className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            
            <h2 className="mt-4 md:mt-6 text-lg md:text-xl font-bold text-text-main truncate px-2">{user?.fullName}</h2>
            <p className="text-xs md:text-sm text-text-muted truncate px-2">{user?.email}</p>
            
            <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-slate-100 grid grid-cols-1 gap-3 md:gap-4">
               <div className="flex items-center gap-3 text-left p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                    <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] md:text-[10px] uppercase font-bold tracking-wider text-slate-400">Joined</p>
                    <p className="text-xs md:text-sm font-bold text-text-main">{joinedDate}</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-3 text-left p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                    <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] md:text-[10px] uppercase font-bold tracking-wider text-slate-400">Status</p>
                    <p className="text-xs md:text-sm font-bold text-emerald-600">Verified User</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
              <h2 className="text-lg md:text-xl font-bold text-text-main">Personal Information</h2>
              {isEditing ? (
                 <span className="px-2 md:px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] md:text-[10px] font-bold uppercase tracking-widest animate-pulse">
                   Editing Mode
                 </span>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-text-main text-xs font-bold rounded-xl hover:bg-slate-200 transition-all active:scale-[0.98]"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Full Name</label>
                  <div className="relative group">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 transition-colors ${isEditing ? 'text-primary' : 'text-slate-400'}`} />
                    <input 
                      type="text" 
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full pl-10 md:pl-12 pr-4 py-3 md:py-3.5 rounded-2xl transition-all outline-none font-medium text-sm ${
                        isEditing 
                          ? 'bg-white border-2 border-primary ring-4 ring-primary/5 text-text-main shadow-sm' 
                          : 'bg-slate-50 border border-slate-200 text-text-muted cursor-not-allowed opacity-80'
                      }`}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-muted ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                    <input 
                      type="email" 
                      value={user?.email || ""}
                      readOnly
                      className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 font-medium text-sm cursor-not-allowed opacity-60"
                    />
                  </div>
                  <p className="text-[10px] text-text-muted mt-2 ml-1 italic flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500 flex-shrink-0" /> 
                    <span className="truncate">This is your verified login email and cannot be changed.</span>
                  </p>
                </div>
              </div>

              {isEditing && (
                <div className="pt-6 md:pt-8 mt-6 md:mt-8 border-t border-slate-50 flex flex-col sm:flex-row items-center gap-3 md:gap-4 animate-in slide-in-from-bottom-4 duration-300">
                  <button 
                    type="submit" 
                    disabled={isUpdatingProfile}
                    className="w-full sm:flex-1 py-3.5 md:py-4 bg-primary text-white text-sm md:text-base font-bold rounded-2xl hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
                  >
                    {isUpdatingProfile ? <Loader className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                    Save Changes
                  </button>
                  <button 
                    type="button" 
                    onClick={handleCancel}
                    className="w-full sm:flex-1 py-3.5 md:py-4 bg-slate-100 text-text-main text-sm md:text-base font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Security Card */}
          <div className="bg-surface rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-text-main">Password & Security</h3>
              <p className="text-xs md:text-sm text-text-muted mt-1">Keep your account secure with regular updates.</p>
            </div>
            <Link 
              to="/forgot-password" 
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-text-main hover:bg-slate-50 transition-colors text-center"
            >
              Update Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
