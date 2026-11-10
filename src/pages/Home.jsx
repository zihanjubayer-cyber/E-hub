import React, { useState, useMemo } from 'react';

export default function Home({ products, setActiveTab, advancedFilters, setAdvancedFilters }) {
  // কোন পপআপ ওপেন হবে তার স্টেট
  const [activeModal, setActiveModal] = useState(null); 

  // ডায়নামিক ফিল্টার ডেটা বের করা হচ্ছে
  const categoriesList = [...new Set(products.map(p => p.category).filter(Boolean))];
  
  // যদি কোনো সাবজেক্ট সিলেক্ট করা থাকে, তবে শুধু সেই সাবজেক্টের চ্যাপ্টার দেখাবে। না হলে সব দেখাবে।
  const chapters = useMemo(() => {
    let filtered = products;
    if (advancedFilters.subject !== 'All') {
      filtered = products.filter(p => p.category === advancedFilters.subject);
    }
    return [...new Set(filtered.map(p => p.title).filter(Boolean))];
  }, [products, advancedFilters.subject]);

  const writers = [...new Set(products.map(p => p.writer).filter(Boolean))];
  const editions = [...new Set(products.map(p => p.edition).filter(Boolean))];
  const recentNotes = [...products].reverse().slice(0, 3);

  // পপআপ থেকে অপশন সিলেক্ট করার ফাংশন
  const handleSelectOption = (key, value) => {
    setAdvancedFilters(prev => ({ ...prev, [key]: value }));
    setActiveModal(null);
    
    // যদি সাবজেক্ট পরিবর্তন করা হয়, তবে আগের সিলেক্ট করা চ্যাপ্টার রিসেট হয়ে যাবে
    if (key === 'subject') {
      setAdvancedFilters(prev => ({ ...prev, chapter: 'All' }));
    }
  };

  // 🚀 Go বাটনে ক্লিক করলে স্টোরে নিয়ে যাবে
  const handleGoToStore = () => {
    setActiveTab('store');
  };

  return (
    <div className="animate-fade-in space-y-12 pb-10">
      
      {/* 🛑 Hero Section with Popup Triggers */}
      <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-16 text-center text-white shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
         <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-gray-900 to-teal-900/80"></div>
         <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         
         <div className="relative z-10 space-y-6 w-full max-w-4xl">
             <span className="bg-emerald-500/20 text-emerald-300 font-bold px-5 py-2 rounded-full text-sm tracking-wider uppercase border border-emerald-500/30">
               Advanced Search System
             </span>
             <h2 className="text-4xl md:text-5xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-8">
                তোমার পছন্দের <span className="text-emerald-400">বই ও অধ্যায়</span> নির্বাচন করো
             </h2>
             
             {/* 🛑 Selection Board */}
             <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 md:p-6 rounded-3xl shadow-xl max-w-3xl mx-auto flex flex-col gap-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Subject Trigger */}
                  <button onClick={() => setActiveModal('subject')} className="bg-white text-left p-4 rounded-2xl shadow-sm hover:shadow-md transition group border border-gray-100 hover:border-emerald-300">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Select Subject</p>
                    <p className="font-extrabold text-gray-800 text-lg group-hover:text-emerald-600">{advancedFilters.subject === 'All' ? 'সব বিষয় 📂' : advancedFilters.subject}</p>
                  </button>
                  
                  {/* Chapter Trigger */}
                  <button onClick={() => setActiveModal('chapter')} className="bg-white text-left p-4 rounded-2xl shadow-sm hover:shadow-md transition group border border-gray-100 hover:border-emerald-300">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Select Chapter</p>
                    <p className="font-extrabold text-gray-800 text-lg group-hover:text-emerald-600 truncate">{advancedFilters.chapter === 'All' ? 'সব অধ্যায় 📑' : advancedFilters.chapter}</p>
                  </button>

                  {/* Writer Trigger */}
                  <button onClick={() => setActiveModal('writer')} className="bg-white text-left p-4 rounded-2xl shadow-sm hover:shadow-md transition group border border-gray-100 hover:border-emerald-300">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Writer</p>
                    <p className="font-extrabold text-gray-800 text-lg group-hover:text-emerald-600 truncate">{advancedFilters.writer === 'All' ? 'যেকোনো রাইটার ✍️' : advancedFilters.writer}</p>
                  </button>

                  {/* Edition Trigger */}
                  <button onClick={() => setActiveModal('edition')} className="bg-white text-left p-4 rounded-2xl shadow-sm hover:shadow-md transition group border border-gray-100 hover:border-emerald-300">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Year / Edition</p>
                    <p className="font-extrabold text-gray-800 text-lg group-hover:text-emerald-600">{advancedFilters.edition === 'All' ? 'সব এডিশন 📅' : advancedFilters.edition}</p>
                  </button>
                </div>

                {/* 🚀 GO Button */}
                <button onClick={handleGoToStore} className="w-full bg-emerald-500 text-gray-900 py-4 rounded-2xl font-black text-xl hover:bg-emerald-400 transition shadow-lg mt-2">
                  Go &rarr; Find Notes
                </button>
             </div>
         </div>
      </div>

      {/* 🛑 POPUP MODALS */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-t-3xl md:rounded-3xl p-6 shadow-2xl relative max-h-[80vh] flex flex-col">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 w-8 h-8 rounded-full font-bold transition">&times;</button>
            
            <h3 className="font-black text-2xl text-gray-900 mb-6 border-b pb-4">
              {activeModal === 'subject' && 'বিষয় নির্বাচন করুন 📂'}
              {activeModal === 'chapter' && 'অধ্যায় নির্বাচন করুন 📑'}
              {activeModal === 'writer' && 'রাইটার নির্বাচন করুন ✍️'}
              {activeModal === 'edition' && 'এডিশন নির্বাচন করুন 📅'}
            </h3>

            <div className="overflow-y-auto pr-2 space-y-3 flex-grow custom-scrollbar">
              
              <button onClick={() => handleSelectOption(activeModal, 'All')} className={`w-full text-left p-4 rounded-xl font-bold transition border-2 ${advancedFilters[activeModal] === 'All' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-300'}`}>
                {activeModal === 'chapter' ? 'সকল অধ্যায়' : 'সবগুলো (All)'}
              </button>

              {activeModal === 'subject' && categoriesList.map(cat => (
                <button key={cat} onClick={() => handleSelectOption('subject', cat)} className={`w-full text-left p-4 rounded-xl font-bold transition border-2 ${advancedFilters.subject === cat ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-100 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'}`}>{cat}</button>
              ))}

              {activeModal === 'chapter' && chapters.map(chap => (
                <button key={chap} onClick={() => handleSelectOption('chapter', chap)} className={`w-full text-left p-4 rounded-xl font-bold transition border-2 ${advancedFilters.chapter === chap ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-100 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'}`}>{chap}</button>
              ))}

              {activeModal === 'writer' && writers.map(writer => (
                <button key={writer} onClick={() => handleSelectOption('writer', writer)} className={`w-full text-left p-4 rounded-xl font-bold transition border-2 ${advancedFilters.writer === writer ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-100 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'}`}>{writer}</button>
              ))}

              {activeModal === 'edition' && editions.map(ed => (
                <button key={ed} onClick={() => handleSelectOption('edition', ed)} className={`w-full text-left p-4 rounded-xl font-bold transition border-2 ${advancedFilters.edition === ed ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-100 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'}`}>{ed}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 🛑 Recent Uploads */}
      {recentNotes.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-end mb-6 px-4">
            <h3 className="font-black text-2xl text-gray-900 border-l-4 border-emerald-500 pl-3">🔥 লেটেস্ট আপলোড</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            {recentNotes.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col group">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider mb-4 self-start">{p.category}</span>
                <h4 className="font-extrabold text-xl text-gray-900 mb-2 leading-tight group-hover:text-emerald-600 transition">{p.title}</h4>
                <p className="text-gray-500 text-sm mb-6 flex-grow">{p.writer ? `✍️ ${p.writer}` : 'Premium Edition'}</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                   <p className="text-emerald-600 font-black text-xl">{p.isFree ? 'FREE' : `৳${p.price}`}</p>
                   <button onClick={() => { setAdvancedFilters({subject: p.category, chapter: p.title, writer: 'All', edition: 'All'}); setActiveTab('store'); }} className="text-sm font-bold text-gray-400 group-hover:text-emerald-600 transition">Go to note &rarr;</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
