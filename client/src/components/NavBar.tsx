import { useNavigate } from "react-router";
import { useState } from "react";
import { IoLogOut } from "react-icons/io5";
import { logout } from "../services/auth";

export default function NavBar() {
  const navigate = useNavigate();
  const [userName] = useState(() => {
    return localStorage.getItem("userName") || "";
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="bg-white shadow-xl">
      <div className="container mx-auto px-1 flex items-center justify-between h-16">
        <h1
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer font-bold text-lg"
        >
          TravelCrew
        </h1>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-orange-500">
            <span className="text-sm font-semibold text-white">
              {userName.charAt(0)}
            </span>
          </div>
          <span className="text-sm hidden sm:block">{userName}</span>
          <button onClick={handleLogout} className="text-2xl cursor-pointer">
            <IoLogOut />
          </button>
        </div>
      </div>
    </div>
  );
}
