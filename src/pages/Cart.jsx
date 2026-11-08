import React from 'react';

const Icons = {
  Cart: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Trash: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
};

export default function Cart({ 
  cart, 
  removeFromCart, 
  setActiveTab, 
  couponInput, 
  setCouponInput, 
  applyCoupon, 
  appliedCoupon, 
  cartTotal, 
  finalTotal, 
  storeSettings, 
  handleCheckout 
}) {
  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 max-w-3xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-900 border-b pb-4">Secure Checkout</h2>
      {cart.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            {Icons.Cart}
          </div>
          <p className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</p>
          <p className="text-gray-500 mb-6">Looks like you haven't added any premium notes yet.</p>
          <button onClick={() => setActiveTab('store')} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow hover:bg-emerald-700 transition">Explore Store</button>
        </div>
      ) : (
        <div>
          <div className="space-y-4 mb-8">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-emerald-200 transition">
                <div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded mb-1 inline-block">{item.category}</span>
                  <h4 className="font-bold text-lg text-gray-800">{item.title}</h4>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-black text-xl text-gray-900">৳{item.price}</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition p-2 bg-gray-50 rounded-lg hover:bg-red-50">
                    {Icons.Trash}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 mb-8">
            <input type="text" value={couponInput} onChange={e => setCouponInput(e.target.value)} placeholder="Enter Promo Code" className="flex-1 border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none uppercase font-semibold text-gray-700"/>
            <button onClick={applyCoupon} className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-bold transition">Apply</button>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
            <div className="flex justify-between mb-3 text-gray-600 font-medium">
              <span>Subtotal</span><span>৳{cartTotal}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between mb-3 text-emerald-600 font-bold">
                <span>Discount ({appliedCoupon.code})</span><span>- ৳{cartTotal * (appliedCoupon.discount / 100)}</span>
              </div>
            )}
            <div className="flex justify-between font-black text-3xl mt-4 pt-4 border-t border-gray-200 text-gray-900">
              <span>Total</span><span className="text-emerald-600">৳{finalTotal}</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-6 rounded-2xl mb-8">
            <p className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Payment Instructions
            </p>
            <ul className="text-emerald-800 space-y-2 text-sm">
              <li>1. Send exactly <strong className="bg-emerald-200 px-1 rounded">৳{finalTotal}</strong> via bKash/Nagad to:</li>
              <li className="text-2xl font-black text-emerald-900 tracking-wider py-2">{storeSettings.paymentNumber}</li>
              <li>2. Enter your account number and TrxID below to verify.</li>
            </ul>
          </div>

          <form onSubmit={handleCheckout} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">Account Number (Your Phone)</label>
              <input name="phone" type="text" required className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium" placeholder="e.g. 01XXXXXXXXX" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">Transaction ID (TrxID)</label>
              <input name="trxId" type="text" required className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium" placeholder="e.g. 9JXXXXX20" />
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xl py-5 rounded-xl shadow-lg transition transform hover:-translate-y-1">Place Order Securely</button>
          </form>
        </div>
      )}
    </div>
  );
}
