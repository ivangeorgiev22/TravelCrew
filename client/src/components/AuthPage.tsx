import { useState } from "react";
import image from "../assets/59AA7420-4989-4BBF-8598-C771D4F17FFC.jpg";
import { useNavigate, useLocation } from "react-router-dom";
import type { UserData } from "../types/userData";
import { login, register } from "../services/auth";
import logo from "../assets/logoDesign.png";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";

export default function AuthPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.state?.from || "/dashboard"; // Get the intended destination after login

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "name") setName(e.target.value);
    if (e.target.name === "email") setEmail(e.target.value);
    if (e.target.name === "password") setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    // handle login or register
    if (isLogin) {
      try {
        await login({ email, password } as UserData);
        setEmail("");
        setPassword("");
        navigate(path); // Redirect to intended destination (dashboard or trip details page)
      } catch (error) {
        console.log(error, "Login error");
      }
    } else if (!isLogin) {
      try {
        await register({ name, email, password } as UserData);
        setName("");
        setEmail("");
        setPassword("");
        setIsLogin(true);
      } catch (error) {
        console.log(error, "Cannot Register");
      }
    }
  };

  const visitLogin = () => {
    setIsLogin(true);
  };

  const visitRegister = () => {
    setIsLogin(false);
  };

  return (
    <div className="flex h-screen">
      {/* Left side: Login form */}
      <div className="hidden lg:flex items-center justify-center flex-1 bg-white text-black">
        <div className=" flex flex-col items-center">
          <img
            src={image}
            alt="Landing Page"
            className="h-lvh w-lvw object-[25%_40%] object-cover"
          />
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="w-full bg-mist-100 lg:w-1/2 flex flex-col items-center justify-center ">
        <div className="flex justify-start w-105">
          <img
            src={logo}
            alt="Logo"
            className="w-37"
            onClick={() => navigate("/")}
          />
        </div>
        <div className="max-w-md w-full px-6 py-2">
          <h1 className="text-3xl font-semibold mb-1 text-black">
            {isLogin ? "Welcome back" : "Create an account"}
          </h1>
          <h1 className="text-1lg mb-5 text-gray-600">
            {isLogin
              ? "Sign in to keep planning your next adventure"
              : "Sign up to start planning your next adventure"}
          </h1>
          <form
            action="#"
            method="POST"
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  aria-label="Name"
                  className="block text-sm font-medium text-gray-800"
                >
                  Name
                </label>
                <input
                  type="name"
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                  value={name}
                  onChange={handleChange}
                />
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                aria-label="Email"
                className="block text-sm font-medium text-gray-800"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="this@example.com"
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                value={email}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                aria-label="Password"
                className="block text-sm font-medium text-gray-800"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="••••••••"
                className="mt-1 p-2 pr-10 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                value={password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-11 -translate-y-1/2 text-gray-500 text-xl cursor-pointer"
              >
                {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
              </button>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
              >
                {isLogin ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </form>
          <div className="mt-4 text-sm text-gray-600 text-center">
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <button
                  onClick={visitRegister}
                  className="text-black hover:underline cursor-pointer"
                >
                  Sign up here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  onClick={visitLogin}
                  className="text-black hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
