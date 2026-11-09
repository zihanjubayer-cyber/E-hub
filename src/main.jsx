import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './config/firebase';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Store from './pages/Store';
import Checkout from './pages/Checkout';
import Library from './pages/Library';
import Admin from './pages/Admin';
import Auth from './pages/Auth'; 
import PdfViewer from './components/PdfViewer';

const ADMIN_EMAILS = ['zihanjubayer@gmail.com', 'talhajubayer312@gmail.com']; 

function App() {
  const [activeTab, setActiveTab] = useState('store'); 
  const [products, setProducts] = useState([]);
  const [checkoutItem, setCheckoutItem] = useState(null); 
  const [library, setLibrary] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [storeSettings, setStoreSettings] = useState({ bkashNumber: '01XXXXXXXXX', nagadNumber: '01XXXXXXXXX' });
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState([]);
  
  // ক্যাটাগরি Physics I করে দেওয়া হলো
  const [newProduct, setNewProduct] = useState({ 
    serial: 1, title: '', price: '', category: 'Physics I', writer: '', description: '', demoLink: '', mainLink: '', isFree: false 
  });
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '' });
  
  const [newBkash, setNewBkash] = useState('');
  const [newNagad, setNewNagad] = useState('');

  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  const openPdf = (url, title) => { setCurrentPdfUrl(url); setCurrentTitle(title); setViewerOpen(true); };
  const showToast = (message, type = 'success') => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

  const fetchData = async () => {
    setLoading(true);
    try {
      const prodSnap = await getDocs(collection(db, "products"));
      const fetchedProducts = prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // 🛑 ম্যাজিক সর্টিং: সিরিয়াল না থাকলে সেটিকে 9999 ধরে নিচে পাঠিয়ে দেওয়া হবে
      fetchedProducts.sort((a, b) => (Number(a.serial) || 9999) - (Number(b.serial) || 9999));
      
      setProducts(fetchedProducts);
      
      const settingsDoc = await getDoc(doc(db, "settings", "store"));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        setStoreSettings(data);
        setNewBkash(data.bkashNumber || '');
        setNewNagad(data.nagadNumber || '');
      }

      const couponSnap = await getDocs(collection(db, "coupons"));
      setCoupons(couponSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        if (ADMIN_EMAILS.includes(currentUser.email)) fetchOrders();
        else {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) setLibrary(userDoc.data().library || []);
          else setLibrary([]);
        }
      } else setLibrary([]);
    });
    return () => unsubscribe();
  }, []);

  const fetchOrders = async () => {
    const querySnapshot = await getDocs(collection(db, "orders"));
    const fetchedOrders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    fetchedOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setOrders(fetchedOrders);
  };

  const handleLogin = async (e) => { 
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (ADMIN_EMAILS.includes(userCredential.user.email)) { showToast('Successfully logged in as Admin!'); setActiveTab('admin'); } 
      else { showToast('Access Denied!', 'error'); signOut(auth); }
    } catch (error) { showToast('Login failed!', 'error'); }
  };
  const handleLogout = () => { signOut(auth); showToast('Logged out'); setActiveTab('store'); };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...newProduct,
        serial: Number(newProduct.serial) || 9999, // ইনপুট না দিলে 9999 ধরে নেবে
        price: newProduct.isFree ? 0 : Number(newProduct.price)
      };
      
      if (newProduct.id) {
        await updateDoc(doc(db, "products", newProduct.id), productData);
        showToast("Product updated!");
      } else {
        await addDoc(collection(db, "products"), productData);
        showToast("Product added!");
      }
      setNewProduct({ serial: 1, title: '', price: '', category: 'Physics I', writer: '', description: '', demoLink: '', mainLink: '', isFree: false });
      fetchData();
    } catch (error) {}
  };

  const handleDeleteProduct = async (id) => {
    if(window.confirm("Delete this note?")) { await deleteDoc(doc(db, "products", id)); showToast("Deleted!"); fetchData(); }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, "settings", "store"), { bkashNumber: newBkash, nagadNumber: newNagad });
    setStoreSettings({ bkashNumber: newBkash, nagadNumber: newNagad }); showToast("Payment numbers updated!");
  };

  const handleAddCoupon = async (e) => { 
    e.preventDefault(); await addDoc(collection(db, "coupons"), { code: newCoupon.code.toUpperCase(), discount: Number(newCoupon.discount) });
    showToast("Coupon added!"); setNewCoupon({ code: '', discount: '' }); fetchData();
  };
  const applyCoupon = () => {
    const validCoupon = coupons.find(c => c.code === couponInput.toUpperCase());
    if (validCoupon) { setAppliedCoupon(validCoupon); showToast(`Coupon applied!`); } else { showToast("Invalid coupon!", 'error'); setAppliedCoupon(null); }
  };

  const handleBuyNow = (product) => {
    if (!user) { showToast('Please login to purchase notes!', 'error'); setActiveTab('auth'); return; }
    setCheckoutItem(product); setActiveTab('checkout');
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    const phone = e.target.phone.value;
    const trxId = e.target.trxId.value;
    const paymentMethod = e.target.paymentMethod.value;
    const finalTotal = appliedCoupon ? checkoutItem.price - (checkoutItem.price * (appliedCoupon.discount / 100)) : checkoutItem.price;

    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid, phone, trxId, paymentMethod, product: checkoutItem,
        totalPaid: finalTotal, status: 'Pending', timestamp: new Date().toISOString()
      });
      showToast('Order submitted successfully!');
      setCheckoutItem(null); setAppliedCoupon(null); setActiveTab('library');
    } catch (error) { showToast('Error submitting order', 'error'); }
  };

  const handleGetFree = async (product) => { 
    if (!user) { showToast('Please login first!', 'error'); setActiveTab('auth'); return; }
    if(!library.find(item => item.id === product.id)) {
      const newLibrary = [...library, product];
      setLibrary(newLibrary);
      await setDoc(doc(db, "users", user.uid), { library: newLibrary }, { merge: true });
      showToast('Free note added!');
    }
  };

  const handleApproveOrder = async (orderId, orderProduct, orderUserId) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: 'Approved' });
      if (orderUserId && orderProduct) {
        const userRef = doc(db, "users", orderUserId);
        const userSnap = await getDoc(userRef);
        let currentLib = userSnap.exists() ? (userSnap.data().library || []) : [];
        if (!currentLib.find(l => l.id === orderProduct.id)) {
          await setDoc(userRef, { library: [...currentLib, orderProduct] }, { merge: true });
        }
      }
      showToast('Order Approved & Sent to Student!'); fetchOrders();
    } catch (error) { showToast('Error approving order', 'error'); }
  };

  const handleDeleteOrder = async (orderId) => {
    if(window.confirm("Are you sure you want to permanently delete this order record?")) {
      try {
        await deleteDoc(doc(db, "orders", orderId));
        showToast("Order record deleted!");
        fetchOrders();
      } catch (error) { showToast('Error deleting order', 'error'); }
    }
  };

  const filteredProducts = products.filter(p => 
    (selectedCategory === 'All' || p.category === selectedCategory) &&
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans relative flex flex-col">
      {toast && <div className={`fixed top-20 right-5 px-6 py-3 rounded-xl shadow-2xl z-50 text-white font-semibold transition-all ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-600'}`}>{toast.message}</div>}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} handleLogout={handleLogout} />
      <main className="flex-grow max-w-5xl mx-auto p-4 md:p-6 w-full mb-10">
        {activeTab === 'store' && <Store searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} loading={loading} filteredProducts={filteredProducts} library={library} handleGetFree={handleGetFree} handleBuyNow={handleBuyNow} showToast={showToast} openPdf={openPdf} />}
        {activeTab === 'checkout' && <Checkout checkoutItem={checkoutItem} setActiveTab={setActiveTab} couponInput={couponInput} setCouponInput={setCouponInput} applyCoupon={applyCoupon} appliedCoupon={appliedCoupon} storeSettings={storeSettings} handleCheckout={handleCheckout} />}
        {activeTab === 'library' && <Library library={library} openPdf={openPdf} />}
        {activeTab === 'admin' && <Admin isAdmin={isAdmin} user={user} handleLogout={handleLogout} handleLogin={handleLogin} email={email} setEmail={setEmail} password={password} setPassword={setPassword} handleSaveSettings={handleSaveSettings} newBkash={newBkash} setNewBkash={setNewBkash} newNagad={newNagad} setNewNagad={setNewNagad} storeSettings={storeSettings} handleAddCoupon={handleAddCoupon} newCoupon={newCoupon} setNewCoupon={setNewCoupon} handleAddProduct={handleAddProduct} newProduct={newProduct} setNewProduct={setNewProduct} orders={orders} handleApproveOrder={handleApproveOrder} handleDeleteOrder={handleDeleteOrder} products={products} handleDeleteProduct={handleDeleteProduct} />}
        {activeTab === 'auth' && <Auth showToast={showToast} setActiveTab={setActiveTab} />}
      </main>
      <Footer />
      <PdfViewer isOpen={viewerOpen} onClose={() => setViewerOpen(false)} pdfUrl={currentPdfUrl} title={currentTitle} />
    </div>
  );
}
const rootElement = document.getElementById('root');
if (rootElement) { createRoot(rootElement).render(<App />); }
