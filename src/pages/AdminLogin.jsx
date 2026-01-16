import React, { useState } from 'react';
import { Shield, Lock, AlertCircle } from 'lucide-react';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      setError('Please enter a password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Expected password (matches ADMIN_PASSWORD in .env.local)
      const EXPECTED_PASSWORD = 'tryhackmenexttimebro123!?';

      // Try API authentication first (works in production/Vercel)
      const url = '/api/analytics';
      console.log('Attempting API authentication...');

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${password}`,
          },
        });

        console.log('API Response status:', response.status);

        if (response.ok) {
          // API authentication successful
          console.log('API authentication successful');
          sessionStorage.setItem('adminAuth', password);
          onLogin(password);
          return;
        }

        if (response.status === 401) {
          setError('Invalid password. Please try again.');
          setIsLoading(false);
          return;
        }

        // API not available or other error - fall back to local check
        console.log('API not available (status ' + response.status + '), using local authentication...');

      } catch (apiError) {
        console.log('API not reachable, using local authentication...', apiError.message);
      }

      // Fallback: Local authentication (for development when API not deployed)
      if (password === EXPECTED_PASSWORD) {
        console.log('Local authentication successful');
        sessionStorage.setItem('adminAuth', password);
        onLogin(password);
      } else {
        setError('Invalid password. Please try again.');
        setIsLoading(false);
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(`Authentication error: ${err.message}`);
      setIsLoading(false);
    }
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
                  disabled={isLoading}
                />
              </div>
              
              {error && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? 'Authenticating...' : 'Login to Dashboard'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Secure admin access with environment-based authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
