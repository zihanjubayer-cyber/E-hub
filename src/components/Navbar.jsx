import React from 'react';

export default function Navbar({ activeTab, setActiveTab, cartCount, user, handleLogout }) {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo / Brand */}
        <button 
          onClick={() => setActiveTab('store')} 
          className="text-2xl font-black text-gray-900 flex items-center gap-2 text-left"
        >
          <span className="bg-emerald-600 text-white p-2 rounded-xl text-lg">📚</span>
          <span>Solution Hub</span>
        </button>

        {/* Navigation Links */}
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => setActiveTab('store')} 
            className={`px-4 py-2 rounded-xl font-bold transition text-sm md:text-base ${activeTab === 'store' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Store
          </button>

          <button 
            onClick={() => setActiveTab('library')} 
            className={`px-4 py-2 rounded-xl font-bold transition text-sm md:text-base relative ${activeTab === 'library' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Library
          </button>

          <button 
            onClick={() => setActiveTab('cart')} 
            className={`px-4 py-2 rounded-xl font-bold transition text-sm md:text-base relative flex items-center gap-1 ${activeTab === 'cart' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            🛒 
            {cartCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-black animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Student Login / Profile State */}
          {user ? (
            <button 
              onClick={handleLogout} 
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-600 transition"
              title="Logout"
            >
              Logout
            </button>
          ) : (
            <button 
              onClick={() => setActiveTab('auth')} 
              className={`px-4 py-2 rounded-xl font-bold transition text-sm md:text-base ${activeTab === 'auth' ? 'bg-emerald-600 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
            >
              Login
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}
