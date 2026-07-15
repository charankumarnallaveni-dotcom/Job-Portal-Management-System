import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ManageUsers } from "./pages/admin/ManageUsers";
import { RecruiterDashboard } from "./pages/recruiter/RecruiterDashboard";
import { ApplicationsPipeline } from "./pages/recruiter/ApplicationsPipeline";
import { CandidateDashboard } from "./pages/candidate/CandidateDashboard";
import { MyApplications } from "./pages/candidate/MyApplications";
import { Jobs } from "./pages/Jobs";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
          </Route>
          <Route element={<ProtectedRoute roles={["recruiter"]} />}>
            <Route path="/recruiter" element={<RecruiterDashboard />} />
            <Route path="/recruiter/applications" element={<ApplicationsPipeline />} />
          </Route>
          <Route element={<ProtectedRoute roles={["candidate"]} />}>
            <Route path="/candidate" element={<CandidateDashboard />} />
            <Route path="/candidate/applications" element={<MyApplications />} />
            <Route path="/jobs" element={<Jobs />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
