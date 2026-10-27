import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AppProvider } from "./context/AppContext.jsx";

// Components
import { Navbar } from "./components/Navbar.jsx";
import { Footer } from "./components/Footer.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";

// Pages
import { Home } from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { IssuesList } from "./pages/IssuesList.jsx";
import { IssueDetails } from "./pages/IssueDetails.jsx";
import { ReportIssue } from "./pages/ReportIssue.jsx";
import { Watchlist } from "./pages/Watchlist.jsx";
import { GrievanceForm } from "./pages/GrievanceForm.jsx";
import { MyGrievances } from "./pages/MyGrievances.jsx";
import { GrievanceDetails } from "./pages/GrievanceDetails.jsx";
import { Profile } from "./pages/Profile.jsx";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/issues" element={<IssuesList />} />
                <Route path="/issues/:id" element={<IssueDetails />} />

                {/* Protected Routes */}
                <Route
                  path="/report"
                  element={
                    <ProtectedRoute>
                      <ReportIssue />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/watchlist"
                  element={
                    <ProtectedRoute>
                      <Watchlist />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/escalate/:issueId"
                  element={
                    <ProtectedRoute>
                      <GrievanceForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-grievances"
                  element={
                    <ProtectedRoute>
                      <MyGrievances />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/grievances/:id"
                  element={
                    <ProtectedRoute>
                      <GrievanceDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
