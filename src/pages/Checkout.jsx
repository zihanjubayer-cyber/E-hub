import React, { useState } from 'react';

export default function Checkout({
  checkoutItem, setActiveTab, couponInput, setCouponInput, applyCoupon, appliedCoupon, storeSettings, handleCheckout
}) {
  const [copied, setCopied] = useState(false);

  // নাম্বার কপি করার ফাংশন
  const handleCopyNumber = () => {
    if (storeSettings?.paymentNumber) {
      navigator.clipboard.writeText(storeSettings.paymentNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // ২ সেকেন্ড পর আবার আগের অবস্থায় ফিরে যাবে
    }
  };

  if (!checkoutItem) {
    return (
      <div className="text-center py-20 animate-fade-in bg-white rounded-3xl shadow-sm border border-gray-100 max-w-lg mx-auto mt-10">
         <h3 className="text-2xl font-bold text-gray-800">কোনো নোট সিলেক্ট করা হয়নি!</h3>
         <button onClick={() => setActiveTab('store')} className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition">স্টোরে ফিরে যান</button>
      </div>
    );
  }

  const finalTotal = appliedCoupon 
    ? checkoutItem.price - (checkoutItem.price * (appliedCoupon.discount / 100)) 
    : checkoutItem.price;

  return (
     <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in mt-6">
        {/* Left: Product Info */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
           <h3 className="font-extrabold text-2xl mb-6 text-gray-900">Order Summary</h3>
           <div className="flex justify-between items-center border-b pb-6 mb-6">
              <div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase">{checkoutItem.category}</span>
                <p className="font-bold text-xl text-gray-800 mt-3">{checkoutItem.title}</p>
              </div>
              <p className="font-black text-2xl">৳{checkoutItem.price}</p>
           </div>
           
           <div className="flex gap-2 mb-6">
             <input type="text" placeholder="Coupon Code" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} className="border p-3 rounded-xl flex-1 outline-none uppercase focus:ring-2 focus:ring-emerald-500 font-bold" />
             <button onClick={applyCoupon} className="bg-gray-900 text-white px-6 rounded-xl font-bold hover:bg-black transition">Apply</button>
           </div>
           
           <div className="flex justify-between items-center bg-gray-50 p-5 rounded-2xl border border-gray-200">
              <p className="font-bold text-gray-700 text-lg">Total to Pay:</p>
              <p className="font-black text-3xl text-emerald-600">৳{finalTotal}</p>
           </div>
        </div>

        {/* Right: Payment Info */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
           <h3 className="font-extrabold text-2xl mb-4 text-gray-900">Payment & Verification</h3>
           
           <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl mb-8 text-emerald-900 text-sm leading-relaxed shadow-inner">
              <p className="font-extrabold mb-3 text-base border-b border-emerald-200 pb-2">কীভাবে পেমেন্ট করবেন?</p>
              <ul className="space-y-3 font-medium">
                 <li className="leading-loose">
                   ১. আপনার বিকাশ বা নগদ থেকে 
                   <span className="inline-flex items-center mx-2 bg-emerald-200 pl-3 pr-1 py-1 rounded-lg shadow-sm border border-emerald-300">
                     <b className="text-lg tracking-wider mr-2">{storeSettings?.paymentNumber}</b>
                     <button onClick={handleCopyNumber} className="bg-white hover:bg-emerald-50 px-2 py-1 rounded text-xs font-bold transition flex items-center gap-1 text-emerald-700" title="Copy Number">
                       {copied ? '✅ Copied!' : '📋 Copy'}
                     </button>
                   </span>
                   নাম্বারে ঠিক <b className="text-lg text-emerald-700">৳{finalTotal}</b> 'Send Money' করুন।
                 </li>
                 <li>২. টাকা পাঠানো হয়ে গেলে, যে নাম্বার থেকে টাকা পাঠিয়েছেন সেটি এবং Transaction ID (TrxID) নিচের বক্সে দিয়ে ফর্মটি সাবমিট করুন।</li>
                 <li className="bg-white p-3 rounded-xl border border-emerald-100 text-emerald-800 text-xs font-bold flex gap-2 items-start mt-2">
                    <span className="text-lg">✨</span>
                    অর্ডারটি অ্যাডমিন অ্যাপ্রুভ করার সাথে সাথেই নোটটি আপনার 'Library'-তে যুক্ত হয়ে যাবে!
                 </li>
              </ul>
           </div>
           
           <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                 <label className="block text-sm font-bold mb-2 text-gray-700">যে নাম্বার থেকে টাকা পাঠিয়েছেন (bKash/Nagad)</label>
                 <input type="text" name="phone" placeholder="যেমন: 017XXXXXXXX" required className="w-full border border-gray-300 p-4 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-gray-700" />
              </div>
              <div>
                 <label className="block text-sm font-bold mb-2 text-gray-700">Transaction ID (TrxID)</label>
                 <input type="text" name="trxId" placeholder="যেমন: 9JD8K2L..." required className="w-full border border-gray-300 p-4 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-gray-700" />
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-lg hover:bg-emerald-700 shadow-lg transition mt-4">Place Order</button>
           </form>
        </div>
     </div>
  );
}
