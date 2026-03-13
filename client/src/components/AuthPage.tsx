import { useState } from "react";
import image from "../assets/brandon-kaida-2JwQoi-RBiI-unsplash.jpg";
import { useNavigate } from "react-router-dom";
import type { UserData } from "../types/userData";
import { login, register } from "../service-auth/auth";

export default function AuthPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

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
        navigate("/dashboard");
      } catch (error) {
        console.log(error, "Login error");
      }
    } else if (!isLogin) {
      try {
        await register({ name, email, password } as UserData);
        setName("");
        setEmail("");
        setPassword("");
      } catch (error) {
        console.log(error, "Cannot Register");
      }
    }
  };

  const visitLogin = () => {
    setIsLogin(true);
    navigate("/");
    // window.history.pushState({}, "", "/login")
  };

  const visitRegister = () => {
    setIsLogin(false);
    navigate("/signup");
    // window.history.pushState({}, "", "/signup")
  };

  return (
    <div className="flex h-screen">
      {/* Left side: Login form */}
      <div className="hidden lg:flex items-center justify-center flex-1 bg-white text-black">
        <div className=" flex flex-col items-center">
          <img
            src={image}
            alt="Landing Page"
            className="h-lvh w-lvw object-cover"
          />
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="w-full bg-white-100 lg:w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full px-6 py-8">
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
            <div>
              <label
                htmlFor="password"
                aria-label="Password"
                className="block text-sm font-medium text-gray-800"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                value={password}
                onChange={handleChange}
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
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
                  className="text-black hover:underline"
                >
                  Sign up here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  onClick={visitLogin}
                  className="text-black hover:underline"
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
