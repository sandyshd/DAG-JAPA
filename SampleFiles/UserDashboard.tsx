import React, { useState } from 'react';
import {
  User, Mail, Phone, MapPin,
  Menu, LogOut, Globe, FileText,
  Download, HelpCircle, Lock, Bell,
  Settings, ChevronRight, X, AlertCircle
} from 'lucide-react';

interface UserDashboardProps {
  onLogout?: () => void;
  onTakeEnglishTest?: () => void;
  englishTestCompleted?: boolean;
}

const UserDashboard = ({ onLogout, onTakeEnglishTest, englishTestCompleted = false }: UserDashboardProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [changePasswordData, setChangePasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string | null>>({
    currentPassword: null,
    newPassword: null,
    confirmPassword: null
  });
  const [validationMessage, setValidationMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: 'Adebayo Oluwaseun',
    email: 'adebayo@example.com',
    phone: '+234 801 234 5678',
    location: 'Lagos, Nigeria',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  });

  const userData = {
    name: 'Adebayo Oluwaseun',
    email: 'adebayo@example.com',
    phone: '+234 801 234 5678',
    location: 'Lagos, Nigeria',
    status: 'under_review',
    applicationId: 'APP-001',
    appliedDate: '2024-01-15',
    appliedModule: 'Business Plan & Investment'
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      pending: { color: 'bg-yellow-100 text-yellow-700', text: 'Pending' },
      under_review: { color: 'bg-blue-100 text-blue-700', text: 'Under Review' },
      approved: { color: 'bg-green-100 text-green-700', text: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-700', text: 'Rejected' }
    };
    const badge = badges[status] || badges.pending;
    return badge;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (type: keyof typeof formData.notifications) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const handleSaveProfile = () => {
    setEditMode(false);
    // TODO: Add API call to save profile
  };

  const handleChangePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChangePasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSavePassword = () => {
    const newErrors: Record<string, string | null> = {
      currentPassword: null,
      newPassword: null,
      confirmPassword: null
    };

    // Validate current password
    if (!changePasswordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    // Validate new password
    if (!changePasswordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (changePasswordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    }

    // Validate confirm password
    if (!changePasswordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(newErrors);

    // If there are errors, show them and return
    if (Object.values(newErrors).some(error => error !== null)) {
      return;
    }

    // TODO: Add API call to save password
    setValidationMessage({ type: 'success', text: 'Password changed successfully!' });
    setTimeout(() => {
      setChangePasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordErrors({
        currentPassword: null,
        newPassword: null,
        confirmPassword: null
      });
      setShowChangePasswordModal(false);
      setValidationMessage(null);
    }, 2000);
  };

  const menuItems = [
    { id: 'overview', icon: <User />, label: 'Overview' },
    { id: 'documents', icon: <FileText />, label: 'Documents' },
    { id: 'resources', icon: <Download />, label: 'Resources' },
    { id: 'settings', icon: <Settings />, label: 'Settings' }
  ];

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
                  <div className="text-xs text-green-600">User Portal</div>
                </div>
              </div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
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

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white hidden">
          <button
            onClick={onLogout}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition ${
              !sidebarOpen && 'justify-center'
            }`}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userData.name.split(' ')[0]}</h1>
              <p className="text-sm text-gray-600">Manage your account and view your application status</p>
            </div>
            {/* Top Right Corner: Profile Button & Logout */}
            <div className="flex items-center space-x-4">
              {/* User Profile Button */}
              <button
                onClick={() => {
                  setActiveTab('profile');
                  setShowProfileModal(true);
                }}
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center text-white font-bold">
                  {userData.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">{userData.name.split(' ')[0]}</p>
                  <p className="text-xs text-gray-600">{userData.email}</p>
                </div>
              </button>
              
              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-semibold"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Application Status Card */}
              <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl shadow-sm p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Application Status</h3>
                    <p className="text-white text-opacity-90 mb-4">Your application for {userData.appliedModule}</p>
                    <div className="flex items-center space-x-3">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(userData.status).color}`}>
                        {getStatusBadge(userData.status).text}
                      </span>
                      <span className="text-white text-opacity-75 text-sm">ID: {userData.applicationId}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* English Test Prompt - Only if not completed */}
              {!englishTestCompleted && (
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-sm p-6 text-white border border-indigo-400">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">English Proficiency Test Required</h3>
                      <p className="text-white text-opacity-90 mb-4">
                        Complete your English proficiency assessment to proceed with your application evaluation. This is a mandatory requirement.
                      </p>
                      <button
                        onClick={onTakeEnglishTest}
                        className="bg-white text-indigo-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition inline-flex items-center space-x-2"
                      >
                        <span>Take English Test Now</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <p className="text-sm text-gray-600 mb-2">Applied Date</p>
                  <p className="text-xl font-bold text-gray-900">{userData.appliedDate}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <p className="text-sm text-gray-600 mb-2">Application ID</p>
                  <p className="text-xl font-bold text-gray-900">{userData.applicationId}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <p className="text-sm text-gray-600 mb-2">Module</p>
                  <p className="text-sm font-bold text-gray-900">{userData.appliedModule}</p>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                  <button
                    onClick={() => {
                      setShowProfileModal(true);
                      setEditMode(true);
                    }}
                    className="text-green-600 hover:text-green-700 font-semibold flex items-center space-x-1"
                  >
                    <span>Edit Profile</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Full Name</p>
                      <p className="text-sm font-semibold text-gray-900">{formData.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Email</p>
                      <p className="text-sm font-semibold text-gray-900">{formData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Phone</p>
                      <p className="text-sm font-semibold text-gray-900">{formData.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Location</p>
                      <p className="text-sm font-semibold text-gray-900">{formData.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Application Documents</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Application Form</p>
                        <p className="text-sm text-gray-600">PDF • 2.4 MB</p>
                      </div>
                    </div>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="font-semibold text-gray-900">CV / Resume</p>
                        <p className="text-sm text-gray-600">PDF • 1.8 MB</p>
                      </div>
                    </div>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-purple-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Support Documents</p>
                        <p className="text-sm text-gray-600">PDF • 3.1 MB</p>
                      </div>
                    </div>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <HelpCircle className="w-8 h-8 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">Help & Support</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Get help with your application or account</p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                    Contact Support
                  </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <FileText className="w-8 h-8 text-green-600" />
                    <h3 className="text-lg font-bold text-gray-900">Guides & Tutorials</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Learn how to make the most of the platform</p>
                  <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium">
                    View Guides
                  </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <Download className="w-8 h-8 text-purple-600" />
                    <h3 className="text-lg font-bold text-gray-900">Downloadable Resources</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Download templates, checklists, and more</p>
                  <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition font-medium">
                    Download
                  </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <Bell className="w-8 h-8 text-orange-600" />
                    <h3 className="text-lg font-bold text-gray-900">Updates & News</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Stay informed about new opportunities</p>
                  <button className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition font-medium">
                    View Updates
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Profile Settings */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Profile Settings</h3>
                <button
                  onClick={() => {
                    setShowProfileModal(true);
                    setEditMode(true);
                  }}
                  className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-600" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Edit Personal Information</p>
                      <p className="text-sm text-gray-600">Update your name, email, phone, location</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Security Settings */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Security Settings</h3>
                <button
                  onClick={() => setShowChangePasswordModal(true)}
                  className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center space-x-3">
                    <Lock className="w-5 h-5 text-gray-600" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Change Password</p>
                      <p className="text-sm text-gray-600">Update your account password</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Notification Settings */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive updates via email</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifications.email}
                        onChange={() => handleNotificationChange('email')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-semibold text-gray-900">SMS Notifications</p>
                        <p className="text-sm text-gray-600">Receive updates via SMS</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifications.sms}
                        onChange={() => handleNotificationChange('sms')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Push Notifications</p>
                        <p className="text-sm text-gray-600">Receive push notifications</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifications.push}
                        onChange={() => handleNotificationChange('push')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Management Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editMode ? 'Edit Profile' : 'Profile Information'}
              </h2>
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setEditMode(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {editMode ? (
                <>
                  {/* Personal Information Edit */}
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Personal Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* View Mode */}
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Full Name</p>
                    <p className="text-lg font-semibold text-gray-900 mb-4">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Email</p>
                    <p className="text-lg font-semibold text-gray-900 mb-4">{formData.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Phone</p>
                    <p className="text-lg font-semibold text-gray-900 mb-4">{formData.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Location</p>
                    <p className="text-lg font-semibold text-gray-900">{formData.location}</p>
                  </div>
                  <button
                    onClick={() => setEditMode(true)}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
              <button
                onClick={() => setShowChangePasswordModal(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={changePasswordData.currentPassword}
                  onChange={handleChangePasswordInputChange}
                  placeholder="Enter your current password"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {passwordErrors.currentPassword && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> {passwordErrors.currentPassword}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={changePasswordData.newPassword}
                  onChange={handleChangePasswordInputChange}
                  placeholder="Enter your new password"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    passwordErrors.newPassword ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {passwordErrors.newPassword && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> {passwordErrors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={changePasswordData.confirmPassword}
                  onChange={handleChangePasswordInputChange}
                  placeholder="Confirm your new password"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowChangePasswordModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePassword}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Save Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation Toast Notification */}
      {validationMessage && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in-up z-40 ${
          validationMessage.type === 'success'
            ? 'bg-green-50 border-l-4 border-green-500'
            : 'bg-red-50 border-l-4 border-red-500'
        }`}>
          {validationMessage.type === 'success' ? (
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          ) : (
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          <div className="flex-1">
            <p className={`text-sm font-medium ${
              validationMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {validationMessage.text}
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in-up {
          animation: slideInUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;
