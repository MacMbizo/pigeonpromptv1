import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import PromptIDE from "@/pages/PromptIDE";
import PromptHub from "@/pages/PromptHub";
import PromptFlow from "@/pages/PromptFlow";
import Settings from "@/pages/Settings";
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
            <Route path="hub" element={<PromptHub />} />
            <Route path="flow" element={<PromptFlow />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-right" richColors />
    </>
  );
}
