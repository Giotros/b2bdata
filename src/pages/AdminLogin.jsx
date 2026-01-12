import React, { useState } from 'react';
import { Shield, Lock, AlertCircle } from 'lucide-react';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password) {
      setError('Please enter a password');
      return;
    }

    setIsLoading(true);
    setError('');
    setDebugInfo(null);

    try {
      const url = '/api/analytics';
      console.log('Attempting to authenticate with:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${password}`,
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      // Store debug info
      setDebugInfo({
        url,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (response.status === 401) {
        setError('Invalid password. Please try again.');
        return;
      }

      if (response.status === 404) {
        setError('API endpoint not found. The /api/analytics endpoint may not be configured.');
        return;
      }

      if (!response.ok) {
        setError(`Server error (${response.status}): ${response.statusText}`);
        return;
      }

      // Password is correct, store it and proceed
      sessionStorage.setItem('adminAuth', password);
      onLogin(password);
      
    } catch (err) {
      console.error('Login error:', err);
      setError(`Network error: ${err.message}. The API server may not be running.`);
      setDebugInfo({
        error: err.message,
        type: err.name
      });
    } finally {
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
                    setDebugInfo(null);
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

              {debugInfo && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs font-semibold text-blue-700 mb-1">Debug Info:</p>
                  <pre className="text-xs text-blue-600 overflow-auto">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
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
            
            {/* Temporary bypass button for debugging */}
            <button
              onClick={() => {
                const testToken = 'test-token';
                sessionStorage.setItem('adminAuth', testToken);
                onLogin(testToken);
              }}
              className="mt-4 w-full text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Bypass login (dev mode - remove in production)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
