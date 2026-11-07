```react
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';

// তোমার ফায়ারবেস কনফিগারেশন
const firebaseConfig = {
  apiKey: "AIzaSyBxzTKy4vi9VcGFM7kg4pePDukB-aWhoAA",
  authDomain: "premium-hsc-notes.firebaseapp.com",
  projectId: "premium-hsc-notes",
  storageBucket: "premium-hsc-notes.firebasestorage.app",
  messagingSenderId: "938896449795",
  appId: "1:938896449795:web:73f7516e756df73aea0936"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function App() {
  const [activeTab, setActiveTab] = useState('store'); 
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [library, setLibrary] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Dynamic Settings & Coupons
  const [storeSettings, setStoreSettings] = useState({ paymentNumber: '01XXXXXXXXX' });
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  
  // Admin State
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState([]);
  
  // New Product Form
  const [newProduct, setNewProduct] = useState({ 
    title: '', price: '', category: 'Physics', writer: '', description: '', demoLink: '', mainLink: '', isFree: false 
  });
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '' });
  const [newPaymentNumber, setNewPaymentNumber] = useState('');

  // Toast Notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const prodSnap = await getDocs(collection(db, "products"));
      setProducts(prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      
      const settingsDoc = await getDoc(doc(db, "settings", "store"));
      if (settingsDoc.exists()) setStoreSettings(settingsDoc.data());

      const couponSnap = await getDocs(collection(db, "coupons"));
      setCoupons(couponSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchOrders();
    });
    return () => unsubscribe();
  }, []);

  const fetchOrders = async () => {
    const querySnapshot = await getDocs(collection(db, "orders"));
    setOrders(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // Admin Actions
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast('Successfully logged in as Admin!');
    } catch (error) {
      showToast('Login failed!', 'error');
    }
  };

  const handleLogout = () => {
    signOut(auth);
    showToast('Logged out');
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "products"), {
        ...newProduct,
        price: newProduct.isFree ? 0 : Number(newProduct.price)
      });
      showToast("Product added successfully!");
      setNewProduct({ title: '', price: '', category: 'Physics', writer: '', description: '', demoLink: '', mainLink: '', isFree: false });
      fetchData();
    } catch (error) {
      showToast("Error adding product", 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if(window.confirm("Are you sure you want to delete this note?")) {
      await deleteDoc(doc(db, "products", id));
      showToast("Product deleted!");
      fetchData();
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, "settings", "store"), { paymentNumber: newPaymentNumber });
    setStoreSettings({ paymentNumber: newPaymentNumber });
    showToast("Payment number updated!");
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "coupons"), {
      code: newCoupon.code.toUpperCase(),
      discount: Number(newCoupon.discount)
    });
    showToast("Coupon added!");
    setNewCoupon({ code: '', discount: '' });
    fetchData();
  };

  // Student Actions
  const applyCoupon = () => {
    const validCoupon = coupons.find(c => c.code === couponInput.toUpperCase());
    if (validCoupon) {
      setAppliedCoupon(validCoupon);
      showToast(`Coupon applied! ${validCoupon.discount}% off.`);
    } else {
      showToast("Invalid coupon code!", 'error');
      setAppliedCoupon(null);
    }
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
    showToast('Item removed from cart!');
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const finalTotal = appliedCoupon ? cartTotal - (cartTotal * (appliedCoupon.discount / 100)) : cartTotal;

  const handleCheckout = async (e) => {
    e.preventDefault();
    const phone = e.target.phone.value;
    const trxId = e.target.trxId.value;
    
    try {
      await addDoc(collection(db, "orders"), {
        phone,
        trxId,
        items: cart,
        totalPaid: finalTotal,
        status: 'Pending',
        timestamp: new Date().toISOString()
      });
      showToast('Order submitted! Wait for admin approval.');
      setCart([]);
      setAppliedCoupon(null);
      setActiveTab('library');
    } catch (error) {
      showToast('Error submitting order', 'error');
    }
  };

  const handleGetFree = (product) => {
    if(!library.find(item => item.id === product.id)) {
      setLibrary([...library, product]);
      showToast('Free note added to your library!');
    }
  };

  const handleApproveOrder = async (orderId, orderItems) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: 'Approved' });
      showToast('Order Approved!');
      fetchOrders();
      // Demo logic for instant preview without refresh
      const newItems = orderItems.filter(item => !library.find(l => l.id === item.id));
      setLibrary([...library, ...newItems]);
    } catch (error) {
      showToast('Error approving order', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans relative pb-20">
      
      {/* Custom Toast Notification */}
      {toast && (
        <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-50 text-white font-bold tracking-wide transition-all duration-300 animate-bounce ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-600'}`}>
          {toast.message}
        </div>
      )}

      {/* Top Navigation */}
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-40 border-b border-slate-100">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight"><span className="text-emerald-600">Solution</span> Hub</h1>
        <div className="flex gap-2 md:gap-4 items-center">
          <button onClick={() => setActiveTab('store')} className={`px-4 py-2 rounded-xl font-bold transition-colors ${activeTab === 'store' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500 hover:bg-slate-100'}`}>Store</button>
          <button onClick={() => setActiveTab('library')} className={`px-4 py-2 rounded-xl font-bold transition-colors ${activeTab === 'library' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500 hover:bg-slate-100'}`}>Library</button>
          <button onClick={() => setActiveTab('cart')} className={`px-4 py-2 rounded-xl font-bold transition-colors relative ${activeTab === 'cart' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500 hover:bg-slate-100'}`}>
            Cart 
            {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">{cart.length}</span>}
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1"></div>
          <button onClick={() => setActiveTab('admin')} className={`p-2 rounded-xl transition-colors ${activeTab === 'admin' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-100'}`}>🔒</button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 sm:p-6 mt-4">
        
        {/* ================= STOREFRONT ================= */}
        {activeTab === 'store' && (
          <div className="animate-fade-in">
            <div className="text-center mb-12 mt-6">
              <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Premium Notes & Solutions</h2>
              <p className="text-slate-500 font-medium text-lg">Top quality board standard materials by expert writers.</p>
            </div>
            
            {loading ? (
              <div className="text-center py-20 flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
                <span className="text-slate-500 font-bold">Loading contents...</span>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[2rem] shadow-sm border border-slate-100">
                <span className="text-6xl block mb-4">📭</span>
                <p className="text-slate-500 text-xl font-medium">No notes available right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => {
                  const inCart = cart.some(item => item.id === product.id);
                  const inLibrary = library.some(item => item.id === product.id);

                  return (
                    <div key={product.id} className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col relative group">
                      
                      {/* Typographic Header */}
                      <div className="flex justify-between items-start mb-6">
                        <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg uppercase tracking-widest">{product.category}</span>
                        <div className="bg-slate-50 w-20 h-20 absolute top-0 right-0 rounded-bl-[4rem] rounded-tr-[2rem] -z-10 group-hover:bg-emerald-50/50 transition-colors"></div>
                        <span className="text-3xl font-black text-slate-900 tracking-tight">{product.isFree ? 'FREE' : <><span className="text-lg text-slate-400">৳</span>{product.price}</>}</span>
                      </div>
                      
                      <h3 className="font-extrabold text-2xl text-slate-900 leading-tight mb-3">{product.title}</h3>
                      
                      {product.writer && (
                        <div className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm mb-5 bg-emerald-50/50 px-3 py-1.5 rounded-lg w-fit border border-emerald-100/50">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          Writer: {product.writer}
                        </div>
                      )}
                      
                      <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow line-clamp-3">{product.description}</p>
                      
                      {/* ACTION BUTTONS (Phase 5 styling) */}
                      <div className="space-y-3 pt-6 border-t border-slate-100 mt-auto">
                        
                        {product.demoLink && (
                          <a href={product.demoLink} target="_blank" rel="noreferrer" className="w-full flex justify-center items-center gap-2 bg-transparent border-2 border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:border-slate-800 hover:text-slate-900 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            View Demo PDF
                          </a>
                        )}

                        {product.isFree ? (
                          <button 
                            onClick={() => handleGetFree(product)}
                            disabled={inLibrary}
                            className={`w-full font-bold py-3 rounded-xl shadow-sm transition-all duration-200 flex justify-center items-center gap-2 ${inLibrary ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-500/25 hover:shadow-lg'}`}
                          >
                            {inLibrary ? '✓ Already in Library' : '📥 Get For Free'}
                          </button>
                        ) : (
                          <button 
                            onClick={() => { if(!inCart) setCart([...cart, product]); showToast('Added to cart!'); }}
                            disabled={inCart}
                            className={`w-full font-bold py-3 rounded-xl transition-all duration-200 flex justify-center items-center gap-2 ${inCart ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30'}`}
                          >
                            {inCart ? '✓ In Cart' : '🛒 Add to Cart'}
                          </button>
                        )}
                      </div>

                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= CART & CHECKOUT ================= */}
        {activeTab === 'cart' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-8">Secure Checkout</h2>
            
            {cart.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-16 text-center shadow-sm border border-slate-100">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400"><span className="text-4xl">🛒</span></div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h3>
                <button onClick={() => setActiveTab('store')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl mt-4 transition-all">Explore Store</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Order Summary */}
                <div className="lg:col-span-7 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 h-fit">
                  <h3 className="font-bold text-xl text-slate-800 mb-6 border-b border-slate-100 pb-4">Order Summary</h3>
                  <div className="space-y-4 mb-8">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-5 bg-white rounded-2xl border-l-4 border-l-emerald-500 border-y border-r border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1.5 bg-emerald-50 w-fit px-2 py-0.5 rounded-md">
                            {item.category}
                          </span>
                          <span className="font-extrabold text-slate-900 text-lg leading-tight">{item.title}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-black text-xl text-slate-800">৳{item.price}</span>
                          <button 
                            onClick={() => handleRemoveFromCart(item.id)} 
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors" 
                            title="Remove from Cart"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h4 className="font-bold text-slate-700 mb-3 text-sm">Have a coupon code?</h4>
                    <form onSubmit={(e) => { e.preventDefault(); applyCoupon(); }} className="flex gap-2 mb-6">
                      <input type="text" value={couponInput} onChange={e => setCouponInput(e.target.value)} placeholder="Enter code" className="flex-1 bg-white border border-slate-200 p-3.5 rounded-xl outline-none focus:border-emerald-500 uppercase font-bold text-slate-700" />
                      <button type="submit" className="bg-slate-900 text-white px-6 font-bold rounded-xl hover:bg-black transition-colors">Apply</button>
                    </form>

                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-slate-500 font-medium">
                        <span>Subtotal</span><span>৳{cartTotal}</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-emerald-600 font-bold">
                          <span>Discount ({appliedCoupon.code})</span><span>- ৳{cartTotal * (appliedCoupon.discount / 100)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-end pt-4 mt-2 border-t border-slate-200">
                        <span className="text-slate-800 font-extrabold text-lg">Total</span>
                        <span className="text-4xl font-black text-emerald-600 tracking-tight">৳{finalTotal}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Form */}
                <div className="lg:col-span-5 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 h-fit">
                  <h3 className="font-bold text-xl text-slate-800 mb-6">Payment</h3>
                  
                  <div className="bg-emerald-50 p-5 rounded-2xl mb-6 border border-emerald-100">
                    <p className="text-sm text-emerald-900 font-medium mb-1">1. Send money via bKash/Nagad to:</p>
                    <p className="text-2xl font-black text-emerald-700 tracking-wider mb-2">{storeSettings.paymentNumber}</p>
                    <p className="text-sm text-emerald-800 font-medium">2. Enter your Phone & TrxID below.</p>
                  </div>

                  <form onSubmit={handleCheckout} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">bKash/Nagad Number</label>
                      <input name="phone" type="tel" required className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold" placeholder="Your Phone Number" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Transaction ID (TrxID)</label>
                      <input name="trxId" type="text" required className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition-all font-bold uppercase" placeholder="e.g. 9JXXXXX20" />
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/30 mt-2 text-lg">Submit Order</button>
                  </form>
                </div>

              </div>
            )}
          </div>
        )}

        {/* ================= LIBRARY ================= */}
        {activeTab === 'library' && (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-8">My Digital Library</h2>
            {library.length === 0 ? (
               <div className="bg-white p-16 text-center rounded-[2rem] border border-slate-100 shadow-sm">
                 <span className="text-6xl block mb-6">📚</span>
                 <h3 className="text-2xl font-bold text-slate-800 mb-2">Your library is empty</h3>
                 <p className="text-slate-500 max-w-md mx-auto leading-relaxed">Purchase premium notes or grab the free ones from the store to access them here.</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {library.map((item, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm border border-emerald-100 flex flex-col hover:shadow-lg transition-all group">
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg uppercase tracking-widest w-fit mb-4">{item.category}</span>
                    <h3 className="font-extrabold text-2xl text-slate-900 mb-4 leading-tight">{item.title}</h3>
                    
                    <a href={item.mainLink || '#'} target="_blank" rel="noreferrer" className="mt-auto w-full text-center bg-emerald-600 text-white hover:bg-emerald-700 font-bold py-3.5 rounded-xl transition-colors shadow-md">
                      Read / Download PDF
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= ADMIN DASHBOARD ================= */}
        {activeTab === 'admin' && (
          <div className="bg-white p-6 md:p-10 rounded-[2rem] shadow-sm border border-slate-100 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-10 border-b border-slate-100 pb-6">
               <div>
                 <h2 className="text-3xl font-extrabold text-slate-900">Admin Portal</h2>
                 {user && <p className="text-slate-500 font-medium mt-1">{user.email}</p>}
               </div>
               {user && <button onClick={handleLogout} className="bg-rose-50 text-rose-600 px-6 py-2.5 rounded-xl font-bold hover:bg-rose-100 transition-colors">Logout</button>}
            </div>

            {!user ? (
              <form onSubmit={handleLogin} className="space-y-4 max-w-sm mx-auto py-12">
                <div className="text-center mb-8 text-slate-500">
                  <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-4 text-3xl">🔐</div>
                  <p className="font-medium">Secure login required</p>
                </div>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Admin Email" required className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:border-slate-900 font-medium" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:border-slate-900 font-medium" />
                <button type="submit" className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-colors mt-2">Access Dashboard</button>
              </form>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* LEFT COLUMN */}
                <div className="lg:col-span-5 space-y-8">
                  {/* Settings & Coupons */}
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-6">
                    <div>
                      <h3 className="font-bold text-lg mb-4 text-slate-900">⚙️ Store Setup</h3>
                      <form onSubmit={handleSaveSettings} className="flex gap-2">
                        <input type="text" placeholder="bKash/Nagad No." required value={newPaymentNumber} onChange={e => setNewPaymentNumber(e.target.value)} className="bg-white border border-slate-200 p-3 rounded-xl flex-1 font-bold outline-none focus:border-emerald-500"/>
                        <button type="submit" className="bg-slate-900 text-white px-5 py-3 rounded-xl font-bold hover:bg-black">Save</button>
                      </form>
                      <p className="text-xs text-slate-500 mt-2 font-medium">Current: {storeSettings.paymentNumber}</p>
                    </div>
                    
                    <div className="border-t border-slate-200 pt-6">
                      <h3 className="font-bold text-lg mb-4 text-slate-900">🎟️ Create Coupon</h3>
                      <form onSubmit={handleAddCoupon} className="flex gap-2 mb-4">
                        <input type="text" placeholder="CODE" required value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value})} className="w-1/2 bg-white border border-slate-200 p-3 rounded-xl uppercase font-bold outline-none"/>
                        <input type="number" placeholder="%" required value={newCoupon.discount} onChange={e => setNewCoupon({...newCoupon, discount: e.target.value})} className="w-1/4 bg-white border border-slate-200 p-3 rounded-xl font-bold outline-none"/>
                        <button type="submit" className="bg-emerald-600 text-white font-bold rounded-xl w-1/4 hover:bg-emerald-700">+</button>
                      </form>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {coupons.map(c => (
                           <div key={c.id} className="flex justify-between items-center bg-white p-3 px-4 rounded-xl border border-slate-100 text-sm font-bold text-slate-700">
                             <span>{c.code} <span className="text-emerald-500 ml-1">({c.discount}%)</span></span>
                           </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Add Product */}
                  <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100">
                    <h3 className="font-extrabold text-xl mb-6 text-slate-900">📝 Publish Note</h3>
                    <form onSubmit={handleAddProduct} className="space-y-4">
                      
                      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                        <label className="font-bold text-slate-700">Make this note Free?</label>
                        <input type="checkbox" checked={newProduct.isFree} onChange={e => setNewProduct({...newProduct, isFree: e.target.checked})} className="w-5 h-5 accent-emerald-600"/>
                      </div>

                      <input type="text" placeholder="Note Title (e.g. Vector)" required value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} className="w-full bg-white border border-slate-200 p-4 rounded-xl font-bold outline-none focus:border-emerald-500"/>
                      
                      <div className="flex gap-4">
                        <input type="text" placeholder="Writer Name" value={newProduct.writer} onChange={e => setNewProduct({...newProduct, writer: e.target.value})} className="w-full bg-white border border-slate-200 p-4 rounded-xl font-medium outline-none focus:border-emerald-500"/>
                        {!newProduct.isFree && (
                          <input type="number" placeholder="Price ৳" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-32 bg-white border border-slate-200 p-4 rounded-xl font-bold outline-none focus:border-emerald-500"/>
                        )}
                      </div>
                      
                      <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-white border border-slate-200 p-4 rounded-xl font-bold text-slate-700 outline-none">
                        <option>Physics</option><option>Chemistry</option><option>Higher Math</option><option>Admission</option>
                      </select>

                      <textarea placeholder="Description (What's inside?)" rows="3" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-white border border-slate-200 p-4 rounded-xl font-medium outline-none resize-none focus:border-emerald-500"></textarea>
                      
                      <input type="url" placeholder="Demo PDF Drive Link (Optional)" value={newProduct.demoLink} onChange={e => setNewProduct({...newProduct, demoLink: e.target.value})} className="w-full bg-white border border-slate-200 p-3.5 rounded-xl outline-none text-sm"/>
                      <input type="url" placeholder="Main PDF Drive Link (Required)" required value={newProduct.mainLink} onChange={e => setNewProduct({...newProduct, mainLink: e.target.value})} className="w-full bg-emerald-100/50 border border-emerald-200 p-3.5 rounded-xl outline-none text-sm font-medium"/>
                      
                      <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-extrabold hover:bg-emerald-700 transition shadow-md mt-2">Publish Note</button>
                    </form>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="lg:col-span-7 space-y-8">
                  
                  {/* Orders */}
                  <div>
                    <h3 className="font-extrabold text-xl mb-4 text-slate-900">📦 Recent Orders</h3>
                    {orders.length === 0 ? <p className="text-slate-500 bg-slate-50 p-8 rounded-2xl text-center border">No orders pending.</p> : (
                      <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 text-slate-500 text-sm">
                            <tr><th className="p-4 font-bold">Details</th><th className="p-4 font-bold">Amount</th><th className="p-4 font-bold text-right">Action</th></tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {orders.map(order => (
                              <tr key={order.id} className="hover:bg-slate-50">
                                <td className="p-4">
                                  <p className="font-bold text-slate-900">{order.phone}</p>
                                  <p className="text-xs font-mono text-emerald-600 font-bold mt-1">Trx: {order.trxId}</p>
                                </td>
                                <td className="p-4 font-black text-slate-800">৳{order.totalPaid}</td>
                                <td className="p-4 text-right">
                                  {order.status === 'Pending' ? (
                                    <button onClick={() => handleApproveOrder(order.id, order.items)} className="bg-emerald-500 text-white px-4 py-2 text-sm rounded-lg hover:bg-emerald-600 font-bold shadow-sm transition">Approve</button>
                                  ) : <span className="bg-slate-100 text-slate-400 font-bold px-3 py-1 rounded-lg text-sm">Approved</span>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Products List */}
                  <div>
                     <h3 className="font-extrabold text-xl mb-4 text-slate-900">📚 Uploaded Notes</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {products.map(p => (
                         <div key={p.id} className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-xl">
                           <div>
                             <p className="font-bold text-slate-800">{p.title}</p>
                             <p className="text-sm font-black text-emerald-600">{p.isFree ? 'Free' : `৳${p.price}`}</p>
                           </div>
                           <button onClick={() => handleDeleteProduct(p.id)} className="text-rose-500 bg-rose-50 px-3 py-2 rounded-lg hover:bg-rose-100 font-bold transition">Delete</button>
                         </div>
                       ))}
                     </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
```
