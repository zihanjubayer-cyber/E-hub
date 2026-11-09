import React from 'react';

const Icons = { Search: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> };

export default function Store({ 
  searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, 
  loading, filteredProducts, library, 
  handleGetFree, handleBuyNow, openPdf 
}) {
  const categories = [
    'All', 'Physics I', 'Physics II', 
    'Chemistry I', 'Chemistry II', 
    'Higher Math I', 'Higher Math II', 
    'Admission Special', 'Full Book Solution Bundle'
  ];

  return (
    <div className="animate-fade-in relative">
      <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl p-8 md:p-12 text-center text-white mb-8 shadow-xl relative overflow-hidden">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 relative z-10">Premium Notes & Solutions</h2>
        <p className="text-emerald-100 text-lg max-w-2xl mx-auto relative z-10">Top quality board standard materials by expert writers.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{Icons.Search}</div>
          <input type="text" placeholder="Search for notes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm transition" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar scroll-smooth">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`whitespace-nowrap px-5 py-3 rounded-xl font-bold transition shadow-sm ${selectedCategory === cat ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 🛑 6. Why Choose Us Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <span className="text-3xl">📖</span>
          <p className="font-bold text-emerald-900 text-sm leading-tight">100% Board Standard Correct Solutions</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <span className="text-3xl">💻</span>
          <p className="font-bold text-blue-900 text-sm leading-tight">Clear PDF: Mobile & PC Friendly</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <span className="text-3xl">⚡</span>
          <p className="font-bold text-amber-900 text-sm leading-tight">Instant Auto-Delivery to Library</p>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xl font-semibold">No notes found!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => {
            const inLibrary = library.some(item => item.id === product.id);
            const hasStats = product.pages || product.size || product.target;

            return (
              <div key={product.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col relative group transform hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4 z-10">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">{product.category}</span>
                  <span className="text-3xl font-black text-gray-900">{product.isFree ? 'FREE' : `৳${product.price}`}</span>
                </div>
                
                <h3 className="font-extrabold text-2xl text-gray-800 leading-tight mb-2 z-10">{product.title}</h3>
                
                {product.writer && <p className="text-teal-600 font-semibold text-sm mb-1 z-10 flex items-center gap-1">✍️ Writer: {product.writer}</p>}
                
                {/* 🛑 Edition Tag */}
                {product.edition && <p className="text-blue-700 font-bold text-xs mb-4 z-10 flex items-center gap-1 bg-blue-50 w-fit px-2 py-1 rounded border border-blue-100">📅 Edition: {product.edition}</p>}
                
                <p className="text-gray-500 text-sm mb-4 flex-grow z-10 line-clamp-3 leading-relaxed">{product.description}</p>
                
                {/* 🛑 Quick Stats Grid */}
                {hasStats && (
                  <div className="grid grid-cols-3 gap-2 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-200 z-10">
                    {product.pages ? <div className="text-center"><p className="text-[10px] text-gray-500 font-bold uppercase">Pages</p><p className="font-black text-gray-800 text-sm">📄 {product.pages}</p></div> : <div></div>}
                    {product.size ? <div className="text-center border-l border-r border-gray-200"><p className="text-[10px] text-gray-500 font-bold uppercase">Size</p><p className="font-black text-gray-800 text-sm">💾 {product.size}</p></div> : <div></div>}
                    {product.target ? <div className="text-center"><p className="text-[10px] text-gray-500 font-bold uppercase">Target</p><p className="font-black text-gray-800 text-sm">🎯 {product.target}</p></div> : <div></div>}
                  </div>
                )}
                
                <div className="space-y-3 mt-auto z-10">
                  {product.demoLink && (
                    <button onClick={() => openPdf(product.demoLink, `${product.title} - Demo`)} className="w-full flex justify-center items-center gap-2 border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition">
                      View Demo PDF
                    </button>
                  )}
                  <button onClick={() => product.isFree ? handleGetFree(product) : handleBuyNow(product)} disabled={inLibrary} className={`w-full font-bold py-3 rounded-xl shadow transition flex justify-center items-center gap-2 ${inLibrary ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : (product.isFree ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white')}`}>
                    {inLibrary ? '✓ Owned in Library' : (product.isFree ? '📥 Get for Free' : '💳 Buy Now')}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}
