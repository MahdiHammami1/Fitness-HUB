import { Toaster } from "@/component/ui/toaster";
import { Toaster as Sonner } from "@/component/ui/sonner";
import { TooltipProvider } from "@/component/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";
import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import { ProtectedRoute } from "@/component/ProtectedRoute";
import { AdminRoute } from "@/component/AdminRoute";
import { isAuthenticated } from "@/lib/api";

// Public Pages
import Index from "./pages/Index";
import Coaching from "./pages/Coaching";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import VerifyCode from "./pages/VerifyCode";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

// Admin Pages
import { AdminLayout } from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminCoaching from "./pages/admin/AdminCoaching";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminShop from "./pages/admin/AdminShop";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <CartProvider>
          <SiteSettingsProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                {/* Auth Routes - No authentication required */}
                <Route path="/" element={<ProtectedRoute element={<SignUp />} requiredAuth={false} />} />
                <Route path="/sign-up" element={<ProtectedRoute element={<SignUp />} requiredAuth={false} />} />
                <Route path="/sign-in" element={<ProtectedRoute element={<SignIn />} requiredAuth={false} />} />
                <Route path="/verify" element={<ProtectedRoute element={<VerifyCode />} requiredAuth={false} />} />
                <Route path="/forgot-password" element={<ProtectedRoute element={<ForgotPassword />} requiredAuth={false} />} />
                <Route path="/reset-password" element={<ProtectedRoute element={<ResetPassword />} requiredAuth={false} />} />
                
                {/* Public Routes - Authentication required */}
                <Route path="/home" element={<ProtectedRoute element={<Index />} requiredAuth={true} />} />
                <Route path="/coaching" element={<ProtectedRoute element={<Coaching />} requiredAuth={true} />} />
                <Route path="/events" element={<ProtectedRoute element={<Events />} requiredAuth={true} />} />
                <Route path="/events/:id" element={<ProtectedRoute element={<EventDetail />} requiredAuth={true} />} />
                <Route path="/shop" element={<ProtectedRoute element={<Shop />} requiredAuth={true} />} />
                <Route path="/shop/:id" element={<ProtectedRoute element={<ProductDetail />} requiredAuth={true} />} />
                <Route path="/cart" element={<ProtectedRoute element={<Cart />} requiredAuth={true} />} />
                <Route path="/checkout" element={<ProtectedRoute element={<Checkout />} requiredAuth={true} />} />
                <Route path="/about" element={<ProtectedRoute element={<About />} requiredAuth={true} />} />
                <Route path="/contact" element={<ProtectedRoute element={<Contact />} requiredAuth={true} />} />
                
                {/* Admin Routes - Admin role required */}
                <Route path="/admin" element={<AdminRoute element={<AdminLayout />} />}>
                  <Route index element={<Dashboard />} />
                  <Route path="coaching" element={<AdminCoaching />} />
                  <Route path="events" element={<AdminEvents />} />
                  <Route path="shop" element={<AdminShop />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SiteSettingsProvider>
        </CartProvider>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
