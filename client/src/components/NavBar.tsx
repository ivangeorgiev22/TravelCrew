import { useNavigate } from "react-router"
import { useState } from "react";
import { IoLogOut } from "react-icons/io5";

export default function NavBar () {
const navigate = useNavigate();
const [userName] = useState(() => {
  return localStorage.getItem("userName") || "";
});

return (
  <div className="bg-orange-500 flex p-3 justify-between">
    <div>
      <h1 onClick={() => navigate('/dashboard')} className="cursor-pointer">TravelCrew</h1>
    </div>
    <div className="flex gap-2 items-center">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center bg-white ">
        <span className="text-sm font-body font-semibold text-primary">
          {userName.charAt(0)}  
        </span>
      </div>
      <span className="text-sm font-body text-foreground hidden sm:block">{userName}</span>
      <button onClick={() => navigate('/')} className="cursor-pointer text-2xl"><IoLogOut /></button>
    </div>
  </div>
)
}