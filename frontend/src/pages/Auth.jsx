import React, { useState } from 'react';
import Login from '../components/Login';
import SignUp from '../components/SignUp';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <style>{`
        @keyframes flicker {
          0%, 100% {
            opacity: 1;
            filter: drop-shadow(0 0 6px rgba(139, 92, 246, 0.7));
          }
          50% {
            opacity: 0.85;
            filter: drop-shadow(0 0 12px rgba(236, 72, 153, 0.5));
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-black bg-opacity-40 border border-purple-600 shadow-[0_0_25px_rgba(139,92,246,0.5)] rounded-2xl p-8">
          <h2
            className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
            style={{
              textShadow: '0 0 8px rgba(139, 92, 246, 0.6), 0 0 16px rgba(236, 72, 153, 0.4)',
              animation: 'flicker 4s ease-in-out infinite alternate'
            }}
          >
            {isLogin ? 'Sign in to SketchBattle' : 'Create a SketchBattle Account'}
          </h2>

          {isLogin ? <Login /> : <SignUp />}

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-400 mb-2">
              {isLogin ? 'New to SketchBattle?' : 'Already have an account?'}
            </p>
            <button
  onClick={() => setIsLogin(prev => !prev)}
  className="text-pink-500 font-semibold transition duration-300 ease-in-out 
             hover:text-white hover:drop-shadow-[0_0_10px_rgba(236,72,153,0.9)] 
             focus:outline-none focus:ring-2 focus:ring-pink-500"
>
  {isLogin ? 'Create a new account' : 'Sign in to your account'}
</button>

          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
