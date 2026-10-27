import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FileText,
  Clock,
  Building,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Compass,
  Loader2,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { getMyGrievancesApi } from "../services/api.js";

export const MyGrievances = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  const newTrackingId = location.state?.newTrackingId;

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getMyGrievancesApi();
      if (res.data.success) {
        setGrievances(res.data.grievances || []);
      }
    } catch (err) {
      console.error("Fetch Grievances Error:", err);
      setError(err.response?.data?.message || "Failed to load filed grievances.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "INSPECTION_SCHEDULED":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "WORK_IN_PROGRESS":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "RESOLVED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Newly submitted success alert banner if navigated here from filing */}
      {newTrackingId && (
        <div className="p-4 rounded-2xl bg-emerald-500 text-white shadow-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-100 shrink-0" />
            <div>
              <div className="font-bold text-sm">Grievance Successfully Registered!</div>
              <div className="text-xs text-emerald-100">
                Official Tracking ID: <span className="font-mono font-bold">{newTrackingId}</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-semibold bg-emerald-600 px-3 py-1 rounded-full">
            Under Municipal Review
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            Official Municipal Records
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            My Grievances & Escalations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor the status progression of official tickets dispatched to municipal departments
          </p>
        </div>

        {grievances.length > 0 && (
          <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-bold text-xs border border-blue-200 self-start sm:self-auto">
            {grievances.length} {grievances.length === 1 ? "Ticket" : "Tickets"} Active
          </div>
        )}
      </div>

      {/* Content states */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading your official tickets...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-3xl border border-rose-200 p-12 text-center space-y-4 max-w-lg mx-auto">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">Failed to load grievances</h3>
          <p className="text-sm text-slate-600">{error}</p>
          <button
            onClick={fetchGrievances}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow"
          >
            Try Again
          </button>
        </div>
      ) : grievances.length === 0 ? (
        /* Empty State (Lab 6 Task 8 requirement) */
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-5 max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
            🏛️
          </div>
          <h3 className="text-2xl font-black text-slate-900">No Grievances Filed Yet</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            When you escalate a civic issue to municipal authorities, your official tracking records and engineer notes will appear here.
          </p>
          <div className="pt-2">
            <Link
              to="/issues"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition"
            >
              <Compass className="w-4 h-4" />
              Explore Civic Issues to Escalate
            </Link>
          </div>
        </div>
      ) : (
        /* List of Grievance Cards */
        <div className="space-y-4">
          {grievances.map((grievance) => (
            <div
              key={grievance._id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="font-mono text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                    {grievance.trackingId}
                  </div>
                  <span className="text-xs text-slate-400">
                    Filed on {new Date(grievance.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                      grievance.status
                    )}`}
                  >
                    {grievance.status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              {/* Snapshot Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {grievance.issueSnapshot?.image && (
                  <div className="md:col-span-3 h-28 rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={grievance.issueSnapshot.image}
                      alt={grievance.issueSnapshot.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className={grievance.issueSnapshot?.image ? "md:col-span-6" : "md:col-span-9"}>
                  <span className="text-xs font-bold text-blue-600">
                    {grievance.issueSnapshot?.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {grievance.issueSnapshot?.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {grievance.issueSnapshot?.location}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-600 mt-2 font-medium">
                    <Building className="w-3.5 h-3.5 text-blue-500" />
                    <span>{grievance.assignedDepartment}</span>
                  </div>
                </div>

                <div className="md:col-span-3 flex flex-col items-start md:items-end justify-center gap-2">
                  <Link
                    to={`/grievances/${grievance._id}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition"
                  >
                    <span>Track Ticket Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Officer Note Snippet */}
              {grievance.officerNotes && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">Latest Action: </span>
                    {grievance.officerNotes}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
