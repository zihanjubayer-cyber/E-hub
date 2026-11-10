import React from 'react';

const Icons = { Search: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> };

export default function Store({ 
  searchTerm, setSearchTerm, advancedFilters, setAdvancedFilters, 
  loading, filteredProducts, library, 
  handleGetFree, handleBuyNow, openPdf 
}) {
  
  // ফিল্টার রিসেট করার ফাংশন
  const clearFilters = () => {
    setSearchTerm('');
    setAdvancedFilters({ subject: 'All', chapter: 'All', writer: 'All', edition: 'All' });
  };

  const hasActiveFilters = searchTerm !== '' || advancedFilters.subject !== 'All' || advancedFilters.chapter !== 'All' || advancedFilters.writer !== 'All' || advancedFilters.edition !== 'All';

  return (
    <div className="animate-fade-in relative">
      
      {/* 🛑 Active Filters Notice */}
      {hasActiveFilters && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl mb-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-emerald-800">
            <span className="text-gray-500 mr-2">Applied Filters:</span>
            {advancedFilters.subject !== 'All' && <span className="bg-white px-3 py-1 rounded-full border border-emerald-100 shadow-sm">📂 {advancedFilters.subject}</span>}
            {advancedFilters.chapter !== 'All' && <span className="bg-white px-3 py-1 rounded-full border border-emerald-100 shadow-sm">📑 {advancedFilters.chapter}</span>}
            {advancedFilters.writer !== 'All' && <span className="bg-white px-3 py-1 rounded-full border border-emerald-100 shadow-sm">✍️ {advancedFilters.writer}</span>}
            {advancedFilters.edition !== 'All' && <span className="bg-white px-3 py-1 rounded-full border border-emerald-100 shadow-sm">📅 {advancedFilters.edition}</span>}
            {searchTerm !== '' && <span className="bg-white px-3 py-1 rounded-full border border-emerald-100 shadow-sm">🔍 "{searchTerm}"</span>}
          </div>
          <button onClick={clearFilters} className="bg-white text-red-500 hover:bg-red-50 hover:text-red-600 px-4 py-2 rounded-xl text-sm font-bold border border-red-100 shadow-sm transition">
            Clear Filters ✖
          </button>
        </div>
      )}

      {/* General Search Bar (Optional fallback in Store) */}
      <div className="relative mb-8 max-w-2xl mx-auto">
         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">{Icons.Search}</div>
         <input type="text" placeholder="Quick search directly here..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm transition font-semibold" />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-6xl mb-4">📭</span>
          <h3 className="text-2xl font-black text-gray-800 mb-2">No Notes Found!</h3>
          <p className="text-gray-500 font-medium mb-6">We couldn't find any notes matching your selected filters.</p>
          <button onClick={clearFilters} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition">See All Notes</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => {
            const inLibrary = library.some(item => item.id === product.id);
            const hasStats = product.pages || product.size || product.target;

            return (
              <div key={product.id} className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col relative group transform hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4 z-10">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">{product.category}</span>
                  <span className="text-3xl font-black text-gray-900">{product.isFree ? 'FREE' : `৳${product.price}`}</span>
                </div>
                
                <h3 className="font-extrabold text-2xl text-gray-800 leading-tight mb-2 z-10">{product.title}</h3>
                
                {product.writer && <p className="text-teal-600 font-bold text-sm mb-1 z-10 flex items-center gap-1">✍️ Writer: {product.writer}</p>}
                {product.edition && <p className="text-blue-700 font-bold text-xs mb-4 z-10 flex items-center gap-1 bg-blue-50 w-fit px-2 py-1 rounded border border-blue-100">📅 Edition: {product.edition}</p>}
                
                <p className="text-gray-500 text-sm mb-4 flex-grow z-10 line-clamp-3 leading-relaxed">{product.description}</p>
                
                {hasStats && (
                  <div className="grid grid-cols-3 gap-2 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100 z-10">
                    {product.pages ? <div className="text-center"><p className="text-[10px] text-gray-400 font-bold uppercase">Pages</p><p className="font-black text-gray-700 text-sm">📄 {product.pages}</p></div> : <div></div>}
                    {product.size ? <div className="text-center border-l border-r border-gray-200"><p className="text-[10px] text-gray-400 font-bold uppercase">Size</p><p className="font-black text-gray-700 text-sm">💾 {product.size}</p></div> : <div></div>}
                    {product.target ? <div className="text-center"><p className="text-[10px] text-gray-400 font-bold uppercase">Target</p><p className="font-black text-gray-700 text-sm">🎯 {product.target}</p></div> : <div></div>}
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
