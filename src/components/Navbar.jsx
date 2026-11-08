import React from 'react';

const Icons = {
  Store: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Library: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  Cart: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Lock: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
};

export default function Navbar({ activeTab, setActiveTab, cartCount }) {
  return (
    <nav className="bg-white shadow-sm p-4 sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 cursor-pointer" onClick={() => setActiveTab('store')}>
          Solution Hub
        </h1>
        <div className="flex gap-2 md:gap-4 items-center">
          <button onClick={() => setActiveTab('store')} className={`flex items-center p-2 rounded-lg font-bold transition ${activeTab === 'store' ? 'text-emerald-700 bg-emerald-50' : 'text-gray-500 hover:bg-gray-100'}`}>
            {Icons.Store} <span className="hidden md:inline">Store</span>
          </button>
          <button onClick={() => setActiveTab('library')} className={`flex items-center p-2 rounded-lg font-bold transition ${activeTab === 'library' ? 'text-emerald-700 bg-emerald-50' : 'text-gray-500 hover:bg-gray-100'}`}>
            {Icons.Library} <span className="hidden md:inline">Library</span>
          </button>
          <button onClick={() => setActiveTab('cart')} className={`flex items-center p-2 rounded-lg font-bold transition ${activeTab === 'cart' ? 'text-emerald-700 bg-emerald-50' : 'text-gray-500 hover:bg-gray-100'}`}>
            {Icons.Cart} <span className="hidden md:inline">Cart</span>
            {cartCount > 0 && <span className="ml-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{cartCount}</span>}
          </button>
          <div className="h-6 w-px bg-gray-200 mx-1"></div>
          <button onClick={() => setActiveTab('admin')} className={`p-2 rounded-lg transition ${activeTab === 'admin' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-100'}`}>
            {Icons.Lock}
          </button>
        </div>
      </div>
    </nav>
  );
}
