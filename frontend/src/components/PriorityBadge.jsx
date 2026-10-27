import React from "react";
import { AlertTriangle, AlertOctagon, Info, ShieldAlert } from "lucide-react";

export const PriorityBadge = ({ priority, className = "" }) => {
  switch (priority) {
    case "CRITICAL":
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300 ${className}`}
        >
          <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
          Critical
        </span>
      );
    case "HIGH":
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-300 ${className}`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-orange-600" />
          High
        </span>
      );
    case "MEDIUM":
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 ${className}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          Medium
        </span>
      );
    case "LOW":
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-medium uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-300 ${className}`}
        >
          <Info className="w-3.5 h-3.5 text-slate-500" />
          Low
        </span>
      );
    default:
      return (
        <span className={`px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700 ${className}`}>
          {priority}
        </span>
      );
  }
};
