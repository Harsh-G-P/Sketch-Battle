import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ToastContainer } from 'react-toastify'
import { useAuthStore } from './store/useAuthStore'
import AuthPage from './pages/Auth'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import Users from './pages/Users'
import Layout from './components/Layout'
import Theme from './pages/Theme'
import Vote from './pages/Vote'
import Review from './pages/Review'
import Ban from './pages/Ban'

const App = () => {
  const { checkAuth, authUser, checkingAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (checkingAuth) {
    return null
  }

  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <Routes>
        {/* Public route */}
        <Route path="/auth" element={!authUser ? <AuthPage /> : <Navigate to="/" />} />

        {/* Protected routes with Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="users" element={<Users />} />
          <Route path="themes" element={<Theme />} />
          <Route path="battles" element={<Vote />} />
          <Route path="admin/battles/:battleId/votes" element={<Review />} />
          <Route path="admin/users/manage" element={<Ban />} />
        </Route>
      </Routes>

      <ToastContainer />
      <Toaster />
    </div>
  )
}

export default App
