import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useApp } from "../context/AppContext.jsx";
import {
  Building2,
  Bookmark,
  PlusCircle,
  FileText,
  LogOut,
  User,
  Menu,
  X,
  Compass,
} from "lucide-react";

export const Navbar = () => {
  const { citizen, isAuthenticated, logout } = useAuth();
  const { watchlistCount } = useApp();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Fix<span className="text-blue-600">MyCity</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                Civic Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/issues" className={navLinkClass}>
              <Compass className="w-4 h-4" />
              Civic Issues
            </NavLink>
            <NavLink to="/report" className={navLinkClass}>
              <PlusCircle className="w-4 h-4 text-blue-600" />
              Report Issue
            </NavLink>
            <NavLink to="/watchlist" className={navLinkClass}>
              <Bookmark className="w-4 h-4 text-rose-500" />
              Watchlist
              {watchlistCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full">
                  {watchlistCount}
                </span>
              )}
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/my-grievances" className={navLinkClass}>
                <FileText className="w-4 h-4 text-emerald-600" />
                My Grievances
              </NavLink>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-sm font-medium text-slate-700"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    {citizen?.fullName ? citizen.fullName.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="max-w-[120px] truncate">{citizen?.fullName?.split(" ")[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            to="/issues"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:bg-slate-100"
          >
            Civic Issues
          </Link>
          <Link
            to="/report"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:bg-slate-100"
          >
            Report Issue
          </Link>
          <Link
            to="/watchlist"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:bg-slate-100"
          >
            <span>Watchlist</span>
            {watchlistCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-rose-500 text-white rounded-full">
                {watchlistCount}
              </span>
            )}
          </Link>
          {isAuthenticated && (
            <Link
              to="/my-grievances"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-semibold text-slate-700 hover:bg-slate-100"
            >
              My Grievances
            </Link>
          )}

          <div className="pt-4 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 font-medium"
                >
                  <User className="w-4 h-4 text-blue-600" />
                  Profile ({citizen?.fullName})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 text-rose-600 font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-slate-700 font-semibold border border-slate-300 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-white bg-blue-600 font-semibold rounded-lg"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
