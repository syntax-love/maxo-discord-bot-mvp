import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

// Mock data with realistic scenarios
const mockTransactions = [
  {
    id: 'TX_ETH_789012',
    user: 'Crypto.Whale#1234',
    amount: '39.97',
    currency: 'USD',
    cryptoAmount: '0.0241',
    cryptoType: 'ETH',
    status: 'completed',
    timestamp: '2024-02-11T20:30:00Z',
    tier: 'diamond'
  },
  {
    id: 'TX_SOL_789013',
    user: 'NFT.Trader#5678',
    amount: '9.97',
    currency: 'USD',
    cryptoAmount: '0.1234',
    cryptoType: 'SOL',
    status: 'pending',
    timestamp: '2024-02-11T20:15:00Z',
    tier: 'sapphire'
  },
  // Add more realistic transactions
];

const revenueData = [
  { date: '2024-02-05', revenue: 149.85 },
  { date: '2024-02-06', revenue: 189.82 },
  { date: '2024-02-07', revenue: 259.70 },
  { date: '2024-02-08', revenue: 299.67 },
  { date: '2024-02-09', revenue: 349.64 },
  { date: '2024-02-10', revenue: 399.61 },
  { date: '2024-02-11', revenue: 449.58 },
];

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899'];

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Header with Live Status */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Premium Dashboard</h1>
          <p className="text-gray-400">Real-time payment monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-500">System Online</span>
          </div>
          <select 
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-gray-400 mb-2">Total Revenue</h3>
          <p className="text-2xl font-bold">$449.58</p>
          <p className="text-green-500 text-sm">↑ 12.5% from last week</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-gray-400 mb-2">Active Subscriptions</h3>
          <p className="text-2xl font-bold">23</p>
          <p className="text-green-500 text-sm">↑ 4 new today</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-gray-400 mb-2">Conversion Rate</h3>
          <p className="text-2xl font-bold">87.5%</p>
          <p className="text-green-500 text-sm">↑ 2.1% increase</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-gray-400 mb-2">Pending Payments</h3>
          <p className="text-2xl font-bold">3</p>
          <p className="text-yellow-500 text-sm">Processing...</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Revenue Trend</h2>
          <LineChart width={600} height={300} data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
              labelStyle={{ color: '#9CA3AF' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6' }}
            />
          </LineChart>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Subscription Distribution</h2>
          <PieChart width={400} height={300}>
            <Pie
              data={[
                { name: 'Diamond', value: 20 },
                { name: 'Sapphire', value: 30 },
                { name: 'Pearl', value: 50 }
              ]}
              cx={200}
              cy={150}
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {revenueData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Transactions</h2>
          <button className="text-blue-400 hover:text-blue-300">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="p-3">Transaction ID</th>
                <th className="p-3">User</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Crypto</th>
                <th className="p-3">Status</th>
                <th className="p-3">Tier</th>
                <th className="p-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map(tx => (
                <tr key={tx.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                  <td className="p-3 font-mono text-sm">{tx.id}</td>
                  <td className="p-3">{tx.user}</td>
                  <td className="p-3">${tx.amount}</td>
                  <td className="p-3">
                    {tx.cryptoAmount} {tx.cryptoType}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      tx.status === 'completed' ? 'bg-green-500/20 text-green-300' : 
                      'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      tx.tier === 'diamond' ? 'bg-purple-500/20 text-purple-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {tx.tier}
                    </span>
                  </td>
                  <td className="p-3 text-gray-400">
                    {new Date(tx.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 