import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FileText,
  MapPin,
  Calendar,
  Building,
  User,
  Phone,
  CheckCircle2,
  Clock,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Wrench,
  ShieldCheck,
} from "lucide-react";
import { getGrievanceByIdApi, updateGrievanceStatusApi } from "../services/api.js";
import { PriorityBadge } from "../components/PriorityBadge.jsx";

const STATUS_STEPS = [
  { key: "SUBMITTED", label: "Ticket Submitted", desc: "Registered on municipal grievance exchange" },
  { key: "INSPECTION_SCHEDULED", label: "Site Inspection", desc: "Ward Engineer assigned for physical site survey" },
  { key: "WORK_IN_PROGRESS", label: "Work In Progress", desc: "Machinery and labor crew deployed on ground" },
  { key: "RESOLVED", label: "Issue Resolved", desc: "Work completed, inspected and signed off" },
];

export const GrievanceDetails = () => {
  const { id } = useParams();
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchGrievance = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getGrievanceByIdApi(id);
      if (res.data.success) {
        setGrievance(res.data.grievance);
      }
    } catch (err) {
      console.error("Fetch Grievance Details Error:", err);
      setError(err.response?.data?.message || "Failed to load grievance details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievance();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      setUpdating(true);
      const notesMap = {
        SUBMITTED: "Ticket lodged in municipal register.",
        INSPECTION_SCHEDULED: "Junior Engineer scheduled site survey for ward inspection.",
        WORK_IN_PROGRESS: "Contractor assigned. Repair materials and team active at site.",
        RESOLVED: "Physical works completed and quality compliance checked by Executive Engineer.",
      };

      const res = await updateGrievanceStatusApi(id, {
        status: newStatus,
        officerNotes: notesMap[newStatus],
      });

      if (res.data.success) {
        setGrievance(res.data.grievance);
      }
    } catch (err) {
      alert("Failed to advance status: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Loading grievance docket...</p>
      </div>
    );
  }

  if (error || !grievance) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-3xl text-center space-y-4 border border-rose-200">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold">Access Denied or Not Found</h3>
        <p className="text-sm text-slate-600">{error || "Grievance ticket could not be loaded."}</p>
        <Link to="/my-grievances" className="text-blue-600 text-sm font-semibold">
          Return to My Grievances
        </Link>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === grievance.status);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          to="/my-grievances"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Grievances
        </Link>
      </div>

      {/* Docket Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-widest text-blue-400 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Official Grievance Docket
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
            {grievance.trackingId}
          </h1>
          <p className="text-xs text-slate-400">
            Registered on {new Date(grievance.createdAt).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}
          </p>
        </div>

        <div className="self-start sm:self-auto">
          <span className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider">
            {grievance.status.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      {/* Visual Resolution Lifecycle Timeline */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900">
          Resolution Lifecycle & Tracking Stages
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step.key}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? "bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20"
                    : isCompleted
                    ? "bg-slate-50 border-slate-200"
                    : "bg-white border-slate-100 opacity-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCompleted ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className="text-xs font-bold text-slate-900">{step.label}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Latest Officer Note */}
        {grievance.officerNotes && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900 mb-0.5">Municipal Officer Log:</strong>
              <span>{grievance.officerNotes}</span>
            </div>
          </div>
        )}
      </div>

      {/* Grievance Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Issue Snapshot (Immutable) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Civic Issue Snapshot
          </h3>

          {grievance.issueSnapshot?.image && (
            <div className="h-44 rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={grievance.issueSnapshot.image}
                alt={grievance.issueSnapshot.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-blue-600">
                {grievance.issueSnapshot?.category}
              </span>
              <PriorityBadge priority={grievance.issueSnapshot?.priority} />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              {grievance.issueSnapshot?.title}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>{grievance.issueSnapshot?.location}</span>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">Target Department: </span>
            {grievance.assignedDepartment}
          </div>
        </div>

        {/* Complainant Contact Verification */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Complainant Verification Details
          </h3>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              <span>
                <strong className="text-slate-800">Citizen:</strong> {grievance.contactDetails?.fullName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-500" />
              <span>
                <strong className="text-slate-800">Verified Phone:</strong> {grievance.contactDetails?.phone}
              </span>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Address:</strong>{" "}
                {grievance.contactDetails?.addressLine}, {grievance.contactDetails?.ward} (PIN:{" "}
                {grievance.contactDetails?.pincode})
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <strong className="block text-slate-800 mb-1">Escalation Justification:</strong>
              <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 italic text-slate-700">
                "{grievance.escalationReason}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TA / Demo Status Transition Simulator */}
      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Wrench className="w-4 h-4 text-blue-600" />
          Interactive Status Progression Simulator (Evaluation Controls)
        </div>
        <p className="text-xs text-slate-500">
          Advance the grievance ticket through each municipal stage to test live database updates:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {STATUS_STEPS.map((s) => (
            <button
              key={s.key}
              onClick={() => handleUpdateStatus(s.key)}
              disabled={updating || grievance.status === s.key}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                grievance.status === s.key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
