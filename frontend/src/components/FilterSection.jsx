import React, { useState } from "react";

const FilterSection = ({ filters, setFilters, themes, handleFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleReset = () =>
    setFilters({
      themeId: "",
      dateFrom: "",
      dateTo: "",
    });

  return (
    <>
      <style>{`
        @keyframes textGlow {
          0%, 100% {
            text-shadow: 0 0 8px #7c3aed, 0 0 14px #ec4899;
            color: #c084fc;
          }
          50% {
            text-shadow: 0 0 12px #8b5cf6, 0 0 24px #f9a8d4;
            color: #f472b6;
          }
        }
        .glow-text {
          animation: textGlow 3s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6 shadow-lg transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:block">
          <h2
            className="text-xl sm:text-2xl font-semibold cursor-pointer glow-text sm:cursor-default"
            onClick={() => setShowFilters(!showFilters)}
          >
            🔍 Filter Battles
          </h2>

          <button
            className="text-sm text-indigo-400 sm:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* Filter Form */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            showFilters ? "block" : "hidden"
          } sm:block`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Theme Filter */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-300 mb-1">Theme</label>
              <select
                name="themeId"
                value={filters.themeId}
                onChange={handleFilterChange}
                className="bg-gray-800 text-white p-2 rounded-lg border border-purple-600 focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Themes</option>
                {themes.map((theme) => (
                  <option key={theme._id} value={theme._id}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-300 mb-1">From Date</label>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="bg-gray-800 text-white p-2 rounded-lg border border-purple-600 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Date To */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-300 mb-1">To Date</label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="bg-gray-800 text-white p-2 rounded-lg border border-purple-600 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Reset Button */}
            <div className="flex flex-col justify-end">
              <button
                onClick={handleReset}
                className="relative bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                Reset Filters
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400 opacity-50 blur-xl animate-pulse z-[-1]"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSection;
