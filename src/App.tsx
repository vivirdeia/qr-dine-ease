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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
