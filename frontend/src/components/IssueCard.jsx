import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThumbsUp, Bookmark, MapPin, Eye, ArrowUpRight } from "lucide-react";
import { StatusBadge } from "./StatusBadge.jsx";
import { PriorityBadge } from "./PriorityBadge.jsx";
import { useApp } from "../context/AppContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export const IssueCard = ({ issue }) => {
  const { isWatchlisted, toggleWatchlist, isUpvoted, toggleUpvote } = useApp();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [savingWatchlist, setSavingWatchlist] = useState(false);
  const [savingUpvote, setSavingUpvote] = useState(false);
  const [localUpvotes, setLocalUpvotes] = useState(issue.upvotesCount || 0);

  const watchlisted = isWatchlisted(issue._id);
  const upvoted = isUpvoted(issue._id);

  const handleWatchlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      setSavingWatchlist(true);
      await toggleWatchlist(issue);
    } catch (err) {
      alert("Failed to update watchlist");
    } finally {
      setSavingWatchlist(false);
    }
  };

  const handleUpvoteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      setSavingUpvote(true);
      const res = await toggleUpvote(issue._id);
      if (res?.upvotesCount !== undefined) {
        setLocalUpvotes(res.upvotesCount);
      } else {
        setLocalUpvotes((prev) => (upvoted ? prev - 1 : prev + 1));
      }
    } catch (err) {
      alert("Failed to update upvote");
    } finally {
      setSavingUpvote(false);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Image container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={issue.image}
          alt={issue.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

        {/* Priority badge on top left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <PriorityBadge priority={issue.priority} />
        </div>

        {/* Watchlist Bookmark toggle button on top right */}
        <button
          onClick={handleWatchlistClick}
          disabled={savingWatchlist}
          title={watchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
            watchlisted
              ? "bg-rose-500 text-white hover:bg-rose-600 scale-105"
              : "bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${watchlisted ? "fill-current" : ""}`} />
        </button>

        {/* Category on bottom left over gradient */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-900/80 text-white backdrop-blur-sm">
            {issue.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <StatusBadge status={issue.status} />
            <span className="text-xs text-slate-400">
              {new Date(issue.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {issue.title}
          </h3>

          <p className="mt-1.5 text-xs text-slate-600 line-clamp-2">
            {issue.description}
          </p>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{issue.location}</span>
          </div>
        </div>

        {/* Card Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Upvote button */}
          <button
            onClick={handleUpvoteClick}
            disabled={savingUpvote}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              upvoted
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${upvoted ? "fill-current" : ""}`} />
            <span>{localUpvotes} Upvotes</span>
          </button>

          {/* View Details link */}
          <Link
            to={`/issues/${issue._id}`}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            <span>View & Escalate</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
