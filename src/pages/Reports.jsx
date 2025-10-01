
import React from 'react';

const Reports = () => {
  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Reports & Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Downloads Report */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Downloads</h2>
          <div className="text-4xl font-bold">12,345</div>
          <p className="text-gray-400">Total downloads this month</p>
        </div>

        {/* Revenue Report */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Revenue</h2>
          <div className="text-4xl font-bold">$9,876</div>
          <p className="text-gray-400">Total revenue this month</p>
        </div>

        {/* User Growth Report */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">New Users</h2>
          <div className="text-4xl font-bold">1,234</div>
          <p className="text-gray-400">New users this month</p>
        </div>

        {/* Top Performing Wallpapers */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg col-span-1 md:col-span-2 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4">Top Performing Wallpapers</h2>
          <ul>
            <li className="flex justify-between items-center py-2 border-b border-gray-700">
              <span>Abstract Bliss</span>
              <span>1,234 downloads</span>
            </li>
            <li className="flex justify-between items-center py-2 border-b border-gray-700">
              <span>Mountain Majesty</span>
              <span>987 downloads</span>
            </li>
            <li className="flex justify-between items-center py-2">
              <span>City at Night</span>
              <span>765 downloads</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reports;
