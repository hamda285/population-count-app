import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Invalid credentials. Please try again.");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {" "}
      <form
        onSubmit={handleLogin}
        className="bg-[#254222] p-6 rounded shadow-md w-100 h-55"
      >
        {error && <p className="text-red-500 mb-2">{error}</p>}{" "}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />{" "}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-3 text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />{" "}
        <button
          type="submit"
          className="w-full bg-[#ca9836] text-white font-bold py-2 rounded hover:bg-[#b78327]"
        >
          Login{" "}
        </button>
        <p className="mt-4 text-center text-sm text-[#cae4c5]">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#ca9836] font-semibold hover:underline"
          >
            Signup here
          </Link>
        </p>
      </form>
    </div>
  );
};
