import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FileCheck,
  ShieldAlert,
  Building,
  User,
  Phone,
  MapPin,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { getIssueByIdApi, fileGrievanceApi } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { PriorityBadge } from "../components/PriorityBadge.jsx";

export const GrievanceForm = () => {
  const { issueId } = useParams();
  const navigate = useNavigate();
  const { citizen, isAuthenticated } = useAuth();

  const [issue, setIssue] = useState(null);
  const [loadingIssue, setLoadingIssue] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [contactDetails, setContactDetails] = useState({
    fullName: citizen?.fullName || "",
    phone: citizen?.phone || "",
    addressLine: "",
    ward: "Ward 12 - Indiranagar",
    pincode: "560038",
  });

  const [escalationReason, setEscalationReason] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchIssue = async () => {
      try {
        setLoadingIssue(true);
        const res = await getIssueByIdApi(issueId);
        if (res.data.success) {
          setIssue(res.data.issue);
          if (res.data.issue.pincode) {
            setContactDetails((prev) => ({ ...prev, pincode: res.data.issue.pincode }));
          }
        }
      } catch (err) {
        console.error("Error fetching issue for escalation:", err);
        setError("Could not load issue information.");
      } finally {
        setLoadingIssue(false);
      }
    };

    fetchIssue();
  }, [issueId, isAuthenticated]);

  const handleContactChange = (e) => {
    setContactDetails({ ...contactDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Form validation rules (Lab 6 Task 3 equivalent)
    const { fullName, phone, addressLine, ward, pincode } = contactDetails;
    if (!fullName.trim() || !phone.trim() || !addressLine.trim() || !ward.trim() || !pincode.trim()) {
      setError("All contact fields are mandatory.");
      return;
    }

    if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!/^\d{6}$/.test(pincode.trim())) {
      setError("Postal Pincode must contain exactly 6 digits.");
      return;
    }

    if (!escalationReason.trim() || escalationReason.trim().length < 10) {
      setError("Please provide an escalation reason of at least 10 characters.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fileGrievanceApi({
        issueId,
        contactDetails,
        escalationReason,
      });

      if (res.data.success) {
        navigate(`/my-grievances`, {
          state: { newTrackingId: res.data.trackingId },
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to file official grievance.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingIssue) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Preparing grievance dossier...</p>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-3xl text-center space-y-4 border border-rose-200">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold">Issue Not Found</h3>
        <Link to="/issues" className="text-blue-600 text-sm font-semibold">
          Return to civic issues
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          to={`/issues/${issueId}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel and return to issue
        </Link>
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <FileCheck className="w-3.5 h-3.5" />
          SLA-Backed Municipal Escalation
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          File Official Municipal Grievance
        </h1>
        <p className="text-sm text-slate-500">
          Generate an official tracked ticket with the Ward Executive Engineer.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact & Escalation Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5"
          >
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Citizen / Complainant Verification
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="fullName"
                  value={contactDetails.fullName}
                  onChange={handleContactChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Contact Phone * (10 digits)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  name="phone"
                  value={contactDetails.phone}
                  onChange={handleContactChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Street / Residential Address *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="addressLine"
                  value={contactDetails.addressLine}
                  onChange={handleContactChange}
                  placeholder="House #104, 3rd Cross, Defense Colony"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Ward Jurisdiction *
                </label>
                <input
                  type="text"
                  name="ward"
                  value={contactDetails.ward}
                  onChange={handleContactChange}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Postal Pincode * (6 digits)
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={contactDetails.pincode}
                  onChange={handleContactChange}
                  maxLength={6}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Reason for Escalation / Public Risk *
              </label>
              <textarea
                rows={3}
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
                placeholder="State why this needs urgent departmental intervention (e.g., school buses pass here, risk of electrocution, water wastage)..."
                required
                className="w-full p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? "Submitting Official Grievance..." : "Confirm & Submit Grievance Ticket"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right: Immutable Issue Snapshot Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
              <span>Issue Snapshot</span>
              <PriorityBadge priority={issue.priority} />
            </div>

            <div className="rounded-2xl overflow-hidden h-36 w-full bg-slate-800">
              <img
                src={issue.image}
                alt={issue.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <span className="text-xs text-blue-400 font-bold">{issue.category}</span>
              <h4 className="text-base font-bold text-white mt-0.5">{issue.title}</h4>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="truncate">{issue.location}</span>
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Department:</span>
                <span className="font-semibold text-white">{issue.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Response SLA:</span>
                <span className="font-semibold text-emerald-400">
                  {issue.priority === "CRITICAL" ? "48 Hours" : "5 Business Days"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
