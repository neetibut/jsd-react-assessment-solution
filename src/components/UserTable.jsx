import { useContext } from "react";
import { UsersContext } from "../context/UsersContext";

export function UserTable() {
  const { users } = useContext(UsersContext);
  return (
    <div>
      <table className="w-full border-separate">
        <thead>
          <tr className="bg-gray-200">
            <th className="border rounded-tl-lg p-2">Username</th>
            <th className="border p-2">Email</th>
            <th className="border p-2 rounded-tr-lg">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="bg-white">
              <td className="border p-2">{user.username}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
