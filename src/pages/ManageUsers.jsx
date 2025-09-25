import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

export const ManageUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      let { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, email, role, created_at");
      if (!error) setUsers(data);
    };
    fetchUsers();
  }, []);

  const updateRole = async (id, role) => {
    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", id);
    if (error) alert("Error updating role: " + error.message);
    else {
      setUsers(users.map((u) => (u.id === id ? { ...u, role } : u)));
    }
  };

  if (!user) return <p className="p-4">Please log in.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#ca9836] mb-4">Manage Users</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead className="bg-[#254222] text-[#ca9836] text-left">
            <tr>
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">Email</th>
              <th className="border px-3 py-2">Role</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="text-[#ca9836]">
                <td className="border px-3 py-2">{u.first_name}</td>
                <td className="border px-3 py-2">{u.email}</td>
                <td className="border px-3 py-2">{u.role}</td>
                <td className="border px-3 py-2">
                  <select
                    value={u.role}
                    onChange={(e) => updateRole(u.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

