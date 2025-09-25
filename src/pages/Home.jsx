import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // handle Dashboard navigation
  const handleDashboardClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  // handle Register navigation
  const handleregisterNavigation = () => {
    if (user) {
      navigate("/register");
    } else {
      navigate("/login");
    }
  };

  // handle Districts navigation
  const handleDistrictsNavigation = () => {
    if (user) {
      navigate("/districts");
    } else {
      navigate("/login");
    }
  };

  // handle States navigation
  const handleStatesNavigation = () => {
    if (user) {
      navigate("/states");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-[#254222] text-white py-16 px-6 text-center rounded-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#ca9836] mb-4">
          Population<em className="text-[#cae4c5] not-italic">Count</em>
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl mb-6 text-[#cae4c5]">
          Track and manage states, districts, and population data easily.
        </p>
        <button
          onClick={handleDashboardClick}
          className="bg-[#ca9836] hover:bg-[#b78327] text-white px-6 py-3 rounded-lg font-semibold shadow-lg"
        >
          Get Started
        </button>
      </section>

      {/* Navigation Cards */}
      <section className="py-12 px-6 flex-grow">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* State card */}
          <button
            onClick={handleStatesNavigation}
            className="bg-white border border-[#ca9836] rounded-xl shadow-md p-6 text-center hover:bg-gray-100 cursor-pointer"
          >
            <h2 className="text-xl font-bold mb-2 text-[#254222]">States</h2>
            <p className="text-sm text-gray-600">View and manage states</p>
          </button>

          {/*Districts card */}
          <button
            onClick={handleDistrictsNavigation}
            className="bg-white border border-[#ca9836] rounded-xl shadow-md p-6 text-center hover:bg-gray-100 cursor-pointer"
          >
            <h2 className="text-xl font-bold mb-2 text-[#254222]">Districts</h2>
            <p className="text-sm text-gray-600">View and manage districts</p>
          </button>

          {/* Register card */}
          <button
            onClick={handleregisterNavigation}
            className="bg-white border border-[#ca9836] rounded-xl shadow-md p-6 text-center hover:bg-gray-100 cursor-pointer"
          >
            <h2 className="text-xl font-bold mb-2 text-[#254222]">Register</h2>
            <p className="text-sm text-gray-600">Register a new person</p>
          </button>

          {/* Dashboard card */}
          <button
            onClick={handleDashboardClick}
            className="bg-white border border-[#ca9836] rounded-xl shadow-md p-6 text-center hover:bg-gray-100 cursor-pointer"
          >
            <h2 className="text-xl font-bold mb-2 text-[#254222]">Dashboard</h2>
            <p className="text-sm text-gray-600">Go to your dashboard</p>
          </button>
        </div>
      </section>
    </div>
  );
};
