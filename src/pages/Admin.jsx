import React from 'react';

const Icons = {
  Lock: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
};

export default function Admin({
  user,
  handleLogout,
  handleLogin,
  email,
  setEmail,
  password,
  setPassword,
  handleSaveSettings,
  newPaymentNumber,
  setNewPaymentNumber,
  storeSettings,
  handleAddCoupon,
  newCoupon,
  setNewCoupon,
  handleAddProduct,
  newProduct,
  setNewProduct,
  orders,
  handleApproveOrder,
  products,
  handleDeleteProduct
}) {
  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-lg border border-gray-100 max-w-4xl mx-auto animate-fade-in relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-800 to-gray-600"></div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b pb-6 mt-2">
         <div>
           <h2 className="text-3xl font-black text-gray-900 mb-1">Admin Portal</h2>
           {user && <p className="text-gray-500 text-sm font-medium">{user.email}</p>}
         </div>
         {user && <button onClick={handleLogout} className="mt-4 md:mt-0 bg-red-50 text-red-600 px-5 py-2 rounded-xl font-bold hover:bg-red-100 transition">Logout</button>}
      </div>

      {!user ? (
        <form onSubmit={handleLogin} className="space-y-5 max-w-sm mx-auto py-12">
          <div className="text-center mb-8">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              {Icons.Lock}
            </div>
            <h3 className="text-xl font-bold text-gray-800">Authorized Access Only</h3>
          </div>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Admin Email" required className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-gray-800 outline-none" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-gray-800 outline-none" />
          <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-bold text-lg py-4 rounded-xl shadow-lg transition">Login to Dashboard</button>
        </form>
      ) : (
        <div className="space-y-12">
          
          {/* Store Settings & Coupons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2"><svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> Store Setup</h3>
              <form onSubmit={handleSaveSettings} className="flex gap-2">
                <input type="text" placeholder="bKash/Nagad No." required value={newPaymentNumber} onChange={e => setNewPaymentNumber(e.target.value)} className="border border-gray-300 p-3 rounded-xl flex-1 focus:ring-2 focus:ring-gray-800 outline-none"/>
                <button type="submit" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition">Save</button>
              </form>
              <p className="text-xs text-gray-500 mt-3 font-medium">Current: {storeSettings.paymentNumber}</p>
            </div>

            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
              <h3 className="font-bold text-lg mb-4 text-emerald-900 flex items-center gap-2"><svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg> Create Coupon</h3>
              <form onSubmit={handleAddCoupon} className="flex gap-2">
                <input type="text" placeholder="CODE" required value={newCoupon.code} onChange={e => setNewCoupon(e.target.value)} className="border border-emerald-200 p-3 rounded-xl w-1/2 uppercase focus:ring-2 focus:ring-emerald-500 outline-none"/>
                <input type="number" placeholder="%" required value={newCoupon.discount} onChange={e => setNewCoupon({...newCoupon, discount: e.target.value})} className="border border-emerald-200 p-3 rounded-xl w-1/4 focus:ring-2 focus:ring-emerald-500 outline-none"/>
                <button type="submit" className="bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold w-1/4 hover:bg-emerald-700 transition">+</button>
              </form>
            </div>
          </div>

          {/* Add Product Form */}
          <div className="bg-gradient-to-b from-white to-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-extrabold text-2xl mb-6 text-gray-900 flex items-center gap-2">📝 Publish Note</h3>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                <span className="font-bold text-gray-700">Make this note Free?</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={newProduct.isFree} onChange={e => setNewProduct({...newProduct, isFree: e.target.checked})} className="sr-only peer"/>
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <input type="text" placeholder="Note Title (e.g. Vector)" required value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} className="border border-gray-300 p-4 rounded-xl w-full focus:ring-2 focus:ring-emerald-500 outline-none"/>
              
              <div className="flex gap-4">
                <input type="text" placeholder="Writer Name" value={newProduct.writer} onChange={e => setNewProduct({...newProduct, writer: e.target.value})} className="border border-gray-300 p-4 rounded-xl w-1/2 focus:ring-2 focus:ring-emerald-500 outline-none"/>
                <input type="number" placeholder="Price ৳" required={!newProduct.isFree} disabled={newProduct.isFree} value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="border border-gray-300 p-4 rounded-xl w-1/2 focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-gray-100"/>
              </div>
              
              <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="border border-gray-300 p-4 rounded-xl w-full bg-white focus:ring-2 focus:ring-emerald-500 outline-none">
                <option>Physics</option><option>Chemistry</option><option>Higher Math</option><option>Admission Special</option>
              </select>

              <textarea placeholder="Description (What's inside?)" rows="3" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="border border-gray-300 p-4 rounded-xl w-full md:col-span-2 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"></textarea>
              
              <input type="url" placeholder="Demo PDF Drive Link (Optional)" value={newProduct.demoLink} onChange={e => setNewProduct({...newProduct, demoLink: e.target.value})} className="border border-gray-300 p-4 rounded-xl w-full focus:ring-2 focus:ring-emerald-500 outline-none"/>
              <input type="url" placeholder="Main PDF Drive Link (Required)" required value={newProduct.mainLink} onChange={e => setNewProduct({...newProduct, mainLink: e.target.value})} className="border border-emerald-300 bg-emerald-50 p-4 rounded-xl w-full focus:ring-2 focus:ring-emerald-500 outline-none"/>
              
              <button type="submit" className="md:col-span-2 bg-emerald-600 text-white py-4 rounded-xl font-extrabold text-lg hover:bg-emerald-700 shadow-md transition mt-2">Publish Note</button>
            </form>
          </div>

          {/* Orders Management */}
          <div>
            <h3 className="font-extrabold text-2xl mb-6 text-gray-900 flex items-center gap-2">📦 Recent Orders</h3>
            {orders.length === 0 ? (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-10 text-center text-gray-500">
                No orders pending.
              </div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                      <th className="p-5 border-b font-bold">Phone</th>
                      <th className="p-5 border-b font-bold">TrxID</th>
                      <th className="p-5 border-b font-bold">Paid</th>
                      <th className="p-5 border-b font-bold">Status</th>
                      <th className="p-5 border-b font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50 transition">
                        <td className="p-5 font-bold text-gray-800">{order.phone}</td>
                        <td className="p-5 font-mono text-sm text-blue-600 bg-blue-50 rounded px-2 inline-block mt-4 ml-5">{order.trxId}</td>
                        <td className="p-5 font-black text-gray-900">৳{order.totalPaid}</td>
                        <td className="p-5">
                          <span className={`px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wide ${order.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-5">
                          {order.status === 'Pending' && (
                            <button onClick={() => handleApproveOrder(order.id, order.items)} className="bg-emerald-500 text-white px-5 py-2 text-sm rounded-lg hover:bg-emerald-600 font-bold shadow-sm transition">
                              Approve Access
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Manage Products */}
          <div>
             <h3 className="font-extrabold text-2xl mb-6 text-gray-900 flex items-center gap-2">📚 Uploaded Notes</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {products.map(p => (
                 <div key={p.id} className="flex justify-between items-center bg-white border border-gray-200 p-5 rounded-2xl shadow-sm hover:border-gray-300 transition">
                   <div>
                     <p className="font-bold text-gray-800 text-lg mb-1">{p.title}</p>
                     <p className="text-sm font-black text-emerald-600">{p.isFree ? 'Free' : `৳${p.price}`}</p>
                   </div>
                   <button onClick={() => handleDeleteProduct(p.id)} className="bg-red-50 text-red-500 px-4 py-2 rounded-lg hover:bg-red-100 hover:text-red-600 font-bold transition">Delete</button>
                 </div>
               ))}
             </div>
          </div>

        </div>
      )}
    </div>
  );
}
