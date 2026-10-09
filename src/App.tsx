import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { ToastContainer } from './components/common/Toast';
import { SearchModal } from './components/common/SearchModal';
import { QuickViewModal } from './components/common/QuickViewModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CustomerAccountModal } from './components/account/CustomerAccountModal';

// Home Section Components
import { HeroSection } from './components/home/HeroSection';
import { TrustFeatures } from './components/home/TrustFeatures';
import { CategorySection } from './components/home/CategorySection';
import { FeaturedProducts } from './components/home/FeaturedProducts';
import { FlashSale } from './components/home/FlashSale';
import { NewArrivals } from './components/home/NewArrivals';
import { PromoBanner } from './components/home/PromoBanner';

// Route Components
import { ShopPage } from './components/shop/ShopPage';
import { ProductDetailPage } from './components/product/ProductDetailPage';
import { CartPage } from './components/cart/CartPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderSuccessPage } from './components/checkout/OrderSuccessPage';
import { OrderTrackingPage } from './components/tracking/OrderTrackingPage';
import { CustomerAccountPage } from './components/account/CustomerAccountPage';
import { WishlistPage } from './components/wishlist/WishlistPage';
import { AboutPage } from './components/info/AboutPage';
import { ContactPage } from './components/info/ContactPage';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AccessDenied } from './components/admin/AccessDenied';

const AppContent: React.FC = () => {
  const { activePage, isAdminAuthenticated } = useStore();
  const [showAccessDenied, setShowAccessDenied] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      // If user directly attempted deep admin path without authentication
      if (
        (hash.includes('/dashboard') ||
          hash.includes('/products') ||
          hash.includes('/orders') ||
          hash.includes('/customers') ||
          hash.includes('/payments') ||
          hash.includes('/analytics') ||
          hash.includes('/settings') ||
          path.includes('/admin/')) &&
        !localStorage.getItem('storetech_admin_auth_v2')
      ) {
        return true;
      }
    }
    return false;
  });

  const isAdminView = activePage === 'admin';

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50 selection:bg-cyan-500 selection:text-slate-950">
      {/* Toast notifications */}
      <ToastContainer />

      {/* Global Modals & Drawers */}
      <SearchModal />
      <QuickViewModal />
      <CartDrawer />
      <CustomerAccountModal />

      {/* Admin Route Protection */}
      {isAdminView ? (
        isAdminAuthenticated ? (
          <AdminDashboard />
        ) : showAccessDenied ? (
          <AccessDenied onGoToLogin={() => setShowAccessDenied(false)} />
        ) : (
          <AdminLogin />
        )
      ) : (
        /* Store Front Experience */
        <>
          <Header />

          <main className="grow">
            {activePage === 'home' && (
              <>
                <HeroSection />
                <TrustFeatures />
                <CategorySection />
                <FeaturedProducts />
                <FlashSale />
                <NewArrivals />
                <PromoBanner />
              </>
            )}

            {activePage === 'shop' && <ShopPage />}
            {activePage === 'product' && <ProductDetailPage />}
            {activePage === 'cart' && <CartPage />}
            {activePage === 'checkout' && <CheckoutPage />}
            {activePage === 'order-success' && <OrderSuccessPage />}
            {activePage === 'order-tracking' && <OrderTrackingPage />}
            {activePage === 'account' && <CustomerAccountPage />}
            {activePage === 'wishlist' && <WishlistPage />}
            {activePage === 'about' && <AboutPage />}
            {activePage === 'contact' && <ContactPage />}
          </main>

          <Footer />
          <WhatsAppButton />
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
