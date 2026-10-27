import React from "react";
import { Clock, CheckCircle2, AlertCircle, Wrench } from "lucide-react";

export const StatusBadge = ({ status, className = "" }) => {
  switch (status) {
    case "REPORTED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 ${className}`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          Reported
        </span>
      );
    case "ACKNOWLEDGED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 ${className}`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-blue-500" />
          Acknowledged
        </span>
      );
    case "IN_PROGRESS":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 ${className}`}
        >
          <Wrench className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
          In Progress
        </span>
      );
    case "RESOLVED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          Resolved
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 ${className}`}
        >
          {status}
        </span>
      );
  }
};
