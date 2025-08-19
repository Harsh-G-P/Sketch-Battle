import React, { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { HiMenuAlt3, HiX } from 'react-icons/hi'

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-black text-white relative">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-gray-800/80 backdrop-blur-md shadow px-4 py-3 w-full fixed top-0 z-50">
        <Link to="/" onClick={() => setIsSidebarOpen(false)}>
          <h2 className="text-xl font-bold text-cyan-400 glow-text">Admin Panel</h2>
        </Link>
        <button
          onClick={toggleSidebar}
          className="text-2xl text-white focus:outline-none"
        >
          {isSidebarOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-800/40 backdrop-blur-lg shadow-xl p-6 z-40 transform transition-transform duration-300 ease-in-out border-r border-gray-700 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Mobile close */}
        <div className="md:hidden mb-4">
          <button
            className="text-sm text-gray-400 hover:text-cyan-400"
            onClick={toggleSidebar}
          >
            ✖ Close Menu
          </button>
        </div>

        {/* Title */}
        <Link to="/" onClick={() => setIsSidebarOpen(false)}>
          <h2 className="text-2xl font-bold text-cyan-400 mb-8 hidden md:block glow-text hover:underline transition duration-150">
            Admin Panel
          </h2>
        </Link>

        {/* Menu */}
        <ul className="space-y-4 text-sm font-medium">
          {[
            { to: '/', label: 'Dashboard' },
            { to: '/users', label: 'Users' },
            { to: '/themes', label: 'Themes' },
            { to: '/battles', label: 'Vote' },
            { to: '/admin/users/manage', label: 'Ban & UnBan' }
          ].map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md transition duration-200 ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-400 font-semibold'
                      : 'text-gray-300 hover:text-cyan-300 hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto mt-14 md:mt-0 bg-gray-900/80 backdrop-blur-sm rounded-tl-2xl">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
