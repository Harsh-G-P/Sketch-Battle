import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const flickerAnimation = {
  animation: "flicker 4s ease-in-out infinite alternate",
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuth, authUser, checkingAuth, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/draw', label: 'Drawing' },
    { to: '/battle-lobby', label: 'Battle' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/leaderboard', label: 'Leaderboard' },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-300 via-black to-gray-300 shadow-md text-white relative z-50">
      <style>{`
        .neon-text {
          background: linear-gradient(to right, #8b5cf6, #ec4899);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow:
            0 0 4px #d946ef,
            0 0 8px #a855f7;
        }

        .hover\\:text-glow:hover {
          text-shadow:
            0 0 6px #ec4899,
            0 0 12px #a855f7,
            0 0 20px #f472b6;
          transform: scale(1.05);
        }

        .dropdown-bg {
          background-color: #1f1f1f;
          border: 1px solid #8b5cf6;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.4);
        }

        .neon-btn {
          background: linear-gradient(to right, #ec4899, #8b5cf6);
          color: white;
          box-shadow: 0 0 10px #d946ef;
        }

        .neon-btn:hover {
          filter: brightness(1.1);
        }

        .nav-link {
          position: relative;
          padding: 0.5rem 0.75rem;
          transition: color 0.3s ease, transform 0.3s ease;
        }

        .nav-link::after {
          content: "";
          position: absolute;
          width: 0%;
          height: 2px;
          left: 0;
          bottom: 0;
          background: linear-gradient(to right, #ec4899, #8b5cf6);
          transition: width 0.3s ease;
        }

        .nav-link:hover,
        .nav-link.active {
          color: #f472b6;
          transform: scale(1.05);
          text-shadow:
            0 0 4px #ec4899,
            0 0 8px #8b5cf6;
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }
      `}</style>

      <div className="navbar container mx-auto px-4 py-3">
        {/* Navbar Start */}
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost text-white lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex={0}
              className="menu menu-sm dropdown-content dropdown-bg mt-3 p-2 rounded-box w-52">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Neon Logo */}
          <Link
            to="/"
            >
              <h1
          className="text-l sm:text-xl font-extrabold text-center bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent glow-text"
        >
          Sketch{" "}
          <span
            className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-400 bg-clip-text text-transparent glow-flicker"
            style={flickerAnimation}
          >
            Battle
          </span>
        </h1>
          </Link>
          
        </div>

        {/* Navbar Center - Desktop */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 space-x-2 text-white font-medium">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`nav-link ${location.pathname === to ? 'active' : ''}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Navbar End */}
        <div className="navbar-end">
          {authUser ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full ring ring-pink-500 ring-offset-2 ring-offset-black">
                  <img alt="User Avatar" src={authUser.avatar || '/avatar.png'} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content dropdown-bg mt-3 p-2 rounded-box w-52"
              >
                <li><Link to="/profile">Profile</Link></li>
                <li><div onClick={handleLogout}>Logout</div></li>
              </ul>
            </div>
          ) : (
            <Link to="/auth">
              <button className="btn neon-btn border-none">Get Started</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
