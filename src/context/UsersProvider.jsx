import { useState } from "react";
import { UsersContext } from "./UsersContext";
import axios from "axios";

export function UsersProvider({ children }) {
  // const API = "https://67eca027aa794fb3222e43e2.mockapi.io/members";
  const API = "http://localhost:3000/api/v2/users";

  const [view, setView] = useState(null);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API);
      setUsers(res.data.data);
    } catch {
      alert("Failed to fetch users");
    }
  };

  const [form, setForm] = useState({
    name: "",
    lastname: "",
    position: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API, form);
      await fetchUsers();
      // Reset the form
      setForm({
        name: "",
        lastname: "",
        position: "",
      });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await axios.delete(`${API}/${id}`);
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <UsersContext.Provider
      value={{
        view,
        setView,
        users,
        fetchUsers,
        form,
        handleChange,
        handleSubmit,
        handleDelete,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}
