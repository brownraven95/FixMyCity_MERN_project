import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Camera,
  MapPin,
  AlertOctagon,
  Building,
  AlertCircle,
  ArrowRight,
  Image as ImageIcon,
} from "lucide-react";
import { createIssueApi } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const CATEGORIES = [
  "Roads & Potholes",
  "Sanitation & Waste",
  "Water Supply",
  "Street Lighting",
  "Drainage & Sewage",
  "Parks & Public Spaces",
  "Traffic & Signals",
  "Other",
];

const PRESET_IMAGES = [
  {
    label: "Road Pothole",
    url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Garbage Dump",
    url: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Water Leakage",
    url: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80",
  },
  {
    label: "Streetlight Issue",
    url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
  },
];

export const ReportIssue = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Roads & Potholes",
    location: "",
    pincode: "560001",
    priority: "MEDIUM",
    image: PRESET_IMAGES[0].url,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!formData.title || !formData.description || !formData.category || !formData.location || !formData.image) {
      setError("Please fill in all mandatory fields (Title, Category, Description, Location, Photo URL).");
      return;
    }

    try {
      setLoading(true);
      const res = await createIssueApi(formData);
      if (res.data.success) {
        navigate(`/issues/${res.data.issue._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create civic issue. Please check fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Report a Civic Problem
        </h1>
        <p className="text-sm text-slate-500">
          Your report will be publicly visible to neighbors and forwarded to the appropriate municipal authority.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Issue Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Deep asphalt crater opposite Metro station gate 2"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
          />
        </div>

        {/* Category & Priority Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Civic Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white font-medium"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Urgency / Priority *
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white font-medium"
            >
              <option value="LOW">Low — Minor nuisance</option>
              <option value="MEDIUM">Medium — Standard street repair</option>
              <option value="HIGH">High — Severe disruption / Traffic</option>
              <option value="CRITICAL">Critical — Safety / Life Hazard</option>
            </select>
          </div>
        </div>

        {/* Location & Pincode */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Exact Landmark / Location *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., 14th Main, 4th Sector, HSR Layout"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Postal Pincode
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="560001"
              maxLength={6}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Detailed Description *
          </label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Explain what the problem is, how long it has persisted, and the risk it poses to pedestrians or drivers..."
            required
            className="w-full p-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Photo URL & Presets */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Photo URL *
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/photo.jpg"
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm mb-2"
          />

          <div className="text-xs text-slate-500 mb-2 font-medium">Or pick a quick demo photo:</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_IMAGES.map((img) => (
              <button
                type="button"
                key={img.label}
                onClick={() => setFormData({ ...formData, image: img.url })}
                className={`p-2 rounded-xl border text-xs font-semibold text-left transition flex items-center gap-1.5 ${
                  formData.image === img.url
                    ? "border-blue-600 bg-blue-50 text-blue-700 font-bold"
                    : "border-slate-200 hover:bg-slate-50 text-slate-600"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="truncate">{img.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? "Registering Civic Issue..." : "Submit Civic Report"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
