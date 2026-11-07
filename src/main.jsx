import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';

// ফায়ারবেস কনফিগারেশন
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

// আইকনসমূহ (SVG)
const Icons = {
  Store: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Library: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  Cart: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Lock: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  Search: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Trash: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
};

function App() {
  const [activeTab, setActiveTab] = useState('store'); 
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [library, setLibrary] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [storeSettings, setStoreSettings] = useState({ paymentNumber: '01XXXXXXXXX' });
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState([]);
  
  const [newProduct, setNewProduct] = useState({ 
    title: '', price: '', category: 'Physics', writer: '', description: '', demoLink: '', mainLink: '', isFree: false 
  });
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '' });
  const [newPaymentNumber, setNewPaymentNumber] = useState('');

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

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
    showToast("Item removed from cart");
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
      const newItems = orderItems.filter(item => !library.find(l => l.id === item.id));
      setLibrary([...library, ...newItems]);
    } catch (error) {
      showToast('Error approving order', 'error');
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(p => 
    (selectedCategory === 'All' || p.category === selectedCategory) &&
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans relative flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-5 px-6 py-3 rounded-xl shadow-2xl z-50 text-white font-semibold transition-all duration-300 transform translate-y-0 opacity-100 ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-600'}`}>
          {toast.message}
        </div>
      )}

      {/* Top Navigation */}
      <nav className="bg-white shadow-sm p-4 sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 cursor-pointer" onClick={() => setActiveTab('store')}>
            Solution Hub
          </h1>
          <div className="flex gap-2 md:gap-4 items-center">
            <button onClick={() => setActiveTab('store')} className={`flex items-center p-2 rounded-lg font-bold transition ${activeTab === 'store' ? 'text-emerald-700 bg-emerald-50' : 'text-gray-500 hover:bg-gray-100'}`}>
              {Icons.Store} <span className="hidden md:inline">Store</span>
            </button>
            <button onClick={() => setActiveTab('library')} className={`flex items-center p-2 rounded-lg font-bold transition ${activeTab === 'library' ? 'text-emerald-700 bg-emerald-50' : 'text-gray-500 hover:bg-gray-100'}`}>
              {Icons.Library} <span className="hidden md:inline">Library</span>
            </button>
            <button onClick={() => setActiveTab('cart')} className={`flex items-center p-2 rounded-lg font-bold transition ${activeTab === 'cart' ? 'text-emerald-700 bg-emerald-50' : 'text-gray-500 hover:bg-gray-100'}`}>
              {Icons.Cart} <span className="hidden md:inline">Cart</span>
              {cart.length > 0 && <span className="ml-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{cart.length}</span>}
            </button>
            <div className="h-6 w-px bg-gray-200 mx-1"></div>
            <button onClick={() => setActiveTab('admin')} className={`p-2 rounded-lg transition ${activeTab === 'admin' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-100'}`}>
              {Icons.Lock}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-5xl mx-auto p-4 md:p-6 w-full mb-10">
        
        {/* Storefront */}
        {activeTab === 'store' && (
          <div className="animate-fade-in">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl p-8 md:p-12 text-center text-white mb-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 relative z-10">Premium Notes & Solutions</h2>
              <p className="text-emerald-100 text-lg max-w-2xl mx-auto relative z-10">Top quality board standard materials by expert writers. Unlock your highest potential.</p>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {Icons.Search}
                </div>
                <input 
                  type="text" 
                  placeholder="Search for notes..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-sm transition"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                {['All', 'Physics', 'Chemistry', 'Higher Math', 'Admission Special'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-5 py-3 rounded-xl font-bold transition shadow-sm ${selectedCategory === cat ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <svg className="mx-auto h-24 w-24 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-gray-500 text-xl font-semibold">No notes found!</p>
                <p className="text-gray-400 mt-2">Try searching something else or switch categories.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => {
                  const inCart = cart.some(item => item.id === product.id);
                  const inLibrary = library.some(item => item.id === product.id);

                  return (
                    <div key={product.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col relative group transform hover:-translate-y-1">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
                      
                      <div className="flex justify-between items-start mb-4 z-10">
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">{product.category}</span>
                        <span className="text-3xl font-black text-gray-900">{product.isFree ? 'FREE' : `৳${product.price}`}</span>
                      </div>
                      
                      <h3 className="font-extrabold text-2xl text-gray-800 leading-tight mb-2 z-10">{product.title}</h3>
                      {product.writer && <p className="text-teal-600 font-semibold text-sm mb-3 z-10 flex items-center gap-1"><span className="text-lg">✍️</span> Writer: {product.writer}</p>}
                      <p className="text-gray-500 text-sm mb-8 flex-grow z-10 line-clamp-3 leading-relaxed">{product.description}</p>
                      
                      <div className="space-y-3 mt-auto z-10">
                        {product.demoLink && (
                          <a href={product.demoLink} target="_blank" rel="noreferrer" className="w-full flex justify-center items-center gap-2 border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> View Demo PDF
                          </a>
                        )}

                        {product.isFree ? (
                          <button 
                            onClick={() => handleGetFree(product)} disabled={inLibrary}
                            className={`w-full font-bold py-3 rounded-xl shadow transition flex justify-center items-center gap-2 ${inLibrary ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'}`}
                          >
                            {inLibrary ? '✓ Added to Library' : '📥 Get for Free'}
                          </button>
                        ) : (
                          <button 
                            onClick={() => { if(!inCart) setCart([...cart, product]); showToast('Added to cart!'); }}
                            disabled={inCart}
                            className={`w-full font-bold py-3 rounded-xl shadow transition flex justify-center items-center gap-2 ${inCart ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg'}`}
                          >
                            {inCart ? '✓ In Cart' : <>{Icons.Cart} Add to Cart</>}
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

        {/* Cart Checkout */}
        {activeTab === 'cart' && (
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
        )}

        {/* Library */}
        {activeTab === 'library' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-3xl font-extrabold mb-8 text-gray-900">My Digital Library</h2>
            {library.length === 0 ? (
               <div className="bg-white p-16 text-center rounded-3xl border border-gray-100 shadow-sm">
                 <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                 </div>
                 <h3 className="text-2xl font-bold text-gray-800 mb-2">Your library is empty</h3>
                 <p className="text-gray-500 text-lg max-w-md mx-auto">Purchase premium notes or grab the free ones from the store to access them here.</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {library.map((item, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500 flex flex-col hover:shadow-md transition">
                    <span className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">{item.category}</span>
                    <h3 className="font-extrabold text-xl mb-6 text-gray-800">{item.title}</h3>
                    <a href={item.mainLink || '#'} target="_blank" rel="noreferrer" className="mt-auto w-full text-center bg-gray-900 text-white hover:bg-gray-800 font-bold py-3 rounded-xl transition flex justify-center items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> Access Material
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Admin Dashboard */}
        {activeTab === 'admin' && (
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
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-5xl mx-auto p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 font-medium text-sm">© {new Date().getFullYear()} HSC Solution Hub. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-emerald-600 transition">Facebook</a>
            <a href="#" className="text-gray-400 hover:text-emerald-600 transition">YouTube</a>
            <a href="#" className="text-gray-400 hover:text-emerald-600 transition">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// RENDER LOGIC (THE FIX FOR NETLIFY BLANK PAGE)
// ==========================================
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
