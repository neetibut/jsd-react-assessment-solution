import axios from "axios";
import { useState } from "react";

export function AdminTable({ users, setUsers, fetchUsers, API }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "",
    password: "",
  });

  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    role: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API, form, { withCredentials: true });
      await fetchUsers();
      // Reset the form
      setForm({
        username: "",
        email: "",
        role: "",
        password: "",
      });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await axios.delete(`${API}/${id}`, { withCredentials: true });
    setUsers(users.filter((user) => user._id !== id));
  };

  const handleEdit = (user) => {
    setEditId(user._id);
    setEditForm({
      username: user.username,
      email: user.email,
      role: user.role,
    });
  };

  const handleEditSave = async (id) => {
    try {
      await axios.patch(`${API}/${id}`, editForm, { withCredentials: true });
      await fetchUsers();
      setEditId(null);
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
  };

  return (
    <div className="flex flex-col items-center">
      <form onSubmit={handleSubmit} className="pb-3">
        <input
          onChange={handleChange}
          value={form.username}
          name="username"
          className="bg-white mx-1 w-32 px-2 rounded border"
          placeholder="Username"
        />
        <input
          onChange={handleChange}
          value={form.email}
          name="email"
          className="bg-white mx-1 w-32 px-2 rounded border"
          placeholder="Email"
        />
        <input
          onChange={handleChange}
          value={form.role}
          name="role"
          className="bg-white mx-1 w-32 px-2 rounded border"
          placeholder="Role"
        />
        <input
          onChange={handleChange}
          value={form.password}
          name="password"
          className="bg-white mx-1 w-32 px-2 rounded border"
          placeholder="Password"
        />
        <button
          type="submit"
          className="cursor-pointer bg-sky-500 hover:bg-sky-600 text-white px-3 py-2 mx-1 rounded-4xl"
        >
          Save new user
        </button>
      </form>
      <table className="w-full border-separate">
        <thead>
          <tr className="text-center font-bold bg-gray-200">
            <th className="border rounded-tl-lg p-2">Username</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border rounded-tr-lg p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="bg-white">
              {editId === user._id ? (
                <>
                  <td className="border p-2 ">
                    <input
                      value={editForm.username}
                      onChange={handleEditChange}
                      name="username"
                      className="bg-white w-24 px-2 rounded border"
                    />
                  </td>
                  <td className="border p-2 ">
                    <input
                      value={editForm.email}
                      onChange={handleEditChange}
                      name="email"
                      className="bg-white w-24 px-2 rounded border"
                    />
                  </td>
                  <td className="border p-2 ">
                    <input
                      value={editForm.role}
                      onChange={handleEditChange}
                      name="role"
                      className="bg-white w-24 px-2 rounded border"
                    />
                  </td>
                  <td className="border p-2 ">
                    <button
                      onClick={() => handleEditSave(user._id)}
                      className="cursor-pointer bg-teal-400 hover:bg-teal-500 text-white px-2 rounded-xl"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="cursor-pointer bg-gray-400 hover:bg-gray-500 text-white px-2 rounded-xl"
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="border p-2 ">{user.username}</td>
                  <td className="border p-2 ">{user.email}</td>
                  <td className="border p-2 ">{user.role}</td>
                  <td className="border p-2 flex gap-4">
                    <button
                      onClick={() => handleEdit(user)}
                      className="cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-white px-2 rounded-xl"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="cursor-pointer bg-rose-400 hover:bg-rose-500 text-white px-2 rounded-xl"
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
