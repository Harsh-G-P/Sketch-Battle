import React, { useEffect, useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { useThemeStore } from '../store/useThemeStore'

const Theme = () => {
  const { themes, getTheme, addTheme, updateTheme, deleteTheme } = useThemeStore()
  const [name, setName] = useState('')
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    getTheme()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return

    if (editId) {
      updateTheme(editId, name)
    } else {
      addTheme(name)
    }

    setName('')
    setEditId(null)
  }

  const handleEdit = (theme) => {
    setName(theme.name)
    setEditId(theme._id)
  }

  const handleCancelEdit = () => {
    setName('')
    setEditId(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 px-4 py-8 font-sans text-cyan-300">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center drop-shadow-[0_0_10px_cyan]">
          🎨 Theme Management
        </h2>

        {/* Add/Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 mb-10"
        >
          <input
            type="text"
            value={name}
            placeholder="Enter theme name"
            onChange={(e) => setName(e.target.value)}
            className="flex-1 px-4 py-2 rounded-md bg-white/5 border border-white/10 backdrop-blur text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-5 py-2 rounded bg-cyan-600 hover:bg-cyan-500 transition"
            >
              {editId ? 'Update' : 'Add'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-5 py-2 rounded border border-gray-400 hover:border-gray-300 transition text-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto rounded-xl bg-white/5 border border-white/10 backdrop-blur shadow-lg shadow-cyan-500/10">
          <table className="w-full text-sm sm:text-base">
            <thead className="text-cyan-300 text-left">
              <tr>
                <th className="px-6 py-4">፹</th>
                <th className="px-6 py-4">Theme Name</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {themes.length > 0 ? (
                themes.map((theme, index) => (
                  <tr
                    key={theme._id}
                    className={`transition-all ${
                      index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'
                    } hover:bg-cyan-800/20`}
                  >
                    <td className="px-6 py-4 text-white">{index + 1}</td>
                    <td className="px-6 py-4 text-white">{theme.name}</td>
                    <td className="px-6 py-4 text-right space-x-4">
                      <button
                        onClick={() => handleEdit(theme)}
                        className="text-blue-400 hover:text-blue-200"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteTheme(theme._id)}
                        className="text-red-400 hover:text-red-200"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-6 text-center text-gray-400">
                    No themes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-6 mt-8">
          {themes.map((theme, index) => (
            <div
              key={theme._id}
              className="bg-white/5 border border-white/10 backdrop-blur p-5 rounded-xl shadow-md shadow-cyan-500/10"
            >
              <p className="text-white mb-2">
                <span className="font-semibold text-cyan-300">#:</span> {index + 1}
              </p>
              <p className="text-white mb-2">
                <span className="font-semibold text-cyan-300">Name:</span> {theme.name}
              </p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleEdit(theme)}
                  className="w-full px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 transition text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTheme(theme._id)}
                  className="w-full px-4 py-2 rounded bg-red-600 hover:bg-red-500 transition text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Theme
