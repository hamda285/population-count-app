import { useEffect, useState } from "react"; 
import { supabase } from "../supabaseClient";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

// Register charts
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const Dashboard = () => {
  const [totals, setTotals] = useState({
    all: 0,
    males: 0,
    females: 0,
    children: 0,
  });

  const [recent, setRecent] = useState([]);
  const [regionTotals, setRegionTotals] = useState([]); 

  useEffect(() => {
    fetchTotals();
    fetchRecent();
    fetchRegionTotals();
  }, []);

  // -------- Totals --------
  async function fetchTotals() {
    let { count: all } = await supabase
      .from("persons")
      .select("*", { count: "exact", head: true });

    let { count: males } = await supabase
      .from("persons")
      .select("*", { count: "exact", head: true })
      .eq("gender", "male");

    let { count: females } = await supabase
      .from("persons")
      .select("*", { count: "exact", head: true })
      .eq("gender", "female");

    let { count: children } = await supabase
      .from("persons")
      .select("*", { count: "exact", head: true })
      .lt("age", 15);

    setTotals({
      all: all || 0,
      males: males || 0,
      females: females || 0,
      children: children || 0,
    });
  }

  // -------- Region Totals --------
  async function fetchRegionTotals() {
    const { data, error } = await supabase
      .from("persons")
      .select("states(name)");

    if (error) {
      console.error(error);
      return;
    }

    const counts = {};
    data.forEach((p) => {
      const state = p.states?.name || "Unknown";
      counts[state] = (counts[state] || 0) + 1;
    });

    setRegionTotals(Object.entries(counts));
  }

  // -------- Recent Registered --------
  async function fetchRecent() {
    let { data, error } = await supabase
      .from("persons")
      .select(
        "id, full_name, gender, age, states(name), districts(name), created_at"
      )
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error && data) {
      setRecent(data);
    } else {
      console.error(error);
    }
  }

  // -------- Chart Data --------
  const regionBarData = {
    labels: regionTotals.map(([state]) => state),
    datasets: [
      {
        label: "People per State",
        data: regionTotals.map(([_, count]) => count),
        backgroundColor: ["#ca9836", "#cae4c5", "#254222", "#99cc66"],
      },
    ],
  };

  const doughnutData = {
    labels: ["All People", "Males", "Females", "Children"],
    datasets: [
      {
        label: "Population Distribution",
        data: [totals.all, totals.males, totals.females, totals.children],
        backgroundColor: ["#99cc66", "#ca9836", "#254222", "#cae4c5"],
      },
    ],
  };

  // -------- Chart Options --------
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Totals Cards */}
      <h1 className="text-3xl font-bold text-[#ca9836] mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#254222] text-[#ca9836] p-4 rounded-lg shadow">
          <h2 className="text-lg">All People</h2>
          <p className="text-2xl font-bold">{totals.all}</p>
        </div>
        <div className="bg-[#254222] text-[#ca9836] p-4 rounded-lg shadow">
          <h2 className="text-lg">Males</h2>
          <p className="text-2xl font-bold">{totals.males}</p>
        </div>
        <div className="bg-[#254222] text-[#ca9836] p-4 rounded-lg shadow">
          <h2 className="text-lg">Females</h2>
          <p className="text-2xl font-bold">{totals.females}</p>
        </div>
        <div className="bg-[#254222] text-[#ca9836] p-4 rounded-lg shadow">
          <h2 className="text-lg">Children</h2>
          <p className="text-2xl font-bold">{totals.children}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
        <div className="bg-gray-100 shadow-md rounded-lg p-12 h-[400px]">
          <h2 className="text-lg font-bold text-[#254222] mb-4">
            Population by State
          </h2>
          <Bar key={JSON.stringify(regionBarData)} data={regionBarData} options={chartOptions} />
        </div>

        <div className="bg-gray-100 shadow-md rounded-xl p-10 h-[400px]">
          <h2 className="text-lg font-bold text-[#254222] mb-4">
            Population Distribution
          </h2>
          <Doughnut key={JSON.stringify(doughnutData)} data={doughnutData} options={chartOptions} />
        </div>

      </div>

      {/* Recently Registered */}
      <div className="bg-gray-100 rounded-lg shadow-md p-2">
        <h2 className="text-lg font-bold text-[#254222] mb-4">
          Recently Registered
        </h2>
        <ul className="divide-y divide-gray-200">
          {recent.map((p) => (
            <li key={p.id} className="py-3">
              <div className="font-medium text-[#254222]">{p.full_name}</div>
              <div className="text-sm text-gray-600">
                {p.gender}, {p.age} yrs — {p.states?.name}, {p.districts?.name}
              </div>
              <div className="text-xs text-gray-400">
                {new Date(p.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
