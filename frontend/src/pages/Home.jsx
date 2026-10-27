import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  AlertOctagon,
  CheckCircle2,
  Users,
  Compass,
  ArrowRight,
  PlusCircle,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Clock,
} from "lucide-react";
import { getIssuesApi } from "../services/api.js";
import { IssueCard } from "../components/IssueCard.jsx";

export const Home = () => {
  const [featuredIssues, setFeaturedIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopIssues = async () => {
      try {
        const res = await getIssuesApi({ sort: "upvotes" });
        if (res.data.success) {
          setFeaturedIssues(res.data.issues.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load featured issues:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopIssues();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            Civic Grievance & Municipal Accountability Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Report Civic Problems. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-teal-200 to-sky-300">
              Track Real-Time City Solutions.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto font-normal leading-relaxed">
            Spot a pothole, broken streetlight, or water pipeline burst? Post it on FixMyCity, rally community upvotes, and escalate directly to municipal engineering departments.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/report"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-base shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
            >
              <PlusCircle className="w-5 h-5" />
              Report an Issue Now
            </Link>
            <Link
              to="/issues"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base border border-white/20 backdrop-blur-sm transition-all"
            >
              <Compass className="w-5 h-5" />
              Explore Neighborhood Issues
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-blue-700/50">
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <div className="text-3xl font-black text-white">450+</div>
              <div className="text-xs text-blue-200 mt-1">Civic Issues Logged</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <div className="text-3xl font-black text-emerald-400">82%</div>
              <div className="text-xs text-blue-200 mt-1">Resolution Rate</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <div className="text-3xl font-black text-amber-300">48 hrs</div>
              <div className="text-xs text-blue-200 mt-1">Avg First Response</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <div className="text-3xl font-black text-sky-300">7 Wards</div>
              <div className="text-xs text-blue-200 mt-1">Active Municipal Hubs</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
            The Civic Lifecycle
          </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How FixMyCity Resolves Urban Issues
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative hover:border-blue-300 transition">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-lg mb-4">
              1
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Report with Photo</h4>
            <p className="text-sm text-slate-600">
              Take a snapshot, pin your exact location, and specify the category like PWD Roads or Sanitation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative hover:border-blue-300 transition">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-black text-lg mb-4">
              2
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Community Upvotes</h4>
            <p className="text-sm text-slate-600">
              Neighbors and commuters upvote and follow the issue, signaling urgency to municipal officers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative hover:border-blue-300 transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-lg mb-4">
              3
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Official Escalation</h4>
            <p className="text-sm text-slate-600">
              Generate an official grievance tracking ID dispatched directly to the municipal engineer in charge.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative hover:border-blue-300 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-lg mb-4">
              4
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">Verified Resolution</h4>
            <p className="text-sm text-slate-600">
              Repairs are inspected, status progresses to Resolved, and the community is notified in real time.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Urgent Issues */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              Highest Community Priority
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Urgent Neighborhood Issues
            </h3>
          </div>
          <Link
            to="/issues"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            <span>View All Issues</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredIssues.map((issue) => (
              <IssueCard key={issue._id} issue={issue} />
            ))}
          </div>
        )}
      </section>

      {/* Civic Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-600 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-blue-500/20">
          <div className="space-y-3 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Notice a broken streetlight or open drain on your street?
            </h3>
            <p className="text-blue-100 text-sm sm:text-base">
              It takes less than 60 seconds to file a report and help your local ward council address safety hazards faster.
            </p>
          </div>
          <Link
            to="/report"
            className="px-8 py-4 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-xl shadow-md transition-all hover:scale-105 shrink-0"
          >
            Submit an Issue
          </Link>
        </div>
      </section>
    </div>
  );
};
