
import MobileBottomNav from "./components/MobileBottomNav";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";

const DesktopHome = lazy(() => import("./components/DesktopHome"));
const ProductRoute = lazy(() => import("./components/ProductRoute"));
const CartRoute = lazy(() => import("./components/CartRoute"));
const ProductDisplay = lazy(() => import("./components/ProductDisplay"));

const Home = lazy(() => import("./pages/Home"));
const Categories = lazy(() => import("./pages/Categories"));

const AuthPage = lazy(() => import("./components/AuthPage"));
const AccountPage = lazy(() => import("./components/AccountPage"));
const ManageAddressPage = lazy(() => import("./components/ManageAddressPage"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const SubcategoryDisplay = lazy(() => import("./components/SubcategoryDisplay"));
const Orders = lazy(() => import("./components/Orders"));
const WholesaleOrders = lazy(() => import("./components/WholesaleOrders"));
const FAQPage = lazy(() => import("./components/FAQPage"));
const AboutUs = lazy(() => import("./components/AboutUs"));
const ContactUs = lazy(() => import("./components/ContactUs"));
const NewlyLaunched = lazy(() => import("./components/NewlyLaunched"));


function App() {
  return (
    <>
      <Toaster position="top-right" />
      {/* ✅ DESKTOP ROUTES */}
      <div className="hidden md:block">
        <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Routes>
          <Route path="/" element={<DesktopHome />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/product/:id" element={<ProductRoute />} />
          <Route path="/auth" element={<AuthPage />} /> {/* ✅ added */}
          <Route path="/account" element={<AccountPage />} />
          <Route path="/manage-address" element={<ManageAddressPage />} />
          <Route path="/cart" element={<CartRoute />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/subcategory/:subCategoryName" element={<SubcategoryDisplay />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/wholesale-orders" element={<WholesaleOrders />} />
          <Route path="/faqs" element={<FAQPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/newly-launched" element={<NewlyLaunched />} />
        </Routes>
  </Suspense>
</div>

      {/* ✅ MOBILE ROUTES */}
      <div className="block md:hidden">
        <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/cart" element={<CartRoute />} />
          <Route path="/product/:id" element={<ProductRoute />} />
          <Route path="/auth" element={<AuthPage />} /> {/* ✅ added */}
          <Route path="/account" element={<AccountPage />} />
          <Route path="/manage-address" element={<ManageAddressPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/subcategory/:subCategoryName" element={<SubcategoryDisplay />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/wholesale-orders" element={<WholesaleOrders />} />
          <Route path="/faqs" element={<FAQPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/newly-launched" element={<NewlyLaunched />} />
        </Routes>

        <MobileBottomNav />
        </Suspense>
      </div>
    </>
  );
}

export default App;