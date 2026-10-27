import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Search,
  Filter,
  ArrowUpDown,
  PlusCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { getIssuesApi } from "../services/api.js";
import { IssueCard } from "../components/IssueCard.jsx";

const CATEGORIES = [
  "All Categories",
  "Roads & Potholes",
  "Sanitation & Waste",
  "Water Supply",
  "Street Lighting",
  "Drainage & Sewage",
  "Parks & Public Spaces",
  "Traffic & Signals",
];

const STATUSES = ["ALL", "REPORTED", "ACKNOWLEDGED", "IN_PROGRESS", "RESOLVED"];

export const IssuesList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All Categories";
  const status = searchParams.get("status") || "ALL";
  const sort = searchParams.get("sort") || "newest";

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (search) params.search = search;
      if (category && category !== "All Categories") params.category = category;
      if (status && status !== "ALL") params.status = status;
      if (sort) params.sort = sort;

      const res = await getIssuesApi(params);
      if (res.data.success) {
        setIssues(res.data.issues || []);
      }
    } catch (err) {
      console.error("Fetch Issues Error:", err);
      setError("Something went wrong while loading civic issues from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [search, category, status, sort]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === "All Categories" || value === "ALL" || value === "newest") {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Civic Issue Explorer
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse, search, and upvote neighborhood infrastructure issues submitted by citizens
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Report New Issue
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => updateParam("search", e.target.value)}
              placeholder="Search by title, description, or landmark..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={category}
              onChange={(e) => updateParam("category", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white font-medium text-slate-700"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="md:col-span-2">
            <select
              value={status}
              onChange={(e) => updateParam("status", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white font-medium text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="REPORTED">Reported</option>
              <option value="ACKNOWLEDGED">Acknowledged</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="md:col-span-2">
            <select
              value={sort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white font-medium text-slate-700"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="upvotes">Sort: Most Upvoted</option>
              <option value="oldest">Sort: Oldest First</option>
            </select>
          </div>
        </div>

        {/* Active Filters count info */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800">{issues.length}</strong> civic issues
          </span>
          {(search || category !== "All Categories" || status !== "ALL" || sort !== "newest") && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area: Loading, Error, Empty, or Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-96 rounded-2xl bg-white border border-slate-200 p-4 space-y-4 animate-pulse"
            >
              <div className="h-44 bg-slate-200 rounded-xl" />
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-6 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-8 bg-slate-200 rounded mt-6" />
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error State (Lab 3 requirement) */
        <div className="bg-white rounded-3xl border border-rose-200 p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Failed to Load Issues</h3>
          <p className="text-sm text-slate-600">{error}</p>
          <button
            onClick={fetchIssues}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow transition"
          >
            Try Again
          </button>
        </div>
      ) : issues.length === 0 ? (
        /* Empty State (Lab 3 requirement) */
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-4 max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl font-black">
            🔍
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Civic Issues Found</h3>
          <p className="text-sm text-slate-500">
            No issues match your current search and filter criteria. Try adjusting your query or report a new problem.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              Clear Filters
            </button>
            <Link
              to="/report"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow"
            >
              Report This Problem
            </Link>
          </div>
        </div>
      ) : (
        /* Products / Issues Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <IssueCard key={issue._id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
};
