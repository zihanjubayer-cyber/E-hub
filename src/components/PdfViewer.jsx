import React from 'react';

export default function PdfViewer({ isOpen, onClose, pdfUrl, title }) {
  if (!isOpen) return null;

  // গুগল ড্রাইভের যেকোনো ফরম্যাটের লিংককে পারফেক্ট এমবেড লিংকে রূপান্তর করার স্মার্ট ফাংশন
  const getEmbedUrl = (url) => {
    if (!url) return '';
    
    // যদি লিংকটি গুগল ড্রাইভের হয়
    if (url.includes('drive.google.com')) {
      // যদি লিংকে /file/d/ FILE_ID /view থাকে, তবে সেটাকে /file/d/ FILE_ID /preview এ রূপান্তর করবে
      if (url.includes('/file/d/')) {
        const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (fileIdMatch && fileIdMatch[1]) {
          return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
        }
      }
      // অন্যথায় সাধারণ /view বা edit অংশ কেটে preview বসিয়ে দেবে
      return url.replace(/\/view.*$/, '/preview').replace(/\/edit.*$/, '/preview');
    }
    
    return url;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-900 animate-fade-in">
      {/* Top Navbar for Viewer */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-lg z-10">
        <h3 className="font-bold text-lg md:text-xl truncate max-w-[50%] text-emerald-400">
          📄 {title || 'Document Viewer'}
        </h3>
        
        <div className="flex gap-3">
          <a 
            href={pdfUrl} 
            target="_blank" 
            rel="noreferrer"
            download
            className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> 
            <span className="hidden md:inline">Download</span>
          </a>
          <button 
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-bold text-sm transition flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            Close
          </button>
        </div>
      </div>
      
      {/* PDF Iframe Display */}
      <div className="flex-grow w-full h-full bg-gray-100 relative">
        <iframe 
          src={getEmbedUrl(pdfUrl)} 
          title={title}
          className="w-full h-full border-none relative z-10"
          allow="autoplay"
        ></iframe>
      </div>
    </div>
  );
}
