import { Navbar } from "./components/Navbar";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="bg-[#cae4c5] text-black dark:bg-gray-900 dark:text-white min-h-screen">
      <Navbar />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
