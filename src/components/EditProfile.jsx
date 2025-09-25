import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const EditProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [first_name, setfirst_name] = useState("");

  useEffect(() => {
    if (user) {
      setfirst_name(user.first_name || "");
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!first_name) {
      alert("Magaca hore waa qasab.");
      return;
    }

    const result = await updateUserProfile({ first_name: first_name });

    if (result.success) {
      alert("Xogta waa la badbaadiyay.");
      navigate("/dashboard");
    } else {
      alert(result.message);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-900">
      <form onSubmit={handleSave} className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-center text-[#ca9836]">Edit Profile</h2>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-300">First Name</label>
          <input
            type="text"
            value={first_name}
            onChange={(e) => setfirst_name(e.target.value)}
            className="w-full px-4 py-2 text-gray-900 placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ca9836]"
            placeholder="Your first name"
          />
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 font-semibold text-gray-200 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 font-semibold text-white bg-[#ca9836] rounded-md hover:bg-[#b78327] transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
