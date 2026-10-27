import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Bookmark,
  ThumbsUp,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useApp } from "../context/AppContext.jsx";
import { changePasswordApi } from "../services/api.js";

export const Profile = () => {
  const { citizen } = useAuth();
  const { watchlistCount } = useApp();

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });
  const [submittingPassword, setSubmittingPassword] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });

    if (!passwordData.oldPassword || !passwordData.newPassword) {
      setPasswordMsg({ type: "error", text: "Both old and new passwords are required." });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    try {
      setSubmittingPassword(true);
      const res = await changePasswordApi({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      if (res.data.success) {
        setPasswordMsg({ type: "success", text: "Password changed successfully!" });
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      setPasswordMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to update password. Verify current password.",
      });
    } finally {
      setSubmittingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-3xl shadow-lg shadow-blue-500/20">
          {citizen?.fullName?.charAt(0).toUpperCase() || "C"}
        </div>
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">{citizen?.fullName}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 w-fit mx-auto sm:mx-0">
              Verified Citizen
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Citizen ID: <span className="font-mono">{citizen?._id}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Info & Stats */}
        <div className="md:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Citizen Profile Information
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <div>
                  <strong className="block text-slate-800">Email Address:</strong>
                  <span>{citizen?.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <div>
                  <strong className="block text-slate-800">Registered Phone:</strong>
                  <span>{citizen?.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                <div>
                  <strong className="block text-slate-800">Primary Ward / City:</strong>
                  <span>{citizen?.city || "Bengaluru"}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                <div>
                  <strong className="block text-slate-800">Registered Since:</strong>
                  <span>{new Date(citizen?.createdAt || Date.now()).toLocaleDateString("en-US", { dateStyle: "medium" })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center gap-3">
              <Bookmark className="w-6 h-6 text-rose-500 fill-current" />
              <div>
                <div className="text-2xl font-black text-rose-700">{watchlistCount}</div>
                <div className="text-xs text-rose-600 font-medium">Watchlisted Issues</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-center gap-3">
              <ThumbsUp className="w-6 h-6 text-blue-600 fill-current" />
              <div>
                <div className="text-2xl font-black text-blue-700">
                  {citizen?.upvotedIssues?.length || 0}
                </div>
                <div className="text-xs text-blue-600 font-medium">Supported Upvotes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Form (Lab 1 Bonus Challenge) */}
        <div className="md:col-span-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Bonus Feature (+10 Marks)
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Change Account Password
              </h3>
            </div>

            {passwordMsg.text && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  passwordMsg.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {passwordMsg.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={passwordData.oldPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, oldPassword: e.target.value })
                    }
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  New Password (min 6 chars)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingPassword}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs shadow transition disabled:opacity-50"
              >
                {submittingPassword ? "Updating Password..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
