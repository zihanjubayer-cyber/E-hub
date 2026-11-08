import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function Auth({ showToast, setActiveTab }) {
  const [isLogin, setIsLogin] = useState(true); // লগইন নাকি সাইন-আপ মোড তা ট্র্যাক করবে
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // স্টুডেন্ট লগইন
        await signInWithEmailAndPassword(auth, email, password);
        showToast('Successfully logged in!');
      } else {
        // নতুন অ্যাকাউন্ট তৈরি (Sign Up)
        await createUserWithEmailAndPassword(auth, email, password);
        showToast('Account created successfully!');
      }
      setActiveTab('store'); // সফলভাবে লগইন বা সাইন-আপের পর স্টোরে নিয়ে যাবে
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-fade-in my-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-gray-900 mb-2">
          {isLogin ? 'Student Login' : 'Create Account'}
        </h2>
        <p className="text-gray-500 text-sm">
          {isLogin ? 'Access your digital library & purchased notes' : 'Join Solution Hub to start learning'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700">Email Address</label>
          <input 
            type="email" 
            required 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="student@gmail.com" 
            className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-700">Password</label>
          <input 
            type="password" 
            required 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="••••••••" 
            className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium" 
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition"
        >
          {isLogin ? 'Login to Library' : 'Sign Up'}
        </button>
      </form>

      <div className="text-center mt-6">
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="text-emerald-600 font-bold hover:underline text-sm"
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}
