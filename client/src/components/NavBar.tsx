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
    <div className="flex p-3 justify-between bg-white-100 shadow-xl">
      <div className="ml-26 items-center flex">
        <h1 onClick={() => navigate("/dashboard")} className="cursor-pointer">
          TravelCrew
        </h1>
      </div>
      <div className="flex gap-2 items-center mr-25">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center bg-emerald-700 ">
          <span className="text-sm font-body font-semibold text-primary text-white">
            {userName.charAt(0)}
          </span>
        </div>
        <span className="text-sm font-body text-foreground hidden sm:block">
          {userName}
        </span>
        <button onClick={handleLogout} className="cursor-pointer text-2xl">
          <IoLogOut />
        </button>
      </div>
    </div>
  );
}
