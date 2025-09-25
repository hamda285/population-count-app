import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient.js";

export const States = () => {
  const [states, setStates] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState(null); 

  // search & pagination
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    fetchStates();
  }, []);

  async function fetchStates() {
    let { data, error } = await supabase.from("states").select("*");
    if (error) console.error(error);
    else setStates(data);
  }

  async function addState() {
    if (!name) {
      setError("Enter state name");
      setTimeout(() => setError(null), 3000); 
      return;
    }
    const { error: supabaseError } = await supabase.from("states").insert([{ name }]);
    if (supabaseError) {
      console.error(supabaseError);
      setError("Error adding state: " + supabaseError.message);
      setTimeout(() => setError(null), 3000);
    } else {
      setName("");
      fetchStates();
    }
  }

  // filter & paginate states
  const filteredStates = states.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStates.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedStates = filteredStates.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#254222] mb-4">States</h1>

      {/* Add state form */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4 p-4 rounded-md shadow-md bg-[#254222]">
        <input
          className="border p-2 flex-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ca9836] text-black"
          placeholder="Enter state name text-black"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="bg-[#ca9836] hover:bg-[#b78327] text-white px-4 py-2 rounded-md transition-colors duration-200"
          onClick={addState}
        >
          + Add State
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <input
          className="p-2 w-full md:max-w-md rounded-md bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-[#254222] text-black"
          placeholder="Search states..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto border bg-[#254222] rounded-lg max-h-[500px] overflow-y-auto">
        <table className="w-full border-collapse text-[#254222]">
          <thead className="bg-[#254222] text-[#ca9836] sticky top-0">
            <tr>
              <th className="border px-3 py-2 font-bold">No</th>
              <th className="border px-3 py-2 font-bold text-left">State Name</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStates.length === 0 ? (
              <tr>
                <td colSpan="2" className="text-center py-4 text-gray-500">
                  No states found
                </td>
              </tr>
            ) : (
              paginatedStates.map((state, index) => (
                <tr
                  key={state.id}
                  className="text-[#cae4c5] hover:bg-gray-700 transition-colors duration-200"
                >
                  <td className="border px-3 py-2 text-center font-bold">
                    {startIndex + index + 1}
                  </td>
                  <td className="border px-3 py-2 text-left">{state.name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center items-center gap-2 mt-4 text-[#254222]">
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
          onClick={() =>
            setCurrentPage((p) => Math.min(p + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Error Card */}
      {error && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 p-4 bg-red-500 text-white rounded-md shadow-lg z-50 animate-fade-in-down">
          <p className="font-semibold">{error}</p>
        </div>
      )}
    </div>
  );
};