import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // validations
    if (!firstName || !email || !password) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // create user with Supabase
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          firstName: firstName,
          role: "user",
        },
      },
    });

    if (signupError) {
      setError(signupError.message);
      return;
    }

    if (data.user) {
      setSuccess("You're sucessfully signup...");

      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error("Logout error:", signOutError.message);
      }

      setTimeout(() => {
        //setSuccess(null);
        if (!error) {
          navigate("/login");
        }
      }, 1000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <form
        onSubmit={handleSignup}
        className="bg-[#254222] p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl text-[#ca9836] font-bold mb-4 text-center">
          Signup
        </h2>

        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}

        <input
          type="text"
          placeholder="firstName"
          className="w-full p-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#ca9836] text-black"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-[#ca9836] text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="password"
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-[#ca9836] text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full py-2 bg-[#ca9836] text-white font-bold rounded hover:bg-[#b78327] transition"
        >
          Signup
        </button>


        <p className="mt-4 text-center text-sm text-[#cae4c5]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#ca9836] font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
      </form>

      {/* Success Card */}
      {success && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 p-4 text-[#ca9836] bg-white rounded-md shadow-lg z-50 animate-fade-in-down">
          <p className="font-semibold">{success}</p>
        </div>
      )}
    </div>
  );
};
