import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Signup() {
  const [data, setData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const router = useNavigate(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await api.post("/auth/signup", {
        email: data.email,
        username: data.username,
        password: data.password,
      });
      toast.success(result.data.message || "Registered successfully!");
      router("/");
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Something went wrong!";
      toast.error(message);
    }
  };
  return (
    <div className="min-h-screen w-full bg-[#fafafa] flex flex-col items-center justify-center text-sm text-gray-900 px-4">
      <div className="w-full max-w-sm bg-white border border-gray-200 flex flex-col items-center py-8 mb-3">
        <form
          className="w-full px-8 flex flex-col gap-2"
          onSubmit={handleSubmit}
        >
          <div className="relative">
            <input
              type="email"
              required
              placeholder="Email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="peer w-full border border-gray-300 bg-gray-50 px-3 py-3 text-xs rounded focus:outline-none text-gray-900 focus:border-gray-400"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="Username"
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
              className="peer w-full border border-gray-300 bg-gray-50 px-3 py-3 text-xs rounded focus:outline-none text-gray-900 focus:border-gray-400"
            />
            {data.username.includes(" ") && (
              <p className="text-red-500">Remove spaces from your username</p>
            )}
          </div>
          <div className="relative">
            <input
              type="password"
              required
              placeholder="Password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="peer w-full border border-gray-300 bg-gray-50 px-3 py-3 text-xs rounded focus:outline-none text-gray-900 focus:border-gray-400"
            />
          </div>

          <button
            disabled={
              data.username.includes(" ") || !data.email || !data.password
            }
            className="mt-3 bg-[#0095f6] hover:bg-[#1877f2] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-1.5 rounded"
          >
            Sign Up
          </button>
        </form>
      </div>

      <div className="w-full max-w-sm bg-white border border-gray-200 text-center py-4">
        <p className="text-gray-600">
          Have an account?
          <a href="/auth/login" className="text-[#0095f6] font-semibold">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
