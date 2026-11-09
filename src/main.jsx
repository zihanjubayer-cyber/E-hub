import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './config/firebase';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Store from './pages/Store';
import Checkout from './pages/Checkout'; // Cart এর বদলে Checkout
import Library from './pages/Library';
import Admin from './pages/Admin';
import Auth from './pages/Auth'; 
import PdfViewer from './components/PdfViewer';

const ADMIN_EMAILS = ['zihanjubayer@gmail.com', 'talhajubayer312@gmail.com']; 

function App() {
  const [activeTab, setActiveTab] = useState('store'); 
  const [products, setProducts] = useState([]);
  const [checkoutItem, setCheckoutItem] = useState(null); // কার্টের বদলে এখন Single Item
  const [library, setLibrary] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

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

  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  const openPdf = (url, title) => {
    setCurrentPdfUrl(url); setCurrentTitle(title); setViewerOpen(true);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type }); setTimeout(() => setToast(null), 3000);
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
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        if (ADMIN_EMAILS.includes(currentUser.email)) {
          fetchOrders();
        } else {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) setLibrary(userDoc.data().library || []);
          else setLibrary([]);
        }
      } else {
        setLibrary([]);
      }
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (ADMIN_EMAILS.includes(userCredential.user.email)) {
        showToast('Successfully logged in as Admin!'); setActiveTab('admin');
      } else {
        showToast('Access Denied! You are not an Admin.', 'error'); signOut(auth);
      }
    } catch (error) { showToast('Login failed!', 'error'); }
  };

  const handleLogout = () => {
    signOut(auth); showToast('Logged out'); setActiveTab('store');
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      if (newProduct.id) {
        await updateDoc(doc(db, "products", newProduct.id), {
          title: newProduct.title, category: newProduct.category, writer: newProduct.writer, description: newProduct.description, demoLink: newProduct.demoLink, mainLink: newProduct.mainLink, isFree: newProduct.isFree, price: newProduct.isFree ? 0 : Number(newProduct.price)
        });
        showToast("Product updated!");
      } else {
        await addDoc(collection(db, "products"), { ...newProduct, price: newProduct.isFree ? 0 : Number(newProduct.price) });
        showToast("Product added!");
      }
      setNewProduct({ title: '', price: '', category: 'Physics', writer: '', description: '', demoLink: '', mainLink: '', isFree: false });
      fetchData();
    } catch (error) {}
  };

  const handleDeleteProduct = async (id) => {
    if(window.confirm("Delete this note?")) {
      await deleteDoc(doc(db, "products", id)); showToast("Deleted!"); fetchData();
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, "settings", "store"), { paymentNumber: newPaymentNumber });
    setStoreSettings({ paymentNumber: newPaymentNumber }); showToast("Payment number updated!");
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "coupons"), { code: newCoupon.code.toUpperCase(), discount: Number(newCoupon.discount) });
    showToast("Coupon added!"); setNewCoupon({ code: '', discount: '' }); fetchData();
  };

  const applyCoupon = () => {
    const validCoupon = coupons.find(c => c.code === couponInput.toUpperCase());
    if (validCoupon) { setAppliedCoupon(validCoupon); showToast(`Coupon applied!`); } 
    else { showToast("Invalid coupon!", 'error'); setAppliedCoupon(null); }
  };

  // Buy Now বাটনের লজিক (Security Check)
  const handleBuyNow = (product) => {
    if (!user) {
      showToast('Please login or create an account to purchase notes!', 'error');
      setActiveTab('auth');
      return;
    }
    setCheckoutItem(product);
    setActiveTab('checkout');
  };

  // Checkout অর্ডার প্লেস করা
  const handleCheckout = async (e) => {
    e.preventDefault();
    const phone = e.target.phone.value;
    const trxId = e.target.trxId.value;
    const finalTotal = appliedCoupon ? checkoutItem.price - (checkoutItem.price * (appliedCoupon.discount / 100)) : checkoutItem.price;

    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        phone, trxId,
        product: checkoutItem, // সিঙ্গেল প্রডাক্ট সেভ হচ্ছে
        totalPaid: finalTotal, status: 'Pending', timestamp: new Date().toISOString()
      });
      showToast('Order submitted successfully! Wait for admin approval.');
      setCheckoutItem(null); setAppliedCoupon(null); setActiveTab('library');
    } catch (error) { showToast('Error submitting order', 'error'); }
  };

  const handleGetFree = async (product) => {
    if (!user) { showToast('Please login first!', 'error'); setActiveTab('auth'); return; }
    if(!library.find(item => item.id === product.id)) {
      const newLibrary = [...library, product];
      setLibrary(newLibrary);
      await setDoc(doc(db, "users", user.uid), { library: newLibrary }, { merge: true });
      showToast('Free note added to your library forever!');
    }
  };

  // অ্যাডমিন অ্যাপ্রুভ করার সাথে সাথে অটোমেটিক লাইব্রেরিতে পাঠানো (Magic Step 4)
  const handleApproveOrder = async (orderId, orderProduct, orderUserId) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: 'Approved' });
      
      if (orderUserId && orderProduct) {
        const userRef = doc(db, "users", orderUserId);
        const userSnap = await getDoc(userRef);
        let currentLib = userSnap.exists() ? (userSnap.data().library || []) : [];
        
        if (!currentLib.find(l => l.id === orderProduct.id)) {
          const updatedLib = [...currentLib, orderProduct];
          await setDoc(userRef, { library: updatedLib }, { merge: true });
        }
      }
      showToast('Order Approved & Material sent to student Library!');
      fetchOrders();
    } catch (error) { showToast('Error approving order', 'error'); }
  };

  const filteredProducts = products.filter(p => 
    (selectedCategory === 'All' || p.category === selectedCategory) &&
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans relative flex flex-col">
      {toast && (
        <div className={`fixed top-20 right-5 px-6 py-3 rounded-xl shadow-2xl z-50 text-white font-semibold transition-all duration-300 transform translate-y-0 opacity-100 ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-600'}`}>
          {toast.message}
        </div>
      )}

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} handleLogout={handleLogout} />

      <main className="flex-grow max-w-5xl mx-auto p-4 md:p-6 w-full mb-10">
        
        {activeTab === 'store' && (
          <Store searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} loading={loading} filteredProducts={filteredProducts} library={library} handleGetFree={handleGetFree} handleBuyNow={handleBuyNow} showToast={showToast} openPdf={openPdf} />
        )}

        {activeTab === 'checkout' && (
          <Checkout checkoutItem={checkoutItem} setActiveTab={setActiveTab} couponInput={couponInput} setCouponInput={setCouponInput} applyCoupon={applyCoupon} appliedCoupon={appliedCoupon} storeSettings={storeSettings} handleCheckout={handleCheckout} />
        )}

        {activeTab === 'library' && (
          <Library library={library} openPdf={openPdf} />
        )}

        {activeTab === 'admin' && (
          <Admin isAdmin={isAdmin} user={user} handleLogout={handleLogout} handleLogin={handleLogin} email={email} setEmail={setEmail} password={password} setPassword={setPassword} handleSaveSettings={handleSaveSettings} newPaymentNumber={newPaymentNumber} setNewPaymentNumber={setNewPaymentNumber} storeSettings={storeSettings} handleAddCoupon={handleAddCoupon} newCoupon={newCoupon} setNewCoupon={setNewCoupon} handleAddProduct={handleAddProduct} newProduct={newProduct} setNewProduct={setNewProduct} orders={orders} handleApproveOrder={handleApproveOrder} products={products} handleDeleteProduct={handleDeleteProduct} />
        )}

        {activeTab === 'auth' && (
          <Auth showToast={showToast} setActiveTab={setActiveTab} />
        )}

      </main>
      <Footer />
      <PdfViewer isOpen={viewerOpen} onClose={() => setViewerOpen(false)} pdfUrl={currentPdfUrl} title={currentTitle} />
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) { createRoot(rootElement).render(<App />); }
