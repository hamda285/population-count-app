import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export const Districts = () => {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [districtName, setDistrictName] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 

  // search & pagination
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchStates();
    fetchDistricts();
  }, []);

  async function fetchStates() {
    let { data, error } = await supabase.from("states").select("*");
    if (error) console.error(error);
    else setStates(data);
  }

  async function fetchDistricts() {
    setLoading(true);
    let { data, error } = await supabase
      .from("districts")
      .select("*, state:state_id(name)")
      .order("id", { ascending: true });

    if (error) console.error(error);
    else setDistricts(data);
    setLoading(false);
  }

  async function addDistrict() {
    if (!districtName || !selectedState) {
      setError("Select a state and enter a district name.");
      setTimeout(() => setError(null), 3000); 
      return;
    }

    const { error: supabaseError } = await supabase
      .from("districts")
      .insert([{ name: districtName, state_id: selectedState }]);

    if (supabaseError) {
      console.error(supabaseError);
      setError("Error adding district: " + supabaseError.message);
      setTimeout(() => setError(null), 3000);
    } else {
      setDistrictName("");
      setSelectedState("");
      fetchDistricts();
    }
  }

  // filter districts by search
  const filteredDistricts = districts.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  // pagination
  const totalPages = Math.ceil(filteredDistricts.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedDistricts = filteredDistricts.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-[#254222] mb-4">Districts</h1>

      {/* Add form */}
      <div className="flex flex-col md:flex-row gap-2 mb-4 p-4 rounded-md shadow-md bg-[#254222]">
        <select
          className="border p-2 flex-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ca9836] text-black"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state.id} value={state.id}>
              {state.name}
            </option>
          ))}
        </select>

        <input
          className="border p-2 flex-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ca9836] text-black"
          placeholder="Enter district name"
          value={districtName}
          onChange={(e) => setDistrictName(e.target.value)}
        />

        <button
          className="bg-[#ca9836] hover:bg-[#b78327] text-white px-4 py-2 rounded-md transition-colors duration-200"
          onClick={addDistrict}
        >
          + Add district
        </button>
      </div>

      {/* Search box */}
      <input
        className="p-2 mb-4 w-full md:max-w-md rounded-md border focus:outline-none focus:ring-2 focus:ring-[#254222] text-black"
        placeholder="Search district..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-md max-h-[500px] overflow-y-auto border shadow-md">
            <table className="w-full border-collapse rounded-lg">
              <thead className="bg-[#254222] text-[#ca9836] font-bold sticky top-0">
                <tr className="font-bold">
                  <th className="border px-3 py-2 text-center">No.</th>
                  <th className="border px-3 py-2 text-left">District</th>
                  <th className="border px-3 py-2 text-left">State</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDistricts.length === 0 ? (
                  <tr className="text-[#cae4c5] hover:text-gray-100">
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      No districts found
                    </td>
                  </tr>
                ) : (
                  paginatedDistricts.map((v, index) => (
                    <tr
                      key={v.id}
                      className="bg-[#254222] text-[#cae4c5] hover:bg-gray-700 transition-colors duration-200"
                    >
                      <td className="border px-3 py-2 text-center font-bold">
                        {startIndex + index + 1}
                      </td>
                      <td className="border px-3 py-2 text-left">{v.name}</td>
                      <td className="border px-3 py-2 text-left">
                        {v.state?.name}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
            <button
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Error Card */}
      {error && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 p-4 bg-red-500 text-white rounded-md shadow-lg z-50 animate-fade-in-down">
          <p className="font-semibold">{error}</p>
        </div>
      )}
    </div>
  );
};