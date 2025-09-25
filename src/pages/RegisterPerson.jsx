import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Pencil, Trash2 } from "lucide-react";

export function RegisterPerson() {
  const [persons, setPersons] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(7);
  const [totalCount, setTotalCount] = useState(0);

  const [form, setForm] = useState({
    id: null,
    full_name: "",
    gender: "",
    age: "",
    state_id: "",
    district_id: "",
  });

  async function fetchPersons() {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let { data, error, count } = await supabase
      .from("persons")
      .select(
        "id, full_name, gender, age, state_id, district_id, states(name), districts(name), created_at",
        { count: "exact" }
      )
      .order("id", { ascending: false })
      .range(from, to);

    if (!error) {
      setPersons(data || []);
      setTotalCount(count || 0);
    }
  }

  async function fetchStates() {
    let { data } = await supabase.from("states").select("*");
    setStates(data || []);
  }

  useEffect(() => {
    fetchPersons();
    fetchStates();
  }, [page]);

  useEffect(() => {
    if (selectedState) {
      async function fetchDistricts() {
        let { data } = await supabase
          .from("districts")
          .select("*")
          .eq("state_id", selectedState);
        setDistricts(data || []);
      }
      fetchDistricts();
    }
  }, [selectedState]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.id) {
      const { error } = await supabase
        .from("persons")
        .update({
          full_name: form.full_name,
          gender: form.gender,
          age: form.age,
          state_id: form.state_id,
          district_id: form.district_id,
        })
        .eq("id", form.id);
      if (error) alert("Error updating: " + error.message);
    } else {
      const { id, ...newForm } = form;
      const { error } = await supabase.from("persons").insert([newForm]);
      if (error) alert("Error saving: " + error.message);
    }

    setOpenModal(false);
    setForm({
      id: null,
      full_name: "",
      gender: "",
      age: "",
      state_id: "",
      district_id: "",
    });
    fetchPersons();
  }

  const handleEdit = (person) => {
    setForm({
      id: person.id,
      full_name: person.full_name,
      gender: person.gender,
      age: person.age,
      state_id: person.state_id || "",
      district_id: person.district_id || "",
    });
    setSelectedState(person.state_id || "");
    setOpenModal(true);
  };

  async function confirmDelete(id) {
    const { error } = await supabase.from("persons").delete().eq("id", id);
    if (error) alert("Error deleting: " + error.message);
    setDeleteConfirm(null);
    fetchPersons();
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-4 md:p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4 p-4 rounded-md shadow-md bg-[#254222]">
        <h2 className="text-xl text-[#ca9836] font-bold">Registred Persons</h2>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#254222] text-black"
          />
          <button
            onClick={() => {
              setForm({
                id: null,
                full_name: "",
                gender: "",
                age: "",
                state_id: "",
                district_id: "",
              });
              setOpenModal(true);
            }}
            className="bg-[#ca9836] hover:bg-[#b78327] text-white px-4 py-2 rounded w-full md:w-auto transition-colors duration-300"
          >
            + Add Person
          </button>
        </div>
      </div>

      {/* Table for large screens */}  
      <div className="hidden md:block overflow-x-auto bg-[#254222] rounded-lg shadow-md">
        <table className="min-w-[900px] w-full table-auto border-collapse border">
          <thead className="bg-[#cae4536]">
            <tr className="text-[#ca9836]">
              <th className="border px-3 py-2 text-left">No</th>
              <th className="border px-3 py-2 text-left">Full Name</th>
              <th className="border px-3 py-2 text-left">Gender</th>
              <th className="border px-3 py-2 text-left">Age</th>
              <th className="border px-3 py-2 text-left">State</th>
              <th className="border px-3 py-2 text-left">District</th>
              <th className="border px-3 py-2 text-left">Created At</th>
              <th className="border px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {persons
              .filter((p) =>
                p.full_name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((p, index) => (
                <tr
                  key={p.id}
                  className="bg-[#254222] text-[#cae4c5] hover:bg-gray-700 transition-colors duration-200"
                >
                  <td className="border p-2 text-center font-bold">
                    {(page - 1) * pageSize + index + 1}
                  </td>
                  <td className="border p-2">{p.full_name}</td>
                  <td className="border p-2">{p.gender}</td>
                  <td className="border p-2">{p.age}</td>
                  <td className="border p-2">{p.states?.name}</td>
                  <td className="border p-2">{p.districts?.name}</td>
                  <td className="border p-2">
                    {p.created_at
                      ? new Date(p.created_at).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="border p-2 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-gray-100"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(p.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/*table for mobile */}
      <div className="md:hidden flex flex-col gap-4">
        {persons
          .filter((p) =>
            p.full_name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((p, index) => (
            <div key={p.id} className="bg-[#254222] p-4 rounded-md shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-bold text-[#cae4c5] hover:text-gray-100">{p.full_name}</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-gray-100"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(p.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-[#cae4c5] hover:text-gray-100 text-sm">
                <div><span className="font-semibold">Gender:</span> {p.gender}</div>
                <div><span className="font-semibold">Age:</span> {p.age}</div>
                <div><span className="font-semibold">State:</span> {p.states?.name}</div>
                <div><span className="font-semibold">District:</span> {p.districts?.name}</div>
                <div className="col-span-2"><span className="font-semibold">Created:</span> {p.created_at ? new Date(p.created_at).toLocaleString() : "N/A"}</div>
              </div>
            </div>
          ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap justify-center items-center gap-4 mt-4 text-[#254222]">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Add/Edit Modal */}
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h3 className="text-lg font-bold mb-4 text-[#254222]">
              {form.id ? "Edit Person" : "Add Person"}
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={form.full_name}
                onChange={(e) =>
                  setForm({ ...form, full_name: e.target.value })
                }
                className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#ca9836] text-black"
                required
              />
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#ca9836] text-black"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <input
                type="number"
                placeholder="Age"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#ca9836] text-black"
                required
              />
              <select
                value={form.state_id}
                onChange={(e) => {
                  setForm({ ...form, state_id: e.target.value });
                  setSelectedState(e.target.value);
                }}
                className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#ca9836] text-black"
                required
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <select
                value={form.district_id}
                onChange={(e) =>
                  setForm({ ...form, district_id: e.target.value })
                }
                className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#ca9836] text-black"
                required
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ca9836] text-white rounded hover:bg-[#b78327] transition-colors duration-200"
                >
                  {form.id ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <p className="text-[#254222]">Ma hubtaa ina tirto xogtan?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

