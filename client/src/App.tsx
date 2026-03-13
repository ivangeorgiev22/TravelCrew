import "./App.css";
import AuthPage from "./components/AuthPage";
import TripDetailsPage from "./components/TripDetailsPage"
import { BrowserRouter, Routes, Route } from "react-router";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/trip/:id" element={<TripDetails />}/> */}
        {/* <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trip/:id" element={<TripDetails />}/> */}
        <Route path="/tripdetails" element={<TripDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
