import React, { useState } from 'react';

const Icons = { Lock: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> };

export default function Admin({
  user, isAdmin, pendingCount,
  handleLogout, handleLogin, email, setEmail, password, setPassword,
  handleSaveSettings, newBkash, setNewBkash, newNagad, setNewNagad, storeSettings,
  handleAddCoupon, newCoupon, setNewCoupon, coupons, handleDeleteCoupon,
  handleAddProduct, newProduct, setNewProduct,
  orders, handleApproveOrder, handleDeleteOrder, products, handleDeleteProduct
}) {
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [deleteOrderConfirm, setDeleteOrderConfirm] = useState(null);
  const [deleteCouponConfirm, setDeleteCouponConfirm] = useState(null);
  const [deleteProductConfirm, setDeleteProductConfirm] = useState(null);

  const categories = [
    'Physics I', 'Physics II', 
    'Chemistry I', 'Chemistry II', 
    'Higher Math I', 'Higher Math II', 
    'Admission Special', 'Full Book Solution Bundle'
  ];

  const handleConfirmDeleteOrder = () => { handleDeleteOrder(deleteOrderConfirm); setDeleteOrderConfirm(null); }
  const handleConfirmDeleteCoupon = () => { handleDeleteCoupon(deleteCouponConfirm); setDeleteCouponConfirm(null); }
  const handleConfirmDeleteProduct = () => { handleDeleteProduct(deleteProductConfirm); setDeleteProductConfirm(null); }

  return (
    <div className="bg-white p-6 md:p-10 rounded-3xl shadow-lg border border-gray-100 max-w-4xl mx-auto animate-fade-in relative overflow-hidden">
      
      {/* Verify Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 animate-fade-in">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full relative">
            <h3 className="font-black text-2xl mb-6 text-gray-900 border-b pb-4">Verify Order</h3>
            <div className="space-y-3 mb-8 text-gray-700">
              <p><span className="font-bold">Book/Note:</span> <span className="text-emerald-600 font-bold">{selectedOrder.product?.title}</span></p>
              <p><span className="font-bold">Amount to Pay:</span> ৳{selectedOrder.totalPaid}</p>
              <p><span className="font-bold">Payment Method:</span> {selectedOrder.paymentMethod || 'bKash/Nagad'}</p>
              <p><span className="font-bold">User Phone:</span> {selectedOrder.phone}</p>
              <p className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-2"><span className="font-bold text-blue-800">TrxID:</span> <span className="font-mono text-blue-900 tracking-wider font-bold">{selectedOrder.trxId}</span></p>
              <p className="text-xs text-gray-400 mt-2">Time: {new Date(selectedOrder.timestamp).toLocaleString()}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { handleApproveOrder(selectedOrder.id, selectedOrder.product, selectedOrder.userId); setSelectedOrder(null); }} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition">Confirm Approve</button>
              <button onClick={() => { setDeleteOrderConfirm(selectedOrder.id); setSelectedOrder(null); }} className="flex-1 bg-red-100 text-red-600 py-3 rounded-xl font-bold hover:bg-red-200 transition">Reject & Delete</button>
            </div>
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 font-bold text-xl">&times;</button>
          </div>
        </div>
      )}

      {/* Delete Order Modal */}
      {deleteOrderConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 animate-fade-in">
           <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full relative text-center">
             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-red-500 text-2xl font-bold">!</span></div>
             <h3 className="font-black text-xl mb-2 text-gray-900">Delete Order Record?</h3>
             <p className="text-gray-500 mb-6 text-sm">Are you sure you want to permanently delete this order record?</p>
             <div className="flex gap-3">
               <button onClick={() => setDeleteOrderConfirm(null)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">Cancel</button>
               <button onClick={handleConfirmDeleteOrder} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition">Delete</button>
             </div>
           </div>
        </div>
      )}

      {/* Delete Coupon Modal */}
      {deleteCouponConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 animate-fade-in">
           <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full relative text-center">
             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-red-500 text-2xl font-bold">!</span></div>
             <h3 className="font-black text-xl mb-2 text-gray-900">Remove Coupon?</h3>
             <p className="text-gray-500 mb-6 text-sm">Are you sure you want to remove this coupon?</p>
             <div className="flex gap-3">
               <button onClick={() => setDeleteCouponConfirm(null)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">Cancel</button>
               <button onClick={handleConfirmDeleteCoupon} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition">Remove</button>
             </div>
           </div>
        </div>
      )}

      {/* Delete Product Modal */}
      {deleteProductConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 animate-fade-in">
           <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full relative text-center">
             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-red-500 text-2xl font-bold">!</span></div>
             <h3 className="font-black text-xl mb-2 text-gray-900">Delete Note?</h3>
             <p className="text-gray-500 mb-6 text-sm">Are you sure you want to permanently delete this note?</p>
             <div className="flex gap-3">
               <button onClick={() => setDeleteProductConfirm(null)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition">Cancel</button>
               <button onClick={handleConfirmDeleteProduct} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition">Delete</button>
             </div>
           </div>
        </div>
      )}

      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-800 to-gray-600"></div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b pb-6 mt-2">
         <div><h2 className="text-3xl font-black text-gray-900 mb-1">Admin Portal</h2></div>
         {user && <button onClick={handleLogout} className="mt-4 md:mt-0 bg-red-50 text-red-600 px-5 py-2 rounded-xl font-bold hover:bg-red-100 transition">Logout</button>}
      </div>

      {!isAdmin ? (
        user ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Access Denied!</h3>
            <button onClick={handleLogout} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold transition mt-4">Logout to change account</button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-5 max-w-sm mx-auto py-12">
            <div className="text-center mb-8"><div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">{Icons.Lock}</div></div>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Admin Email" required className="w-full border p-4 rounded-xl outline-none" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full border p-4 rounded-xl outline-none" />
            <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl transition">Login to Dashboard</button>
          </form>
        )
      ) : (
        <div className="space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 h-fit">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Payment Numbers Setup</h3>
              <form onSubmit={handleSaveSettings} className="space-y-3">
                <input type="text" placeholder="bKash Number" required value={newBkash} onChange={e => setNewBkash(e.target.value)} className="w-full border border-pink-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 bg-pink-50 placeholder-pink-300 font-bold text-pink-700"/>
                <input type="text" placeholder="Nagad Number" required value={newNagad} onChange={e => setNewNagad(e.target.value)} className="w-full border border-orange-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-orange-50 placeholder-orange-300 font-bold text-orange-700"/>
                <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition">Save Numbers</button>
              </form>
            </div>

            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
              <h3 className="font-bold text-lg mb-4 text-emerald-900">Manage Coupons</h3>
              <form onSubmit={handleAddCoupon} className="flex gap-2 mb-4">
                <input type="text" placeholder="CODE" required value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value})} className="border border-emerald-200 p-3 rounded-xl w-1/2 uppercase outline-none font-bold"/>
                <input type="number" placeholder="%" required value={newCoupon.discount} onChange={e => setNewCoupon({...newCoupon, discount: e.target.value})} className="border border-emerald-200 p-3 rounded-xl w-1/4 outline-none font-bold"/>
                <button type="submit" className="bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold w-1/4 hover:bg-emerald-700 transition">+</button>
              </form>
              
              {coupons && coupons.length > 0 && (
                <div className="mt-4 space-y-2 border-t border-emerald-200 pt-4">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Active Coupons</p>
                  {coupons.map(c => (
                    <div key={c.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                      <div>
                        <p className="font-black text-gray-800 tracking-widest">{c.code}</p>
                        <p className="text-xs font-bold text-emerald-600">{c.discount}% OFF</p>
                      </div>
                      <button onClick={() => setDeleteCouponConfirm(c.id)} className="text-red-500 bg-red-50 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-100 transition">Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div id="product-form" className="bg-gradient-to-b from-white to-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm scroll-mt-24">
            <h3 className="font-extrabold text-2xl mb-6 text-gray-900">{newProduct.id ? '📝 Update Note' : '📝 Publish Note'}</h3>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="md:col-span-2 flex gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between flex-1">
                  <span className="font-bold text-gray-700">Make this Free?</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={newProduct.isFree} onChange={e => setNewProduct({...newProduct, isFree: e.target.checked})} className="sr-only peer"/>
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
                <input type="number" placeholder="Serial No. (e.g. 1)" required value={newProduct.serial} onChange={e => setNewProduct({...newProduct, serial: e.target.value})} className="border border-gray-300 p-4 rounded-xl w-32 outline-none font-bold text-center" title="Sort Order"/>
              </div>

              <input type="text" placeholder="Note Title (e.g. Vector)" required value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} className="border border-gray-300 p-4 rounded-xl w-full outline-none"/>
              <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="border border-gray-300 p-4 rounded-xl w-full bg-white outline-none font-semibold text-gray-700">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>

              <div className="flex gap-4 md:col-span-2">
                <input type="text" placeholder="Writer Name" value={newProduct.writer} onChange={e => setNewProduct({...newProduct, writer: e.target.value})} className="border border-gray-300 p-4 rounded-xl w-1/2 outline-none"/>
                <input type="number" placeholder="Price ৳" required={!newProduct.isFree} disabled={newProduct.isFree} value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="border border-gray-300 p-4 rounded-xl w-1/2 outline-none disabled:bg-gray-100"/>
              </div>
              
              <textarea placeholder="Description (What's inside?)" rows="3" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="border border-gray-300 p-4 rounded-xl w-full md:col-span-2 outline-none resize-none"></textarea>
              <input type="url" placeholder="Demo PDF Drive Link (Optional)" value={newProduct.demoLink} onChange={e => setNewProduct({...newProduct, demoLink: e.target.value})} className="border border-gray-300 p-4 rounded-xl w-full outline-none"/>
              <input type="url" placeholder="Main PDF Drive Link (Required)" required value={newProduct.mainLink} onChange={e => setNewProduct({...newProduct, mainLink: e.target.value})} className="border border-emerald-300 bg-emerald-50 p-4 rounded-xl w-full outline-none"/>
              
              <div className="md:col-span-2 flex gap-3 mt-2">
                <button type="submit" className="flex-1 bg-emerald-600 text-white py-4 rounded-xl font-extrabold text-lg hover:bg-emerald-700 shadow-md transition">{newProduct.id ? 'Update Note' : 'Publish Note'}</button>
                {newProduct.id && <button type="button" onClick={() => setNewProduct({ serial: 1, title: '', price: '', category: 'Physics I', writer: '', description: '', demoLink: '', mainLink: '', isFree: false })} className="bg-gray-300 text-gray-800 px-6 rounded-xl font-bold hover:bg-gray-400 transition">Cancel</button>}
              </div>
            </form>
          </div>

          <div>
            <h3 className="font-extrabold text-2xl mb-6 text-gray-900 flex items-center gap-3">
              📦 Recent Orders
              {pendingCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full animate-pulse shadow-md">
                  {pendingCount} New Pending
                </span>
              )}
            </h3>
            {orders.length === 0 ? (
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-10 text-center text-gray-500">No orders pending.</div>
            ) : (
              <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                      <th className="p-5 border-b font-bold">Details</th>
                      <th className="p-5 border-b font-bold">Method</th>
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
                          <div className="text-sm text-emerald-600 font-bold mt-2">📘 {order.product?.title}</div>
                        </td>
                        <td className="p-5 font-black text-gray-900">
                          ৳{order.totalPaid}
                          <div className={`text-xs font-bold px-2 py-0.5 mt-1 rounded inline-block ${order.paymentMethod === 'Nagad' ? 'bg-orange-100 text-orange-700' : 'bg-pink-100 text-pink-700'}`}>{order.paymentMethod || 'bKash'}</div>
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wide ${order.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-5">
                          {order.status === 'Pending' ? (
                            <button onClick={() => setSelectedOrder(order)} className="bg-blue-600 text-white px-5 py-2 text-sm rounded-lg hover:bg-blue-700 font-bold shadow-sm transition">Verify Order</button>
                          ) : (
                            <button onClick={() => setDeleteOrderConfirm(order.id)} className="bg-red-50 text-red-500 px-4 py-2 text-xs rounded-lg hover:bg-red-100 font-bold transition">Delete History</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Uploaded Notes - Chapter Wise Grouping */}
          <div>
             <h3 className="font-extrabold text-2xl mb-6 text-gray-900">📚 Uploaded Notes (Chapter-wise)</h3>
             
             {categories.map(category => {
               const categoryProducts = products.filter(p => p.category === category);
               
               if (categoryProducts.length === 0) return null;

               return (
                 <div key={category} className="mb-8 bg-gray-50 p-5 rounded-2xl border border-gray-200">
                   <h4 className="font-bold text-xl text-emerald-700 mb-4 flex items-center gap-2">
                     <span className="bg-emerald-100 px-3 py-1 rounded-lg">{category}</span>
                     <span className="text-sm text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">{categoryProducts.length} Notes</span>
                   </h4>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {categoryProducts.map(p => (
                       <div key={p.id} className="flex justify-between items-center bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:border-emerald-300 transition">
                         <div>
                           <p className="font-bold text-gray-800 text-lg mb-1">{p.serial === 9999 || !p.serial ? '?' : p.serial}. {p.title}</p>
                           <p className="text-sm font-black text-emerald-600">{p.isFree ? 'Free' : `৳${p.price}`}</p>
                         </div>
                         <div className="flex gap-2">
                           <button onClick={() => { setNewProduct(p); document.getElementById('product-form').scrollIntoView({ behavior: 'smooth' }); }} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 font-bold transition">Edit</button>
                           <button onClick={() => setDeleteProductConfirm(p.id)} className="bg-red-50 text-red-500 px-4 py-2 rounded-lg hover:bg-red-100 font-bold transition">Delete</button>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               );
             })}

             {products.filter(p => !categories.includes(p.category)).length > 0 && (
               <div className="mb-8 bg-orange-50 p-5 rounded-2xl border border-orange-200">
                   <h4 className="font-bold text-xl text-orange-700 mb-4 flex items-center gap-2">
                     <span className="bg-orange-100 px-3 py-1 rounded-lg">Uncategorized / Old Notes</span>
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {products.filter(p => !categories.includes(p.category)).map(p => (
                       <div key={p.id} className="flex justify-between items-center bg-white border border-orange-200 p-4 rounded-xl shadow-sm hover:border-orange-300 transition">
                         <div>
                           <p className="font-bold text-gray-800 text-lg mb-1">{p.serial === 9999 || !p.serial ? '?' : p.serial}. {p.title}</p>
                           <p className="text-sm font-black text-emerald-600">{p.isFree ? 'Free' : `৳${p.price}`} <span className="text-xs text-gray-400 font-normal ml-2">{p.category}</span></p>
                         </div>
                         <div className="flex gap-2">
                           <button onClick={() => { setNewProduct(p); document.getElementById('product-form').scrollIntoView({ behavior: 'smooth' }); }} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 font-bold transition">Edit</button>
                           <button onClick={() => setDeleteProductConfirm(p.id)} className="bg-red-50 text-red-500 px-4 py-2 rounded-lg hover:bg-red-100 font-bold transition">Delete</button>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
             )}
          </div>

        </div>
      )}
    </div>
  );
}
