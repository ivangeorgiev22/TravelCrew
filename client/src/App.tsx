import "./App.css";
import AuthPage from "./components/AuthPage";
import TripDetailsPage from "./components/TripDetailsPage";
import { Routes, Route } from "react-router";
import Dashboard from "./components/Dashboard";
import AcceptInvite from "./components/AcceptInvite";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/trips/:id" element={<TripDetailsPage />} />
      <Route path="/accept-invite" element={<AcceptInvite />} />
    </Routes>
    
  );
}
