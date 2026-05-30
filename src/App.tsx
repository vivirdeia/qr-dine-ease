import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp, type Role } from "./context/AppContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import PublicRestaurant from "./pages/PublicRestaurant";
import SuperAdmin from "./pages/SuperAdmin";
import NotFound from "./pages/NotFound";
import Privacidad from "./pages/legal/Privacidad";
import Terminos from "./pages/legal/Terminos";
import CookiesPage from "./pages/legal/Cookies";
import GDPR from "./pages/legal/GDPR";
import SobreNosotros from "./pages/info/SobreNosotros";
import Contacto from "./pages/info/Contacto";
import Caracteristicas from "./pages/info/Caracteristicas";
import Pricing from "./pages/info/Pricing";
import Demo from "./pages/info/Demo";
import Changelog from "./pages/info/Changelog";
import Ayuda from "./pages/info/Ayuda";
import Guias from "./pages/info/Guias";
import ApiDocs from "./pages/info/ApiDocs";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: Role | Role[] }) => {
  const { isLoggedIn, role } = useApp();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!role || !roles.includes(role)) {
      return <Navigate to={role === "superadmin" ? "/admin" : "/dashboard"} replace />;
    }
  }
  return <>{children}</>;
};

const RedirectIfLoggedIn = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, role } = useApp();
  if (isLoggedIn) return <Navigate to={role === "superadmin" ? "/admin" : "/dashboard"} replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<RedirectIfLoggedIn><Login /></RedirectIfLoggedIn>} />
            <Route path="/register" element={<RedirectIfLoggedIn><Register /></RedirectIfLoggedIn>} />
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole={["owner", "staff"]}><Dashboard /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="superadmin"><SuperAdmin /></ProtectedRoute>
            } />
            <Route path="/r/:slug" element={<PublicRestaurant />} />
            <Route path="/caracteristicas" element={<Caracteristicas />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/ayuda" element={<Ayuda />} />
            <Route path="/guias" element={<Guias />} />
            <Route path="/api-docs" element={<ApiDocs />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="/terminos" element={<Terminos />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/gdpr" element={<GDPR />} />
            <Route path="/sobre-nosotros" element={<SobreNosotros />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
