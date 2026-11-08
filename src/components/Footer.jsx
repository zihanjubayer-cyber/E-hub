import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-5xl mx-auto p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 font-medium text-sm">© {new Date().getFullYear()} HSC Solution Hub. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="text-gray-400 hover:text-emerald-600 transition">Facebook</a>
          <a href="#" className="text-gray-400 hover:text-emerald-600 transition">YouTube</a>
          <a href="#" className="text-gray-400 hover:text-emerald-600 transition">Support</a>
        </div>
      </div>
    </footer>
  );
}
