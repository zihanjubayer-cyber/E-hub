import React, { useState } from 'react';

export default function Home({ products, setActiveTab, setSearchTerm, setSelectedCategory }) {
  const [localSearch, setLocalSearch] = useState('');

  const handleSmartSearch = (term, category = 'All') => {
    setSearchTerm(term);
    setSelectedCategory(category);
    setActiveTab('store');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if(localSearch.trim()) handleSmartSearch(localSearch);
  };

  // 🛑 ডেটাবেস থেকে ইউনিক ডেটা বের করা হচ্ছে
  const writers = [...new Set(products.map(p => p.writer).filter(Boolean))];
  const targets = [...new Set(products.map(p => p.target).filter(Boolean))];
  const editions = [...new Set(products.map(p => p.edition).filter(Boolean))];
  const chapters = [...new Set(products.map(p => p.title).filter(Boolean))].slice(0, 8);
  
  // 🛑 একদম নতুন আপলোড হওয়া ৩টি নোট
  const recentNotes = [...products].reverse().slice(0, 3);

  return (
    <div className="animate-fade-in space-y-12 pb-10">
      
      {/* 🛑 1. Gorgeous Hero Section */}
      <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-16 text-center text-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
         <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-gray-900 to-teal-900/80"></div>
         <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         
         <div className="relative z-10 space-y-6 w-full max-w-3xl">
             <span className="bg-emerald-500/20 text-emerald-300 font-bold px-5 py-2 rounded-full text-sm tracking-wider uppercase border border-emerald-500/30">
               HSC & Admission Solutions
             </span>
             <h2 className="text-4xl md:text-6xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                দেশের সেরা <span className="text-emerald-400">ডিজিটাল নোট</span> আর্কাইভ
             </h2>
             <p className="text-gray-300 text-lg md:text-xl">বোর্ড স্ট্যান্ডার্ড ১০০% নির্ভুল সমাধান। বিষয়, রাইটার বা টার্গেট লিখে সার্চ করো!</p>
             
             <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3 mt-8">
               <input type="text" placeholder="কী খুঁজছো? (যেমন: Physics, Giasuddin...)" value={localSearch} onChange={e => setLocalSearch(e.target.value)} className="w-full p-4 md:p-5 rounded-2xl text-gray-900 font-bold outline-none shadow-lg focus:ring-4 focus:ring-emerald-500/50 text-lg"/>
               <button type="submit" className="bg-emerald-500 text-gray-900 px-8 py-4 md:py-5 rounded-2xl font-black text-lg hover:bg-emerald-400 transition shadow-lg shrink-0">Search 🚀</button>
             </form>
         </div>
      </div>

      {/* 🛑 2. Floating Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto -mt-16 relative z-20 px-4">
         <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center gap-3 transform hover:-translate-y-1 transition">
            <span className="text-3xl">✅</span>
            <h4 className="font-extrabold text-gray-800 text-lg">১০০% নির্ভুল</h4>
         </div>
         <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center gap-3 transform hover:-translate-y-1 transition">
            <span className="text-3xl">⚡</span>
            <h4 className="font-extrabold text-gray-800 text-lg">ইনস্ট্যান্ট ডেলিভারি</h4>
         </div>
         <div className="bg-white p-5 rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center gap-3 transform hover:-translate-y-1 transition">
            <span className="text-3xl">📱</span>
            <h4 className="font-extrabold text-gray-800 text-lg">মোবাইল ফ্রেন্ডলি</h4>
         </div>
      </div>

      {/* 🛑 3. Beautiful Writer Cards */}
      {writers.length > 0 && (
        <div>
          <div className="flex justify-between items-end mb-6">
            <h3 className="font-black text-2xl text-gray-900">জনপ্রিয় রাইটার ✍️</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {writers.map((w, idx) => (
              <button key={w} onClick={() => handleSmartSearch(w)} className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-lg hover:border-emerald-200 transition text-center group flex flex-col items-center justify-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-transform group-hover:scale-110 ${['bg-blue-100 text-blue-500', 'bg-orange-100 text-orange-500', 'bg-purple-100 text-purple-500', 'bg-pink-100 text-pink-500'][idx % 4]}`}>
                  👨‍🏫
                </div>
                <span className="font-extrabold text-gray-700 group-hover:text-emerald-600 text-lg">{w}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 🛑 4. Colorful Chapter Gradients */}
      {chapters.length > 0 && (
        <div>
          <div className="flex justify-between items-end mb-6">
            <h3 className="font-black text-2xl text-gray-900">অধ্যায়সমূহ 📚</h3>
            <button onClick={() => setActiveTab('store')} className="text-emerald-600 font-bold hover:underline">সবগুলো দেখো &rarr;</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {chapters.map((c, idx) => (
              <button key={c} onClick={() => handleSmartSearch(c)} className={`text-left p-6 rounded-3xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 group bg-gradient-to-br ${['from-emerald-50 to-teal-50 border-emerald-100', 'from-blue-50 to-indigo-50 border-blue-100', 'from-orange-50 to-red-50 border-orange-100', 'from-fuchsia-50 to-pink-50 border-fuchsia-100'][idx % 4]} border`}>
                <h4 className="font-extrabold text-gray-800 text-xl group-hover:text-emerald-800 leading-tight">{c}</h4>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 🛑 5. Interactive Target & Edition Pills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {targets.length > 0 && (
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
             <h3 className="font-black text-xl text-gray-900 mb-5">টার্গেট ব্যাচ 🎯</h3>
             <div className="flex flex-wrap gap-3">
               {targets.map(t => (
                 <button key={t} onClick={() => handleSmartSearch(t)} className="bg-purple-50 text-purple-700 border border-purple-200 px-6 py-3 rounded-xl font-bold hover:bg-purple-600 hover:text-white transition shadow-sm text-lg">{t}</button>
               ))}
             </div>
           </div>
         )}
         {editions.length > 0 && (
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
             <h3 className="font-black text-xl text-gray-900 mb-5">বইয়ের এডিশন 📅</h3>
             <div className="flex flex-wrap gap-3">
               {editions.map(e => (
                 <button key={e} onClick={() => handleSmartSearch(e)} className="bg-blue-50 text-blue-700 border border-blue-200 px-6 py-3 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition shadow-sm text-lg">{e}</button>
               ))}
             </div>
           </div>
         )}
      </div>

      {/* 🛑 6. Dark Theme Recent Uploads Preview */}
      {recentNotes.length > 0 && (
        <div className="mt-8 bg-gray-900 rounded-[2rem] p-8 md:p-12 shadow-xl">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="font-black text-3xl text-white mb-2">🔥 লেটেস্ট নোটসমূহ</h3>
              <p className="text-gray-400">সদ্য আপলোড করা সেরা ম্যাটেরিয়ালগুলো</p>
            </div>
            <button onClick={() => setActiveTab('store')} className="hidden md:block bg-emerald-500 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-emerald-400 transition shadow-lg">Go to Store</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentNotes.map(p => (
              <div key={p.id} className="bg-gray-800 p-6 rounded-3xl border border-gray-700 hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all cursor-pointer transform hover:-translate-y-1" onClick={() => handleSmartSearch(p.title)}>
                <span className="text-xs font-black text-emerald-900 bg-emerald-400 px-3 py-1.5 rounded-full uppercase mb-4 inline-block">{p.category}</span>
                <h4 className="font-extrabold text-2xl text-white mb-2 leading-tight">{p.title}</h4>
                <p className="text-gray-400 text-sm mb-6">{p.writer ? `✍️ ${p.writer}` : 'Premium Note'}</p>
                <div className="flex justify-between items-center border-t border-gray-700 pt-4 mt-auto">
                   <p className="text-emerald-400 font-black text-2xl">{p.isFree ? 'FREE' : `৳${p.price}`}</p>
                   <span className="text-gray-500 font-bold hover:text-white transition">View &rarr;</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setActiveTab('store')} className="md:hidden w-full mt-6 bg-emerald-500 text-gray-900 px-6 py-4 rounded-xl font-black text-lg hover:bg-emerald-400 transition">Go to Store 🚀</button>
        </div>
      )}
    </div>
  );
}
