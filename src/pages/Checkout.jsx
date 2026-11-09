import React from 'react';

export default function Checkout({
  checkoutItem, setActiveTab, couponInput, setCouponInput, applyCoupon, appliedCoupon, storeSettings, handleCheckout
}) {
  if (!checkoutItem) {
    return (
      <div className="text-center py-20 animate-fade-in bg-white rounded-3xl shadow-sm border border-gray-100 max-w-lg mx-auto mt-10">
         <h3 className="text-2xl font-bold text-gray-800">No item selected!</h3>
         <button onClick={() => setActiveTab('store')} className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition">Go to Store</button>
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
           <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl mb-8 text-emerald-900 text-sm leading-relaxed">
              <p className="font-bold mb-2 text-base">How to pay:</p>
              <p>1. Send exactly <b className="text-lg">৳{finalTotal}</b> to <b className="text-lg bg-emerald-200 px-2 py-0.5 rounded">{storeSettings?.paymentNumber}</b> via bKash/Nagad Send Money.</p>
              <p className="mt-2">2. Enter your Phone Number & Transaction ID below to verify your purchase.</p>
           </div>
           
           <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                 <label className="block text-sm font-bold mb-2 text-gray-700">Payment Number (bKash/Nagad)</label>
                 <input type="text" name="phone" placeholder="e.g. 017XXXXXXXX" required className="w-full border border-gray-300 p-4 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-gray-700" />
              </div>
              <div>
                 <label className="block text-sm font-bold mb-2 text-gray-700">Transaction ID (TrxID)</label>
                 <input type="text" name="trxId" placeholder="e.g. 9JD8K2L..." required className="w-full border border-gray-300 p-4 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-gray-700" />
              </div>
              <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-lg hover:bg-emerald-700 shadow-lg transition mt-4">Place Order</button>
           </form>
        </div>
     </div>
  );
}
