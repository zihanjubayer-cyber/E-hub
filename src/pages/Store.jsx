import React from 'react';

const Icons = {
  Search: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Cart: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
};

export default function Store({ 
  searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, 
  loading, filteredProducts, cart, setCart, library, 
  handleGetFree, showToast, openPdf // মেইন ফাইল থেকে openPdf রিসিভ করা হলো
}) {
  return (
    <div className="animate-fade-in relative">
      <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl p-8 md:p-12 text-center text-white mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 relative z-10">Premium Notes & Solutions</h2>
        <p className="text-emerald-100 text-lg max-w-2xl mx-auto relative z-10">Top quality board standard materials by expert writers. Unlock your highest potential.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {Icons.Search}
          </div>
          <input 
            type="text" placeholder="Search for notes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm transition"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {['All', 'Physics', 'Chemistry', 'Higher Math', 'Admission Special'].map(cat => (
            <button 
              key={cat} onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-5 py-3 rounded-xl font-bold transition shadow-sm ${selectedCategory === cat ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <svg className="mx-auto h-24 w-24 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-gray-500 text-xl font-semibold">No notes found!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => {
            const inCart = cart.some(item => item.id === product.id);
            const inLibrary = library.some(item => item.id === product.id);

            return (
              <div key={product.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col relative group transform hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
                
                <div className="flex justify-between items-start mb-4 z-10">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">{product.category}</span>
                  <span className="text-3xl font-black text-gray-900">{product.isFree ? 'FREE' : `৳${product.price}`}</span>
                </div>
                
                <h3 className="font-extrabold text-2xl text-gray-800 leading-tight mb-2 z-10">{product.title}</h3>
                {product.writer && <p className="text-teal-600 font-semibold text-sm mb-3 z-10 flex items-center gap-1"><span className="text-lg">✍️</span> Writer: {product.writer}</p>}
                <p className="text-gray-500 text-sm mb-8 flex-grow z-10 line-clamp-3 leading-relaxed">{product.description}</p>
                
                <div className="space-y-3 mt-auto z-10">
                  {/* ডেমো লিংকে ক্লিক করলে openPdf ট্রিগার হবে */}
                  {product.demoLink && (
                    <button 
                      onClick={() => openPdf(product.demoLink, `${product.title} - Demo`)} 
                      className="w-full flex justify-center items-center gap-2 border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> View Demo PDF
                    </button>
                  )}

                  {product.isFree ? (
                    <button onClick={() => handleGetFree(product)} disabled={inLibrary} className={`w-full font-bold py-3 rounded-xl shadow transition flex justify-center items-center gap-2 ${inLibrary ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'}`}>
                      {inLibrary ? '✓ Added to Library' : '📥 Get for Free'}
                    </button>
                  ) : (
                    <button onClick={() => { if(!inCart) { setCart([...cart, product]); showToast('Added to cart!'); } }} disabled={inCart} className={`w-full font-bold py-3 rounded-xl shadow transition flex justify-center items-center gap-2 ${inCart ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg'}`}>
                      {inCart ? '✓ In Cart' : <>{Icons.Cart} Add to Cart</>}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}
