import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  Trash2,
  MapPin,
  ArrowRight,
  Compass,
  AlertTriangle,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { getWatchlistApi, removeFromWatchlistApi } from "../services/api.js";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { PriorityBadge } from "../components/PriorityBadge.jsx";
import { useApp } from "../context/AppContext.jsx";

export const Watchlist = () => {
  const { fetchWatchlist } = useApp();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getWatchlistApi();
      if (res.data.success) {
        setItems(res.data.watchlist || []);
      }
    } catch (err) {
      console.error("Watchlist fetch error:", err);
      setError(err.response?.data?.message || "Failed to load watchlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRemove = async (issueId) => {
    try {
      setRemovingId(issueId);
      await removeFromWatchlistApi(issueId);
      setItems((prev) => prev.filter((item) => item._id !== issueId));
      fetchWatchlist(); // sync navbar count
    } catch (err) {
      alert("Failed to remove issue from watchlist");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-wider mb-1">
            <Bookmark className="w-4 h-4 fill-current" />
            Tracked Neighborhood Concerns
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            My Watchlist
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Stay notified as municipal authorities inspect and repair problems you follow
          </p>
        </div>

        {items.length > 0 && (
          <div className="px-4 py-2 bg-rose-50 text-rose-700 rounded-xl font-bold text-xs border border-rose-200 self-start sm:self-auto">
            {items.length} {items.length === 1 ? "Issue" : "Issues"} Followed
          </div>
        )}
      </div>

      {/* Content states */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
          <p className="text-sm font-semibold text-slate-500">
            Loading your neighborhood watchlist...
          </p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-3xl border border-rose-200 p-12 text-center space-y-4 max-w-lg mx-auto">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">Unable to load watchlist</h3>
          <p className="text-sm text-slate-600">{error}</p>
          <button
            onClick={loadData}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow"
          >
            Try Again
          </button>
        </div>
      ) : items.length === 0 ? (
        /* Empty State (Lab 4 Task 7 requirement) */
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-5 max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto text-3xl shadow-inner">
            ❤️
          </div>
          <h3 className="text-2xl font-black text-slate-900">Your watchlist is empty</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Follow civic problems in your street or daily commute route to track when road works begin and get notified upon resolution.
          </p>
          <div className="pt-2">
            <Link
              to="/issues"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition"
            >
              <Compass className="w-4 h-4" />
              Browse Civic Issues
            </Link>
          </div>
        </div>
      ) : (
        /* Grid of Saved Issues */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((issue) => (
            <div
              key={issue._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-slate-100">
                  <img
                    src={issue.image}
                    alt={issue.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <PriorityBadge priority={issue.priority} />
                  </div>
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={issue.status} />
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                    {issue.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-2">
                    {issue.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{issue.location}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-5 pt-0 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <Link
                  to={`/issues/${issue._id}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold text-xs text-center transition"
                >
                  View Details
                </Link>

                <button
                  onClick={() => handleRemove(issue._id)}
                  disabled={removingId === issue._id}
                  title="Remove from Watchlist"
                  className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
