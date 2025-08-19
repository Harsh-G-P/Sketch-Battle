import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuthStore();

  return (
    <>
      <style>{`
        @keyframes flicker {
          0%, 100% {
            opacity: 1;
            filter: drop-shadow(0 0 4px rgba(139, 92, 246, 0.6));
          }
          50% {
            opacity: 0.8;
            filter: drop-shadow(0 0 12px rgba(236, 72, 153, 0.5));
          }
        }
      `}</style>

      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          login({ email, password });
        }}
      >
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-purple-300">
            Email address
          </label>
          <div className="mt-1">
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-2 rounded-md bg-black text-white border border-purple-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-purple-300">
            Password
          </label>
          <div className="mt-1">
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-2 rounded-md bg-black text-white border border-purple-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`relative w-full py-3 px-6 rounded-md font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-pink-500 focus:ring-offset-2 ${
            loading
              ? 'opacity-60 cursor-not-allowed'
              : 'hover:scale-105 hover:shadow-lg'
          }`}
          style={{ animation: !loading ? 'flicker 4s ease-in-out infinite alternate' : 'none' }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </>
  );
};

export default LoginForm;
