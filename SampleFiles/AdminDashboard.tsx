import React, { useState } from 'react';
import { 
  Search, Eye, FileText, BarChart3,
  Globe, Menu
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock data for applications
  const applications = [
    {
      id: 'APP-001',
      name: 'Adebayo Oluwaseun',
      email: 'adebayo@example.com',
      phone: '+234 801 234 5678',
      module: 'Business Plan & Investment',
      moduleId: 1,
      status: 'pending',
      appliedDate: '2024-01-15',
      education: 'Bachelor\'s Degree',
      reviewDate: null,
      score: null,
      amount: '$15',
      country: 'Nigeria',
      city: 'Lagos'
    },
    {
      id: 'APP-002',
      name: 'Chioma Nwosu',
      email: 'chioma@example.com',
      phone: '+234 802 345 6789',
      module: 'Healthcare',
      moduleId: 5,
      status: 'approved',
      appliedDate: '2024-01-14',
      education: 'Master\'s Degree',
      reviewDate: '2024-01-18',
      score: 85,
      amount: '$15',
      country: 'Nigeria',
      city: 'Abuja'
    },
    {
      id: 'APP-003',
      name: 'Ibrahim Yusuf',
      email: 'ibrahim@example.com',
      phone: '+234 803 456 7890',
      module: 'Data Entry Roles',
      moduleId: 8,
      status: 'rejected',
      appliedDate: '2024-01-13',
      education: 'Secondary School',
      reviewDate: '2024-01-17',
      score: 45,
      amount: '$15',
      country: 'Nigeria',
      city: 'Kano'
    }
  ];


  const getStatusBadge = (status: string) => {
    const badges: any = {
      pending: { color: 'bg-yellow-100 text-yellow-700', text: 'Pending' },
      under_review: { color: 'bg-blue-100 text-blue-700', text: 'Under Review' },
      approved: { color: 'bg-green-100 text-green-700', text: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-700', text: 'Rejected' }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`bg-white border-r transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm">Developing Africa</div>
                  <div className="text-xs text-green-600">Admin Panel</div>
                </div>
              </div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {[
            { id: 'dashboard', icon: <BarChart3 />, label: 'Dashboard' },
            { id: 'applications', icon: <FileText />, label: 'Applications' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                activeTab === item.id
                  ? 'bg-green-50 text-green-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {React.cloneElement(item.icon, { className: 'w-5 h-5' })}
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
              <p className="text-sm text-gray-600">Manage applications</p>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold text-gray-900">{app.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{app.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{app.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
