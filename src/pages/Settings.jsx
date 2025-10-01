
import React, { useState } from 'react';

const Settings = () => {
  const [username, setUsername] = useState('current_username');
  const [email, setEmail] = useState('current_email@example.com');
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    // Implement save logic here
    console.log('Settings saved!', { username, email, notifications });
  };

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg mx-auto">
        <div className="mb-6">
          <label htmlFor="username" className="block text-lg font-medium mb-2">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block text-lg font-medium mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Password</h2>
          <button className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600">
            Change Password
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-medium">Enable Notifications</span>
          <label htmlFor="notifications" className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                id="notifications"
                className="sr-only"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
              />
              <div className={`block w-14 h-8 rounded-full ${notifications ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${notifications ? 'transform translate-x-full' : ''}`}></div>
            </div>
          </label>
        </div>

        <button
          onClick={handleSave}
          className="w-full p-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
