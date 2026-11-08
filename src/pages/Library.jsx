import React from 'react';

export default function Library({ library, openPdf }) { // মেইন ফাইল থেকে openPdf রিসিভ করা হলো
  return (
    <div className="max-w-4xl mx-auto animate-fade-in relative">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-900">My Digital Library</h2>
      {library.length === 0 ? (
         <div className="bg-white p-16 text-center rounded-3xl border border-gray-100 shadow-sm">
           <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
           </div>
           <h3 className="text-2xl font-bold text-gray-800 mb-2">Your library is empty</h3>
           <p className="text-gray-500 text-lg max-w-md mx-auto">Purchase premium notes or grab the free ones from the store to access them here.</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {library.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500 flex flex-col hover:shadow-md transition">
              <span className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">{item.category}</span>
              <h3 className="font-extrabold text-xl mb-6 text-gray-800">{item.title}</h3>
              {/* মেইন পিডিএফে ক্লিক করলে openPdf ট্রিগার হবে */}
              <button 
                onClick={() => openPdf(item.mainLink, item.title)} 
                className="mt-auto w-full text-center bg-gray-900 text-white hover:bg-gray-800 font-bold py-3 rounded-xl transition flex justify-center items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> Access Material
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
