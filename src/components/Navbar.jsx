import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
// import { ThemeToggle } from "./ThemeToggle";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const checkAuth = (e) => {
    if (!user) {
      e.preventDefault();
      navigate("/login");
    }
    setMenuOpen(false);
  };

  const firstName = user?.user_metadata?.firstName || "";

  return (
    <nav className="flex items-center px-6 py-4 bg-[#254222] shadow-md relative dark:bg-gray-900">
      {/* Logo on left */}
      <div className="text-[#ca9836] font-extrabold text-xl">
        Population<em className="text-[#cae4c5] not-italic">Count</em>
      </div>

      {/* Page links (Desktop) */}
      <div className="hidden md:flex flex-1 justify-center items-center gap-6">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive
              ? "font-extrabold text-[#cae4c5]"
              : "text-[#ca9836] hover:text-[#cae4c5]"
          }
        >
          Home
        </NavLink>
        {/* States link */}
        <NavLink
          to="/states"
          end
          className={({ isActive }) =>
            isActive
              ? "font-extrabold text-[#cae4c5]"
              : "text-[#ca9836] hover:text-[#cae4c5]"
          }
          onClick={checkAuth}
        >
          States
        </NavLink>
        {/* Districts link */}
        <NavLink
          to="/districts"
          end
          className={({ isActive }) =>
            isActive
              ? "font-extrabold text-[#cae4c5]"
              : "text-[#ca9836] hover:text-[#cae4c5]"
          }
          onClick={checkAuth}
        >
          Districts
        </NavLink>
        {/* Register Person link */}
        <NavLink
          to="/register"
          end
          className={({ isActive }) =>
            isActive
              ? "font-extrabold text-[#cae4c5]"
              : "text-[#ca9836] hover:text-[#cae4c5]"
          }
          onClick={checkAuth}
        >
          Register Person
        </NavLink>

        {user && (
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              isActive
                ? "font-extrabold text-[#cae4c5]"
                : "text-[#ca9836] hover:text-[#cae4c5]"
            }
          >
            Dashboard
          </NavLink>
        )}

        {/* Admin only */}
        {user?.role === "admin" && (
          <NavLink
            to="/manage-users"
            end
            className={({ isActive }) =>
              isActive
                ? "font-extrabold text-[#cae4c5]"
                : "text-[#ca9836] hover:text-[#cae4c5]"
            }
          >
            Manage Users
          </NavLink>
        )}
      </div>

      {/* Right side: user dropdown */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-[#cae4c5] font-semibold hover:text-[#cae4c5]"
            >
              <User size={20} className="text-[#ca9836]" />
              <span>{firstName || "User"}</span>
              <ChevronDown size={16} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 z-50">
                <Link
                  to="/edit-profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setDropdownOpen(false)}
                >
                  Edit Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left text-red-600 font-bold"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <NavLink
              to="/login"
              className="px-4 py-2 bg-white dark:bg-gray-700 text-[#254222] dark:text-white border border-[#ca9836] rounded-md font-semibold hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              Sign In
            </NavLink>
            <NavLink
              to="/signup"
              className="px-4 py-2 bg-[#ca9836] text-white rounded-md font-semibold hover:bg-[#b78327]"
            >
              Sign Up
            </NavLink>
          </>
        )}
      </div>

      {/* Hamburger (mobile) */}
      <button
        className="md:hidden text-[#ca9836] focus:outline-none ml-auto"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={28} />
      </button>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#254222] dark:bg-gray-900 shadow-lg z-50 transform transition-transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="p-4 flex flex-col h-full">
          <button
            className="self-end text-[#ca9836] focus:outline-none"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={28} />
          </button>
          <div className="flex flex-col gap-4 mt-8">
            <NavLink
              to="/"
              className="text-[#ca9836] hover:text-[#cae4c5] font-semibold"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/states"
              className="text-[#ca9836] hover:text-[#cae4c5] font-semibold"
              onClick={checkAuth}
            >
              States
            </NavLink>
            <NavLink
              to="/districts"
              className="text-[#ca9836] hover:text-[#cae4c5] font-semibold"
              onClick={checkAuth}
            >
              Districts
            </NavLink>
            <NavLink
              to="/register"
              className="text-[#ca9836] hover:text-[#cae4c5] font-semibold"
              onClick={checkAuth}
            >
              Register Person
            </NavLink>
            {user && (
              <NavLink
                to="/dashboard"
                className="text-[#ca9836] hover:text-[#cae4c5] font-semibold"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </NavLink>
            )}
            {user?.role === "admin" && (
              <NavLink
                to="/manage-users"
                className="text-[#ca9836] hover:text-[#cae4c5] font-semibold"
                onClick={() => setMenuOpen(false)}
              >
                Manage Users
              </NavLink>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="w-full py-2 bg-red-600 text-white font-bold rounded-md mt-4"
              >
                Logout
              </button>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="w-full text-center py-2 bg-white dark:bg-gray-700 text-[#254222] dark:text-white border border-[#ca9836] rounded-md font-semibold"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/signup"
                  className="w-full text-center py-2 bg-[#ca9836] text-white rounded-md font-semibold hover:bg-[#b78327]"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

