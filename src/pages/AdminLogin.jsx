import React, { useState } from 'react';
import { Shield, Lock } from 'lucide-react';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password) {
      setError('Please enter a password');
      return;
    }

    // Store auth token in sessionStorage
    sessionStorage.setItem('adminAuth', password);
    onLogin(password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-500 p-4 rounded-full">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Enter your password to access analytics
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter admin password"
                  autoFocus
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
            >
              Login to Dashboard
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Default password: admin123
              <br />
              <span className="text-red-500">Change this in production!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
