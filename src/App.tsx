import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import PromptIDE from "@/pages/PromptIDE";
import CommunityHub from "@/pages/CommunityHub";
import PromptFlow from "@/pages/PromptFlow";
import Settings from "@/pages/Settings";
import AdvancedAnalytics from "@/components/AdvancedAnalytics";
import APIManagement from "@/components/APIManagement";
import UserManagement from "@/components/UserManagement";
import Billing from "@/components/Billing";
import Login from "@/pages/Login";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="ide" element={<PromptIDE />} />
              <Route path="hub" element={<CommunityHub />} />
              <Route path="flow" element={<PromptFlow />} />
              <Route path="analytics" element={<AdvancedAnalytics />} />
              <Route path="api" element={<APIManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="billing" element={<Billing />} />
              <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
      </Router>
      <Toaster position="top-right" richColors />
    </>
  );
}
