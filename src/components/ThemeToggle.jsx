import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
    >
      {theme === "light" ? (
        <Moon size={20} className="text-[#ca9836]" />
      ) : (
        <Sun size={20} className="text-yellow-400" />
      )}
    </button>
  );
};