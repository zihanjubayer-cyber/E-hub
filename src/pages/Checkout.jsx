import React, { useState } from 'react';

export default function Checkout({
  checkoutItem, setActiveTab, couponInput, setCouponInput, applyCoupon, appliedCoupon, storeSettings, handleCheckout
}) {
  const [copied, setCopied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bKash'); // পেমেন্ট মেথড স্টেট

  const currentNumber = paymentMethod === 'bKash' ? storeSettings?.bkashNumber : storeSettings?.nagadNumber;

  const handleCopyNumber = () => {
    if (currentNumber) {
      navigator.clipboard.writeText(currentNumber);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!checkoutItem) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-sm max-w-lg mx-auto mt-10">
         <h3 className="text-2xl font-bold text-gray-800">কোনো নোট সিলেক্ট করা হয়নি!</h3>
         <button onClick={() => setActiveTab('store')} className="mt-6 bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold">স্টোরে ফিরে যান</button>
      </div>
    );
  }

  const finalTotal = appliedCoupon ? checkoutItem.price - (checkoutItem.price * (appliedCoupon.discount / 100)) : checkoutItem.price;

  return (
     <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in mt-6">
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
           <h3 className="font-extrabold text-2xl mb-6 text-gray-900">Order Summary</h3>
           <div className="flex justify-between items-center border-b pb-6 mb-6">
              <div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase">{checkoutItem.category}</span>
                <p className="font-bold text-xl text-gray-800 mt-3">{checkoutItem.title}</p>
              </div>
              <p className="font-black text-2xl">৳{checkoutItem.price}</p>
           </div>
           
           <div className="flex justify-between items-center bg-gray-50 p-5 rounded-2xl border border-gray-200">
              <p className="font-bold text-gray-700 text-lg">Total to Pay:</p>
              <p className="font-black text-3xl text-emerald-600">৳{finalTotal}</p>
           </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
           <h3 className="font-extrabold text-2xl mb-4 text-gray-900">Payment & Verification</h3>
           
           {/* পেমেন্ট মেথড সিলেকশন */}
           <div className="flex gap-4 mb-6">
             <button onClick={() => setPaymentMethod('bKash')} className={`flex-1 py-3 rounded-xl font-bold border-2 transition ${paymentMethod === 'bKash' ? 'border-pink-500 bg-pink-50 text-pink-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>bKash</button>
             <button onClick={() => setPaymentMethod('Nagad')} className={`flex-1 py-3 rounded-xl font-bold border-2 transition ${paymentMethod === 'Nagad' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>Nagad</button>
           </div>

           <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl mb-8 text-emerald-900 text-sm leading-relaxed shadow-inner">
              <p className="font-extrabold mb-3 text-base border-b border-emerald-200 pb-2">কীভাবে পেমেন্ট করবেন?</p>
              <ul className="space-y-3 font-medium">
                 <li className="leading-loose">
                   ১. আপনার {paymentMethod} থেকে 
                   <span className="inline-flex items-center mx-2 bg-emerald-200 pl-3 pr-1 py-1 rounded-lg shadow-sm border border-emerald-300">
                     <b className="text-lg tracking-wider mr-2">{currentNumber || 'Not Set'}</b>
                     <button onClick={handleCopyNumber} className="bg-white hover:bg-emerald-50 px-2 py-1 rounded text-xs font-bold transition flex items-center gap-1 text-emerald-700">{copied ? '✅ Copied!' : '📋 Copy'}</button>
                   </span>
                   নাম্বারে ঠিক <b className="text-lg text-emerald-700">৳{finalTotal}</b> 'Send Money' করুন।
                 </li>
                 <li>২. টাকা পাঠানো হয়ে গেলে, যে নাম্বার থেকে পাঠিয়েছেন সেটি এবং Transaction ID (TrxID) নিচে দিয়ে সাবমিট করুন।</li>
              </ul>
           </div>
           
           <form onSubmit={handleCheckout} className="space-y-4">
              <input type="hidden" name="paymentMethod" value={paymentMethod} />
              <div>
                 <label className="block text-sm font-bold mb-2 text-gray-700">যে নাম্বার থেকে টাকা পাঠিয়েছেন</label>
                 <input type="text" name="phone" placeholder={`e.g. 017XXXXXXXX (${paymentMethod})`} required className="w-full border border-gray-300 p-4 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
              </div>
              <div>
                 <label className="block text-sm font-bold mb-2 text-gray-700">Transaction ID (TrxID)</label>
                 <input type="text" name="trxId" placeholder="e.g. 9JD8K2L..." required className="w-full border border-gray-300 p-4 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold" />
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-lg hover:bg-emerald-700 shadow-lg transition mt-4">Place Order</button>
           </form>
        </div>
     </div>
  );
}
