import { useNavigate } from "react-router";
import { useState } from "react";
import { IoLogOut } from "react-icons/io5";
import { logout } from "../services/auth";
import image from "../assets/LOGOTEST.png";
import {useTheme} from "../context/theme/useTheme";
import { FaMoon } from "react-icons/fa";
import { GoSun } from "react-icons/go";

export default function NavBar() {
  const navigate = useNavigate();
  const [userName] = useState(() => {
    return localStorage.getItem("userName") || "";
  });

   const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="bg-secondary shadow-[0_4px_10px_rgba(0,0,0,0.20)] relative z-10">
      <div className="container mx-auto flex items-center justify-between h-16">
        <img
          src={image}
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer w-35"
        />
        <div className="flex items-center gap-3">
          <button 
        onClick={toggleTheme}
        className="bg-btn-primary text-primary-txt p-2 rounded text-2xl"
      >
        {theme === 'dark' ? (<GoSun />):(<FaMoon />)}
      </button>
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-orange-500">
            <span className="text-sm font-semibold text-white">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-primary-txt text-sm sm:block">{userName}</span>
          <button onClick={handleLogout} className="text-2xl cursor-pointer text-primary-txt">
            <IoLogOut />
          </button>
        </div>
      </div>
    </div>
  );
}
