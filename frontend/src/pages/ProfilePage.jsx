import React, { useRef, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useUserStore } from '../store/useUserStore'

const flickerAnimation = {
  animation: "flicker 4s ease-in-out infinite alternate",
}

const ProfilePage = () => {
  const { authUser } = useAuthStore()
  const [username, setUsername] = useState(authUser.username || '')
  const [email, setEmail] = useState(authUser.email || '')
  const [image, setImage] = useState(authUser.avatar || null)

  const fileInputRef = useRef(null)
  const { loading, updateProfile } = useUserStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    updateProfile({ username, email, avatar: image })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-300 px-6 py-12 font-sans">
      <style>{`
        @keyframes flicker {
          0%, 100% {
            opacity: 1;
            filter: none;
          }
          50% {
            opacity: 0.9;
            filter: none;
          }
        }
        @keyframes textGlow {
          0% {
            text-shadow: 0 0 8px #7c3aed, 0 0 14px #ec4899;
            color: #c084fc;
          }
          50% {
            text-shadow: 0 0 12px #8b5cf6, 0 0 24px #f9a8d4;
            color: #f472b6;
          }
          100% {
            text-shadow: 0 0 8px #7c3aed, 0 0 14px #ec4899;
            color: #c084fc;
          }
        }
        .glow-text {
          animation: textGlow 3s ease-in-out infinite;
        }
        .glow-flicker {
          animation: textGlow 4s ease-in-out infinite alternate;
          color: #a78bfa;
        }
        .glass {
          background: rgba(17, 17, 17, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(139, 92, 246, 0.6);
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
          border-radius: 1rem;
        }
        .neon-button {
          box-shadow: 0 0 12px #a78bfa, 0 0 24px #8b5cf6;
          transition: filter 0.3s ease;
        }
        .neon-button:hover {
          filter: brightness(1.2) drop-shadow(0 0 10px #a78bfa);
        }
      `}</style>

      <h1
  className="text-6xl sm:text-6xl font-extrabold mb-12 text-center bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent glow-text"
>
  👤 Your{" "}
  <span
    className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-400 bg-clip-text text-transparent glow-flicker"
    style={flickerAnimation}
  >
    Profile
  </span>
</h1>


      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
        {[
          { label: 'Battles Played', value: authUser.battlesPlayed, color: 'text-yellow-400' },
          { label: 'Wins', value: authUser.battlesWon, color: 'text-green-400' },
          { label: 'Losses', value: authUser.battlesLost, color: 'text-red-400' },
        ].map((stat, index) => (
          <div key={index} className="glass p-6 border-purple-600 shadow-lg flex flex-col items-center">
            <h3 className="text-xs uppercase tracking-widest mb-2 text-pink-300">{stat.label}</h3>
            <p className={`text-4xl font-extrabold ${stat.color}`}>{stat.value || 0}</p>
          </div>
        ))}
      </div>

      {/* Profile Form */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass py-8 px-8 shadow-lg border-purple-600">
          <h2 className="text-3xl font-bold mb-6 text-center glow-text border-b border-purple-700 pb-4">
            ✨ Edit Profile
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-pink-300 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md bg-black bg-opacity-50 border border-purple-600 text-white placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-pink-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md bg-black bg-opacity-50 border border-purple-600 text-white placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-pink-300 mb-1">Avatar Image</label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-semibold neon-button"
                  style={flickerAnimation}
                >
                  Upload Image
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {image && (
              <div className="mt-6">
                <img
                  src={image}
                  alt="User Avatar"
                  className="w-full h-52 object-cover rounded-lg border border-purple-700 shadow-lg"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 py-3 rounded-lg text-white font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 neon-button"
              style={flickerAnimation}
            >
              {loading ? "Saving..." : "💾 Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
