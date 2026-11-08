import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './config/firebase';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Store from './pages/Store';
import Cart from './pages/Cart';
import Library from './pages/Library';
import Admin from './pages/Admin';
import PdfViewer from './components/PdfViewer'; // পিডিএফ ভিউয়ার ইমপোর্ট করা হলো

function App() {
  const [activeTab, setActiveTab] = useState('store'); 
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
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

  // পিডিএফ ভিউয়ারের মেইন কন্ট্রোলার (স্টেট)
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');

  // পিডিএফ ওপেন করার গ্লোবাল ফাংশন
  const openPdf = (url, title) => {
    setCurrentPdfUrl(url);
    setCurrentTitle(title);
    setViewerOpen(true);
  };

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

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} cartCount={cart.length} />

      <main className="flex-grow max-w-5xl mx-auto p-4 md:p-6 w-full mb-10">
        
        {activeTab === 'store' && (
          <Store 
            searchTerm={searchTerm} setSearchTerm={setSearchTerm} 
            selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} 
            loading={loading} filteredProducts={filteredProducts} 
            cart={cart} setCart={setCart} library={library} 
            handleGetFree={handleGetFree} showToast={showToast} 
            openPdf={openPdf} // Store-এ পিডিএফ ওপেন করার পাওয়ার দেওয়া হলো
          />
        )}

        {activeTab === 'cart' && (
          <Cart 
            cart={cart} removeFromCart={removeFromCart} setActiveTab={setActiveTab} 
            couponInput={couponInput} setCouponInput={setCouponInput} 
            applyCoupon={applyCoupon} appliedCoupon={appliedCoupon} 
            cartTotal={cartTotal} finalTotal={finalTotal} 
            storeSettings={storeSettings} handleCheckout={handleCheckout} 
          />
        )}

        {activeTab === 'library' && (
          <Library 
            library={library} 
            openPdf={openPdf} // Library-তে পিডিএফ ওপেন করার পাওয়ার দেওয়া হলো
          />
        )}

        {activeTab === 'admin' && (
          <Admin 
            user={user} handleLogout={handleLogout} handleLogin={handleLogin} 
            email={email} setEmail={setEmail} password={password} setPassword={setPassword} 
            handleSaveSettings={handleSaveSettings} newPaymentNumber={newPaymentNumber} setNewPaymentNumber={setNewPaymentNumber} 
            storeSettings={storeSettings} handleAddCoupon={handleAddCoupon} newCoupon={newCoupon} setNewCoupon={setNewCoupon} 
            handleAddProduct={handleAddProduct} newProduct={newProduct} setNewProduct={setNewProduct} 
            orders={orders} handleApproveOrder={handleApproveOrder} products={products} handleDeleteProduct={handleDeleteProduct} 
          />
        )}

      </main>

      <Footer />
      
      {/* গ্লোবাল পিডিএফ ভিউয়ার (সবার জন্য একটাই) */}
      <PdfViewer 
        isOpen={viewerOpen} 
        onClose={() => setViewerOpen(false)} 
        pdfUrl={currentPdfUrl} 
        title={currentTitle} 
      />
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
