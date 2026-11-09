import React, { useState } from 'react';

export default function Home({ products, setActiveTab, setSearchTerm, setSelectedCategory }) {
  const [localSearch, setLocalSearch] = useState('');

  // 🛑 স্মার্ট সার্চ লজিক: ফিল্টার সেট করে ডিরেক্ট স্টোরে পাঠিয়ে দেবে
  const handleSmartSearch = (term) => {
    setSearchTerm(term);
    setSelectedCategory('All');
    setActiveTab('store');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if(localSearch.trim()) handleSmartSearch(localSearch);
  };

  // 🛑 ডেটাবেস থেকে ডায়নামিক ভাবে ইউনিক রাইটার, টার্গেট এবং এডিশন বের করা হচ্ছে
  const writers = [...new Set(products.map(p => p.writer).filter(Boolean))];
  const targets = [...new Set(products.map(p => p.target).filter(Boolean))];
  const editions = [...new Set(products.map(p => p.edition).filter(Boolean))];
  const chapters = [...new Set(products.map(p => p.title).filter(Boolean))].slice(0, 8); // প্রথম ৮টি চ্যাপ্টার

  return (
    <div className="animate-fade-in space-y-10">
      
      {/* 🛑 Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900 rounded-3xl p-10 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         <h2 className="text-4xl md:text-6xl font-black mb-6 relative z-10 leading-tight">The Ultimate <br/><span className="text-emerald-400">Educational Archive</span></h2>
         <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto relative z-10 mb-10">Find exactly what you need in seconds. Search by Chapter, Writer, Edition, or Target Batch.</p>
         
         <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto relative z-10 flex gap-2">
           <input type="text" placeholder="e.g. Physics, 2024-25, Giasuddin..." value={localSearch} onChange={e => setLocalSearch(e.target.value)} className="w-full p-5 rounded-2xl text-gray-800 font-bold outline-none shadow-xl focus:ring-4 focus:ring-emerald-500 text-lg"/>
           <button type="submit" className="bg-emerald-500 text-white px-8 md:px-10 rounded-2xl font-black text-lg hover:bg-emerald-600 transition shadow-xl">Search</button>
         </form>
      </div>

      {/* 🛑 Smart Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Writer Wise */}
        {writers.length > 0 && (
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-extrabold text-xl mb-5 text-gray-800 flex items-center gap-2">✍️ Browse by Writer</h3>
            <div className="flex flex-wrap gap-3">
              {writers.map(w => (
                <button key={w} onClick={() => handleSmartSearch(w)} className="bg-gray-50 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition shadow-sm">{w}</button>
              ))}
            </div>
          </div>
        )}

        {/* Target Wise */}
        {targets.length > 0 && (
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-extrabold text-xl mb-5 text-gray-800 flex items-center gap-2">🎯 Target Batch / Year</h3>
            <div className="flex flex-wrap gap-3">
              {targets.map(t => (
                <button key={t} onClick={() => handleSmartSearch(t)} className="bg-gray-50 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 transition shadow-sm">{t}</button>
              ))}
            </div>
          </div>
        )}

        {/* Edition Wise */}
        {editions.length > 0 && (
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-extrabold text-xl mb-5 text-gray-800 flex items-center gap-2">📅 Book Edition</h3>
            <div className="flex flex-wrap gap-3">
              {editions.map(e => (
                <button key={e} onClick={() => handleSmartSearch(e)} className="bg-gray-50 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition shadow-sm">{e}</button>
              ))}
            </div>
          </div>
        )}

         {/* Chapter Wise */}
         {chapters.length > 0 && (
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-extrabold text-xl mb-5 text-gray-800 flex items-center gap-2">📚 Chapter Wise</h3>
            <div className="flex flex-wrap gap-3">
              {chapters.map(c => (
                <button key={c} onClick={() => handleSmartSearch(c)} className="bg-gray-50 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 transition shadow-sm">{c}</button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
