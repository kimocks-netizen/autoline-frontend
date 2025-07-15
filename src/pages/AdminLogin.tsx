import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

    const handleLogin = async (e: FormEvent) => {
      e.preventDefault();
      
      try {
        const response = await axios.post(
          'https://autolinepanel-backend-production.up.railway.app/api/admin/login',
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
          const authData = {
            //token: response.data.data.token,
            token: response.data.token,

            expiresAt: Date.now() + 60 * 60 * 1000 // 1 hour from now
          };
          localStorage.setItem('auth', JSON.stringify(authData));
          navigate('/admin/dashboard', { replace: true });
        } else {
          alert('Login failed: Unexpected response from server.');
        }

      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || error.message || 'An error occurred while logging in.';
          alert(`Login failed: ${message}`);
          console.error('Axios error:', error);
        } else {
          alert('An unexpected error occurred. Please try again.');
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