import React, { useState } from 'react';

export default function Checkout({
  checkoutItem, setActiveTab, couponInput, setCouponInput, applyCoupon, appliedCoupon, removeCoupon, storeSettings, handleCheckout
}) {
  const [copied, setCopied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bKash');

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

  // 🛑 ডিসকাউন্ট লজিক
  const discountAmount = appliedCoupon ? (checkoutItem.price * (appliedCoupon.discount / 100)) : 0;
  const finalTotal = checkoutItem.price - discountAmount;

  return (
     <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in mt-6">
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
           <h3 className="font-extrabold text-2xl mb-6 text-gray-900">Order Summary</h3>
           <div className="flex justify-between items-center border-b pb-6 mb-6">
              <div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase">{checkoutItem.category}</span>
                <p className="font-bold text-xl text-gray-800 mt-3">{checkoutItem.title}</p>
              </div>
              <p className="font-black text-2xl text-gray-900">৳{checkoutItem.price}</p>
           </div>
           
           {/* 🛑 কুপন অ্যাপ্লাই করার ফিল্ড */}
           <div className="mb-6">
             {appliedCoupon ? (
               <div className="flex justify-between items-center bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                 <div>
                   <p className="text-emerald-800 font-bold flex items-center gap-2"><span className="text-xl">🎉</span> Coupon Applied!</p>
                   <p className="text-emerald-600 text-sm font-semibold">{appliedCoupon.code} ({appliedCoupon.discount}% Off)</p>
                 </div>
                 <button onClick={removeCoupon} className="text-red-500 hover:text-red-700 font-bold text-sm bg-white px-3 py-1 border border-red-100 rounded-lg shadow-sm transition">Remove</button>
               </div>
             ) : (
               <div className="flex gap-2">
                 <input type="text" placeholder="Have a Coupon Code?" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} className="border border-gray-300 p-3 rounded-xl flex-1 outline-none uppercase focus:ring-2 focus:ring-gray-800 font-bold text-gray-700" />
                 <button onClick={applyCoupon} className="bg-gray-900 text-white px-6 rounded-xl font-bold hover:bg-black shadow-md transition">Apply</button>
               </div>
             )}
           </div>

           <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3">
              <div className="flex justify-between items-center text-gray-500 font-medium">
                <p>Subtotal:</p>
                <p>৳{checkoutItem.price}</p>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between items-center text-emerald-600 font-bold">
                  <p>Discount:</p>
                  <p>- ৳{discountAmount.toFixed(0)}</p>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <p className="font-bold text-gray-700 text-lg">Total to Pay:</p>
                <p className="font-black text-3xl text-emerald-600">৳{finalTotal.toFixed(0)}</p>
              </div>
           </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
           <h3 className="font-extrabold text-2xl mb-4 text-gray-900">Payment & Verification</h3>
           
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
                   নাম্বারে ঠিক <b className="text-lg text-emerald-700">৳{finalTotal.toFixed(0)}</b> 'Send Money' করুন।
                 </li>
                 <li>২. টাকা পাঠানো হয়ে গেলে, যে নাম্বার থেকে পাঠিয়েছেন সেটি এবং Transaction ID (TrxID) নিচে দিয়ে সাবমিট করুন।</li>
                <li>২. অর্ডারটি অ্যাডমিন অ্যাপ্রুভ করার সাথে সাথেই আপনার অ্যাকাউন্টের লাইব্রেরিতে পিডিএফটি যুক্ত হয়ে যাবে।</li>
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
