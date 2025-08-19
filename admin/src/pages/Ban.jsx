import React, { useEffect, useState } from "react";
import { useAdminStore } from "../store/useAdminStore";
import toast from "react-hot-toast";

export default function Ban() {
  const { users, fetchUsers, banUser, unbanUser, loading } = useAdminStore();

  const [selectedUser, setSelectedUser] = useState(null);
  const [banDays, setBanDays] = useState("");
  const [banReason, setBanReason] = useState("");
  const [showBanModal, setShowBanModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUnban = async (userId) => {
    const success = await unbanUser(userId);
    if (success) {
      toast.success("User unbanned successfully");
    } else {
      toast.error("Failed to unban user");
    }
  };

  const openBanModal = (user) => {
    setSelectedUser(user);
    setBanDays("");
    setBanReason("");
    setShowBanModal(true);
  };

  const submitBan = async () => {
    const days = parseInt(banDays, 10);
    if (!days || days <= 0) {
      toast.error("Please enter a valid number of days.");
      return;
    }

    const success = await banUser(selectedUser._id, days, banReason);
    if (success) {
      toast.success("User banned successfully");
      setShowBanModal(false);
    } else {
      toast.error("Failed to ban user");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-cyan-500 border-opacity-50"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 px-4 py-8 font-sans text-cyan-300">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center drop-shadow-[0_0_10px_cyan]">
        👤Admin User Management
      </h2>

      {/* DESKTOP */}
      <div className="hidden sm:block bg-white/10 backdrop-blur-md rounded-2xl shadow-lg shadow-cyan-800/70 p-6">
        <table className="w-full text-sm border-separate border-spacing-y-3">
          <thead>
            <tr className="text-cyan-400 uppercase tracking-wide text-sm select-none">
              <th className="py-3 px-4 text-left">Username</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Action</th>
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
                  className={`transition-shadow rounded-xl shadow-md hover:shadow-cyan-600/40 ${
                    user.isBanned ? "bg-red-900/40" : "bg-cyan-900/20"
                  }`}
                >
                  <td className="py-3 px-4 font-medium">{user.username}</td>
                  <td className="py-3 px-4 truncate max-w-[200px]">{user.email}</td>
                  <td className="py-3 px-4 text-yellow-300 font-semibold">
                    {user.isBanned
                      ? `Banned until ${new Date(user.banExpiresAt).toLocaleString()}`
                      : "Active"}
                  </td>
                  <td className="py-3 px-4">
                    {user.isBanned ? (
                      <button
                        onClick={() => handleUnban(user._id)}
                        className="bg-green-500 hover:bg-green-600 text-black font-semibold py-2 px-4 rounded-lg shadow-[0_0_8px_green] transition-all"
                      >
                        Unban
                      </button>
                    ) : (
                      <button
                        onClick={() => openBanModal(user)}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-[0_0_8px_red] transition-all"
                      >
                        Ban
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE */}
      <div className="block sm:hidden space-y-4">
        {users.length === 0 ? (
          <div className="text-center text-gray-400 italic">No users found.</div>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className={`rounded-xl p-4 shadow-md backdrop-blur-md ${
                user.isBanned ? "bg-red-900/40" : "bg-cyan-900/20"
              }`}
            >
              <div className="text-lg font-semibold">{user.username}</div>
              <div className="text-sm text-gray-300 break-words">{user.email}</div>
              <div className="mt-1 text-yellow-300 font-medium text-sm">
                {user.isBanned
                  ? `Banned until ${new Date(user.banExpiresAt).toLocaleString()}`
                  : "Active"}
              </div>
              <div className="mt-4">
                {user.isBanned ? (
                  <button
                    onClick={() => handleUnban(user._id)}
                    className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded shadow-[0_0_8px_green] transition-all text-sm"
                  >
                    Unban
                  </button>
                ) : (
                  <button
                    onClick={() => openBanModal(user)}
                    className="w-full bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-[0_0_8px_red] transition-all text-sm"
                  >
                    Ban
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* BAN MODAL */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-cyan-300 p-6 rounded-lg shadow-xl w-[90%] sm:w-[400px] space-y-4">
            <h3 className="text-xl font-bold mb-2 text-center">Ban {selectedUser?.username}</h3>
            <div>
              <label className="block text-sm mb-1">Ban Duration (in days)</label>
              <input
                type="number"
                value={banDays}
                onChange={(e) => setBanDays(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 text-white rounded outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Reason (optional)</label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 text-white rounded outline-none focus:ring-2 focus:ring-cyan-500"
                rows={3}
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowBanModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitBan}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded shadow-[0_0_8px_red]"
              >
                Confirm Ban
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
