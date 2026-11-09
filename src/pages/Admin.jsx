import React from 'react';

const Icons = { Lock: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> };

export default function Admin({
  user, isAdmin, handleLogout, handleLogin, email, setEmail, password, setPassword,
  handleSaveSettings, newPaymentNumber, setNewPaymentNumber, storeSettings,
  handleAddCoupon, newCoupon, setNewCoupon, handleAddProduct, newProduct, setNewProduct,
  orders, handleApproveOrder, products, handleDeleteProduct
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

      {!isAdmin ? (
        user ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"><span className="text-red-500 text-4xl">🚫</span></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Access Denied!</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">This portal is strictly restricted to administrators.</p>
            <button onClick={handleLogout} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition shadow-lg">Logout to change account</button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-5 max-w-sm mx-auto py-12">
            <div className="text-center mb-8">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">{Icons.Lock}</div>
              <h3 className="text-xl font-bold text-gray-800">Authorized Access Only</h3>
            </div>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Admin Email" required className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-gray-800 outline-none" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full border border-gray-300 p-4 rounded-xl focus:ring-2 focus:ring-gray-800 outline-none" />
            <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-bold text-lg py-4 rounded-xl shadow-lg transition">Login to Dashboard</button>
          </form>
        )
      ) : (
        <div className="space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Store Setup</h3>
              <form onSubmit={handleSaveSettings} className="flex gap-2">
                <input type="text" placeholder="bKash/Nagad No." required value={newPaymentNumber} onChange={e => setNewPaymentNumber(e.target.value)} className="border border-gray-300 p-3 rounded-xl flex-1 focus:ring-2 focus:ring-gray-800 outline-none"/>
                <button type="submit" className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition">Save</button>
              </form>
              <p className="text-xs text-gray-500 mt-3 font-medium">Current: {storeSettings.paymentNumber}</p>
            </div>

            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
              <h3 className="font-bold text-lg mb-4 text-emerald-900">Create Coupon</h3>
              <form onSubmit={handleAddCoupon} className="flex gap-2">
                <input type="text" placeholder="CODE" required value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value})} className="border border-emerald-200 p-3 rounded-xl w-1/2 uppercase focus:ring-2 focus:ring-emerald-500 outline-none"/>
                <input type="number" placeholder="%" required value={newCoupon.discount} onChange={e => setNewCoupon({...newCoupon, discount: e.target.value})} className="border border-emerald-200 p-3 rounded-xl w-1/4 focus:ring-2 focus:ring-emerald-500 outline-none"/>
                <button type="submit" className="bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold w-1/4 hover:bg-emerald-700 transition">+</button>
              </form>
            </div>
          </div>

          <div id="product-form" className="bg-gradient-to-b from-white to-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm scroll-mt-24">
            <h3 className="font-extrabold text-2xl mb-6 text-gray-900">{newProduct.id ? '📝 Update Note' : '📝 Publish Note'}</h3>
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
              <div className="md:col-span-2 flex gap-3 mt-2">
                <button type="submit" className="flex-1 bg-emerald-600 text-white py-4 rounded-xl font-extrabold text-lg hover:bg-emerald-700 shadow-md transition">{newProduct.id ? 'Update Note' : 'Publish Note'}</button>
                {newProduct.id && <button type="button" onClick={() => setNewProduct({ title: '', price: '', category: 'Physics', writer: '', description: '', demoLink: '', mainLink: '', isFree: false })} className="bg-gray-300 text-gray-800 px-6 rounded-xl font-bold hover:bg-gray-400 transition">Cancel</button>}
              </div>
            </form>
          </div>

          <div>
            <h3 className="font-extrabold text-2xl mb-6 text-gray-900">📦 Recent Orders</h3>
            {orders.length === 0 ? (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-10 text-center text-gray-500">No orders pending.</div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                      <th className="p-5 border-b font-bold">Details</th>
                      <th className="p-5 border-b font-bold">Paid</th>
                      <th className="p-5 border-b font-bold">Status</th>
                      <th className="p-5 border-b font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50 transition">
                        <td className="p-5 font-bold text-gray-800">
                          {order.phone}
                          <div className="text-xs text-gray-500 font-normal mt-1 break-all">Trx: {order.trxId}</div>
                          {/* কোন নোট কিনছে সেটা অ্যাডমিন দেখতে পাবে */}
                          <div className="text-sm text-emerald-600 font-bold mt-2">📘 {order.product?.title}</div>
                        </td>
                        <td className="p-5 font-black text-gray-900">৳{order.totalPaid}</td>
                        <td className="p-5">
                          <span className={`px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wide ${order.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-5">
                          {order.status === 'Pending' && (
                            // এখানে order.product এবং order.userId পাস করা হচ্ছে
                            <button onClick={() => handleApproveOrder(order.id, order.product, order.userId)} className="bg-emerald-500 text-white px-5 py-2 text-sm rounded-lg hover:bg-emerald-600 font-bold shadow-sm transition">
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

          <div>
             <h3 className="font-extrabold text-2xl mb-6 text-gray-900">📚 Uploaded Notes</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {products.map(p => (
                 <div key={p.id} className="flex justify-between items-center bg-white border border-gray-200 p-5 rounded-2xl shadow-sm hover:border-gray-300 transition">
                   <div>
                     <p className="font-bold text-gray-800 text-lg mb-1">{p.title}</p>
                     <p className="text-sm font-black text-emerald-600">{p.isFree ? 'Free' : `৳${p.price}`}</p>
                   </div>
                   <div className="flex gap-2">
                     <button onClick={() => { setNewProduct(p); document.getElementById('product-form').scrollIntoView({ behavior: 'smooth' }); }} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 font-bold transition">Edit</button>
                     <button onClick={() => handleDeleteProduct(p.id)} className="bg-red-50 text-red-500 px-4 py-2 rounded-lg hover:bg-red-100 hover:text-red-600 font-bold transition">Delete</button>
                   </div>
                 </div>
               ))}
             </div>
          </div>

        </div>
      )}
    </div>
  );
}
