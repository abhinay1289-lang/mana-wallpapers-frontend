import { useState } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Buyer User', email: 'buyer.wallpaper@gmail.com', role: 'BUYER' },
    { id: 2, name: 'John Doe', email: 'john.doe@example.com', role: 'BUYER' },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-900">
              <th className="p-4 font-bold">Name</th>
              <th className="p-4 font-bold">Email</th>
              <th className="p-4 font-bold">Role</th>
              <th className="p-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-gray-700">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded-full text-sm ${user.role === 'ADMIN' ? 'bg-green-600' : 'bg-blue-600'}`}>{user.role}</span></td>
                <td className="p-4">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded-lg mr-2">Edit</button>
                  <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
