import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
// 🛑 এখানে onSnapshot ইমপোর্ট করা হয়েছে রিয়েল-টাইম নোটিফিকেশনের জন্য
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
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
  
  const [newProduct, setNewProduct] = useState({ 
    serial: 1, title: '', price: '', category: 'Physics I', writer: '', description: '', demoLink: '', mainLink: '', isFree: false 
  });
  
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

  // 🛑 রিয়েল-টাইম অর্ডার নোটিফিকেশন সিস্টেম
  useEffect(() => {
    fetchData();
    let unsubscribeOrders = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        if (ADMIN_EMAILS.includes(currentUser.email)) {
          // অ্যাডমিন লগইন করলে রিয়েল-টাইম লিসেনার অন হয়ে যাবে
          unsubscribeOrders = onSnapshot(collection(db, "orders"), (snapshot) => {
            const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            fetchedOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            // নতুন কোনো অর্ডার আসলে নোটিফিকেশন (Toast) শো করানোর লজিক
            snapshot.docChanges().forEach((change) => {
              if (change.type === "added") {
                const newOrder = change.doc.data();
                const orderTime = new Date(newOrder.timestamp).getTime();
                const now = new Date().getTime();
                // যদি গত ১০ সেকেন্ডের মধ্যে নতুন অর্ডার তৈরি হয়ে থাকে, তবেই সাউন্ড/নোটিফিকেশন আসবে
                if (now - orderTime < 10000 && newOrder.status === 'Pending') {
                  showToast(`🔔 New Order from ${newOrder.phone}!`);
                }
              }
            });
            setOrders(fetchedOrders);
          });
        } else {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) setLibrary(userDoc.data().library || []);
          else setLibrary([]);
        }
      } else {
        setLibrary([]);
        if (unsubscribeOrders) unsubscribeOrders();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeOrders) unsubscribeOrders();
    };
  }, []);

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
        ...newProduct, serial: Number(newProduct.serial) || 9999, price: newProduct.isFree ? 0 : Number(newProduct.price)
      };
      if (newProduct.id) { await updateDoc(doc(db, "products", newProduct.id), productData); showToast("Product updated!"); } 
      else { await addDoc(collection(db, "products"), productData); showToast("Product added!"); }
      setNewProduct({ serial: 1, title: '', price: '', category: 'Physics I', writer: '', description: '', demoLink: '', mainLink: '', isFree: false });
      fetchData();
    } catch (error) {}
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, "settings", "store"), { bkashNumber: newBkash, nagadNumber: newNagad });
    setStoreSettings({ bkashNumber: newBkash, nagadNumber: newNagad }); showToast("Payment numbers updated!");
  };

  const handleAddCoupon = async (e) => { 
    e.preventDefault(); await addDoc(collection(db, "coupons"), { code: newCoupon.code.toUpperCase(), discount: Number(newCoupon.discount) });
    showToast("Coupon added successfully!"); setNewCoupon({ code: '', discount: '' }); fetchData();
  };

  const applyCoupon = () => {
    if (!couponInput) { showToast("Please enter a coupon code", 'error'); return; }
    const validCoupon = coupons.find(c => c.code === couponInput.toUpperCase());
    if (validCoupon) { setAppliedCoupon(validCoupon); showToast(`${validCoupon.discount}% Discount Applied!`); } 
    else { showToast("Invalid or expired coupon!", 'error'); setAppliedCoupon(null); }
  };

  const removeCoupon = () => { setAppliedCoupon(null); setCouponInput(''); showToast("Coupon removed"); };

  const handleBuyNow = (product) => {
    if (!user) { showToast('Please login to purchase notes!', 'error'); setActiveTab('auth'); return; }
    setCheckoutItem(product); setActiveTab('checkout'); setAppliedCoupon(null); setCouponInput(''); 
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    const phone = e.target.phone.value; const trxId = e.target.trxId.value; const paymentMethod = e.target.paymentMethod.value;
    const finalTotal = appliedCoupon ? checkoutItem.price - (checkoutItem.price * (appliedCoupon.discount / 100)) : checkoutItem.price;

    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid, phone, trxId, paymentMethod, product: checkoutItem,
        totalPaid: finalTotal, status: 'Pending', timestamp: new Date().toISOString()
      });
      showToast('Order submitted successfully!');
      setCheckoutItem(null); setAppliedCoupon(null); setCouponInput(''); setActiveTab('library');
    } catch (error) { showToast('Error submitting order', 'error'); }
  };

  const handleGetFree = async (product) => { 
    if (!user) { showToast('Please login first!', 'error'); setActiveTab('auth'); return; }
    if(!library.find(item => item.id === product.id)) {
      const newLibrary = [...library, product]; setLibrary(newLibrary);
      await setDoc(doc(db, "users", user.uid), { library: newLibrary }, { merge: true }); showToast('Free note added!');
    }
  };

  // 🛑 নিচের ডিলিট লজিকগুলো থেকে window.confirm সরানো হয়েছে কারণ এডমিন পেজে কাস্টম মোডাল আছে
  const handleDeleteProduct = async (id) => {
    try { await deleteDoc(doc(db, "products", id)); showToast("Deleted!"); fetchData(); } catch(e){}
  };

  const handleDeleteCoupon = async (id) => {
    try { await deleteDoc(doc(db, "coupons", id)); showToast("Coupon removed!"); fetchData(); } catch(e){}
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
      showToast('Order Approved & Sent to Student!'); 
      // fetchOrders() বাদ দেওয়া হয়েছে, কারণ onSnapshot অটোমেটিক লাইভ আপডেট করবে
    } catch (error) { showToast('Error approving order', 'error'); }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteDoc(doc(db, "orders", orderId));
      showToast("Order record deleted!");
    } catch (error) { showToast('Error deleting order', 'error'); }
  };

  const filteredProducts = products.filter(p => (selectedCategory === 'All' || p.category === selectedCategory) && p.title.toLowerCase().includes(searchTerm.toLowerCase()));
  
  // 🛑 Pending অর্ডারের সংখ্যা কাউন্ট করা হচ্ছে (ব্যাজের জন্য)
  const pendingCount = orders.filter(o => o.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans relative flex flex-col">
      {toast && <div className={`fixed top-20 right-5 px-6 py-3 rounded-xl shadow-2xl z-50 text-white font-semibold transition-all ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-600'}`}>{toast.message}</div>}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} handleLogout={handleLogout} />
      <main className="flex-grow max-w-5xl mx-auto p-4 md:p-6 w-full mb-10">
        {activeTab === 'store' && <Store searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} loading={loading} filteredProducts={filteredProducts} library={library} handleGetFree={handleGetFree} handleBuyNow={handleBuyNow} showToast={showToast} openPdf={openPdf} />}
        {activeTab === 'checkout' && <Checkout checkoutItem={checkoutItem} setActiveTab={setActiveTab} couponInput={couponInput} setCouponInput={setCouponInput} applyCoupon={applyCoupon} appliedCoupon={appliedCoupon} removeCoupon={removeCoupon} storeSettings={storeSettings} handleCheckout={handleCheckout} />}
        {activeTab === 'library' && <Library library={library} openPdf={openPdf} />}
        
        {/* 🛑 Admin-এ pendingCount পাঠানো হলো */}
        {activeTab === 'admin' && <Admin pendingCount={pendingCount} isAdmin={isAdmin} user={user} handleLogout={handleLogout} handleLogin={handleLogin} email={email} setEmail={setEmail} password={password} setPassword={setPassword} handleSaveSettings={handleSaveSettings} newBkash={newBkash} setNewBkash={setNewBkash} newNagad={newNagad} setNewNagad={setNewNagad} storeSettings={storeSettings} handleAddCoupon={handleAddCoupon} newCoupon={newCoupon} setNewCoupon={setNewCoupon} coupons={coupons} handleDeleteCoupon={handleDeleteCoupon} handleAddProduct={handleAddProduct} newProduct={newProduct} setNewProduct={setNewProduct} orders={orders} handleApproveOrder={handleApproveOrder} handleDeleteOrder={handleDeleteOrder} products={products} handleDeleteProduct={handleDeleteProduct} />}
        
        {activeTab === 'auth' && <Auth showToast={showToast} setActiveTab={setActiveTab} />}
      </main>
      <Footer />
      <PdfViewer isOpen={viewerOpen} onClose={() => setViewerOpen(false)} pdfUrl={currentPdfUrl} title={currentTitle} />
    </div>
  );
}
const rootElement = document.getElementById('root');
if (rootElement) { createRoot(rootElement).render(<App />); }
