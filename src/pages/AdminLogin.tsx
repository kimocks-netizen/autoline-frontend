import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { API_ENDPOINTS } from '../utils/api';
import { useToast } from '../components/ToastContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

    const handleLogin = async (e: FormEvent) => {
      e.preventDefault();
      
      try {
        const response = await axios.post(
          API_ENDPOINTS.ADMIN_LOGIN,
          {
            email,
            password
          },
          {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true // Important if using cookies
          }
        );

        if (response.data.status === 'success') {
          const token = response.data.token || response.data.data?.token;
          
                      if (token) {
              // Store token in the format App.tsx expects
              localStorage.setItem('adminToken', token);
              
              // Also store the full auth data for backward compatibility
              const authData = {
                token: token,
                expiresAt: Date.now() + 2* 60 * 60 * 1000 // 2 hours from now
              };
              localStorage.setItem('auth', JSON.stringify(authData));
              
              showToast('Login successful! Welcome back.', 'success');
              
              // Dispatch custom event to notify App.tsx about login state change
              window.dispatchEvent(new CustomEvent('loginStateChanged', { detail: { isLoggedIn: true } }));
              
              navigate('/admin/dashboard', { replace: true });
            } else {
              showToast('Login failed: No token received from server.', 'error');
            }
        } else {
          showToast('Login failed: Unexpected response from server.', 'error');
        }

      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || error.message || 'An error occurred while logging in.';
          showToast(`Login failed: ${message}`, 'error');
          console.error('Axios error:', error);
        } else {
          showToast('An unexpected error occurred. Please try again.', 'error');
          console.error('Unknown error:', error);
        }
      }
    };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Navbar />
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header now spans full card width */}
        <div className="w-full bg-gradient-to-r from-primary-blue to-dark-blue py-4 px-6 text-white">
          <h2 className="text-xl font-bold text-center">ADMIN LOGIN</h2>
        </div>
        
        <form onSubmit={handleLogin} className="p-6 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-red focus:ring-2 focus:ring-primary-red/50 p-2"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-red focus:ring-2 focus:ring-primary-red/50 p-2"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-red to-dark-red text-white py-3 px-4 rounded-md hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;