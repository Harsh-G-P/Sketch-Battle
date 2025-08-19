import React, { useEffect } from 'react';
import { useAdminStore } from '../store/useAdminStore';
import toast from 'react-hot-toast';

const Users = () => {
  const {
    users,
    fetchUsers,
    promoteToAdmin,
    deleteUser,
    loading,
  } = useAdminStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const success = await deleteUser(userId);
      if (success) {
        toast.success("User deleted successfully");
      } else {
        toast.error("Failed to delete user");
      }
    }
  };

  const handlePromote = async (userId) => {
    const success = await promoteToAdmin(userId);
    if (success) {
      toast.success("User promoted to admin");
    } else {
      toast.error("Promotion failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-cyan-500 border-opacity-50"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 px-4 py-8 font-sans text-cyan-300">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center drop-shadow-[0_0_10px_cyan]">
        👤 Admin User Controls
      </h1>

      {/* Desktop Table */}
      <div className="hidden sm:block bg-white/10 backdrop-blur-md rounded-2xl shadow-lg shadow-cyan-800/70 p-6">
        <table className="w-full text-sm border-separate border-spacing-y-3">
          <thead>
            <tr className="text-cyan-400 uppercase tracking-wide text-sm select-none">
              <th className="py-3 px-4 text-left">Username</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-gray-500 italic">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="transition-shadow rounded-xl shadow-md hover:shadow-cyan-600/40 bg-cyan-900/20"
                >
                  <td className="py-3 px-4 font-medium">{user.username}</td>
                  <td className="py-3 px-4 truncate max-w-[250px]">{user.email}</td>
                  <td className="py-3 px-4 capitalize">{user.role}</td>
                  <td className="py-3 px-4 flex flex-wrap gap-3">
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-1 px-3 rounded shadow-[0_0_6px_red] transition-all"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                    {user.role !== 'admin' ? (
                      <button
                        className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold py-1 px-3 rounded shadow-[0_0_6px_cyan] transition-all"
                        onClick={() => handlePromote(user._id)}
                      >
                        Promote
                      </button>
                    ) : (
                      <span className="text-green-400 font-semibold text-sm mt-1">Admin</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-6 mt-10">
        {users.length === 0 ? (
          <div className="text-center text-gray-400 italic">No users found.</div>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="rounded-xl p-5 shadow-md backdrop-blur-md bg-cyan-900/20"
            >
              <p className="text-white mb-1">
                <span className="text-cyan-300 font-semibold">Username:</span> {user.username}
              </p>
              <p className="text-white mb-1 break-words">
                <span className="text-cyan-300 font-semibold">Email:</span> {user.email}
              </p>
              <p className="text-white mb-3">
                <span className="text-cyan-300 font-semibold">Role:</span> {user.role}
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
                <button
                  className="w-full text-sm px-4 py-2 rounded bg-red-600 hover:bg-red-500 text-white shadow-[0_0_6px_red] transition"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
                {user.role !== 'admin' ? (
                  <button
                    className="w-full text-sm px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_6px_cyan] transition"
                    onClick={() => handlePromote(user._id)}
                  >
                    Promote to Admin
                  </button>
                ) : (
                  <span className="text-green-400 font-semibold w-full text-center">
                    Admin
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Users;
