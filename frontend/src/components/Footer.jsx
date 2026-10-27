import React from "react";
import { Building2, ShieldCheck, HeartHandshake, PhoneCall } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white">
                Fix<span className="text-blue-500">MyCity</span>
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Transforming urban governance by connecting proactive citizens with municipal public works departments for transparent issue tracking.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/issues" className="hover:text-white transition">
                  Browse Civic Issues
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-white transition">
                  Report a Community Problem
                </Link>
              </li>
              <li>
                <Link to="/watchlist" className="hover:text-white transition">
                  Tracked Neighborhood Issues
                </Link>
              </li>
              <li>
                <Link to="/my-grievances" className="hover:text-white transition">
                  Official Grievance History
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              Civic Categories
            </h4>
            <ul className="space-y-2 text-sm">
              <li>Roads, Bridges & Potholes (PWD)</li>
              <li>Solid Waste & Sanitation</li>
              <li>Clean Drinking Water & Pipelines</li>
              <li>Street Lighting & Electrical Grid</li>
              <li>Stormwater Drainage & Silt Removal</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              Municipal Helplines
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <PhoneCall className="w-4 h-4 text-blue-400" />
                <span>Toll-Free Civic Desk: 1912</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Govt SLA: 48-72 hr Response</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <HeartHandshake className="w-4 h-4 text-rose-400" />
                <span>Citizen First Governance</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} FixMyCity Portal. Built for Fullstack Engineering Lab demonstration. All civic data is simulated.
        </div>
      </div>
    </footer>
  );
};
