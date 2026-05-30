import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp, type Role } from "@/context/AppContext";
import { toast } from "sonner";
import {
  Shield, LogOut, UtensilsCrossed, Users, Store, TrendingUp,
  Pause, Play, Trash2, LogIn, ChevronDown, Search,
} from "lucide-react";

const planPrice = { free: 0, pro: 29, business: 59 } as const;
const roleLabel: Record<Role, string> = { superadmin: "Super Admin", owner: "Propietario", staff: "Empleado" };

const SuperAdmin = () => {
  const navigate = useNavigate();
  const {
    tenants, users, allData, currentUser, logout,
    setTenantPlan, suspendTenant, deleteTenant, impersonate,
  } = useApp();

  const [tab, setTab] = useState<"overview" | "tenants" | "users">("overview");
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    const totalRestaurants = tenants.length;
    const totalUsers = users.length;
    const totalReservations = Object.values(allData).reduce((s, d) => s + d.reservations.length, 0);
    const totalDishes = Object.values(allData).reduce((s, d) => s + d.dishes.length, 0);
    const mrr = tenants.reduce((s, t) => s + (t.suspended ? 0 : planPrice[t.plan]), 0);
    const byPlan = {
      free: tenants.filter(t => t.plan === "free").length,
      pro: tenants.filter(t => t.plan === "pro").length,
      business: tenants.filter(t => t.plan === "business").length,
    };
    return { totalRestaurants, totalUsers, totalReservations, totalDishes, mrr, byPlan };
  }, [tenants, users, allData]);

  const filteredTenants = tenants.filter(t => {
    if (!search) return true;
    const q = search.toLowerCase();
    const data = allData[t.id];
    return t.slug.toLowerCase().includes(q) || data?.restaurant.name.toLowerCase().includes(q);
  });

  const filteredUsers = users.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q);
  });

  const handleImpersonate = (userId: string) => {
    impersonate(userId);
    toast.success("Sesión iniciada como ese usuario");
    navigate("/dashboard");
  };

  const handleDeleteTenant = (id: string, name: string) => {
    if (!confirm(`¿Eliminar el restaurante "${name}" y todos sus datos?`)) return;
    deleteTenant(id);
    toast.success("Restaurante eliminado");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" strokeWidth={1.5} />
            <span className="font-semibold text-sm">Carta · Admin</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">{currentUser?.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <UtensilsCrossed className="h-4 w-4 mr-1" strokeWidth={1.5} /> Ver sitio
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { logout(); navigate("/login"); }}>
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 flex gap-6 -mb-px">
          {([
            { id: "overview", label: "Resumen", icon: TrendingUp },
            { id: "tenants", label: `Restaurantes (${tenants.length})`, icon: Store },
            { id: "users", label: `Usuarios (${users.length})`, icon: Users },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 py-3 text-sm border-b-2 transition-colors ${tab === t.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <t.icon className="h-4 w-4" strokeWidth={1.5} /> {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {tab === "overview" && (
          <>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight mb-1">Resumen global</h1>
              <p className="text-sm text-muted-foreground">Métricas agregadas de todos los tenants.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "MRR (sim.)", value: `€${stats.mrr}` },
                { label: "Restaurantes", value: stats.totalRestaurants },
                { label: "Usuarios", value: stats.totalUsers },
                { label: "Reservas", value: stats.totalReservations },
              ].map(s => (
                <div key={s.label} className="border border-border rounded-lg p-5 bg-card">
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                  <div className="text-2xl font-semibold mt-1">{s.value}</div>
                </div>
              ))}
            </div>
            <div className="border border-border rounded-lg p-6 bg-card">
              <h2 className="text-sm font-medium mb-4">Distribución por plan</h2>
              <div className="grid grid-cols-3 gap-4">
                {(["free", "pro", "business"] as const).map(p => (
                  <div key={p} className="flex items-end justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">{p}</div>
                      <div className="text-3xl font-semibold mt-1">{stats.byPlan[p]}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">€{planPrice[p]}/mes</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {(tab === "tenants" || tab === "users") && (
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={tab === "tenants" ? "Buscar restaurante..." : "Buscar usuario..."}
              className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-background text-sm focus:ring-2 focus:ring-foreground/10 focus:border-foreground outline-none" />
          </div>
        )}

        {tab === "tenants" && (
          <div className="border border-border rounded-lg bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-background-muted text-xs text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Restaurante</th>
                  <th className="text-left px-4 py-3 font-medium">Slug</th>
                  <th className="text-left px-4 py-3 font-medium">Plan</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Platos / Reservas</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Estado</th>
                  <th className="text-right px-4 py-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.map(t => {
                  const data = allData[t.id];
                  const owner = users.find(u => u.id === t.ownerId);
                  return (
                    <tr key={t.id} className="border-t border-border-subtle hover:bg-background-muted">
                      <td className="px-4 py-3">
                        <div className="font-medium">{data?.restaurant.name || "—"}</div>
                        <div className="text-xs text-muted-foreground">{owner?.email}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{t.slug}</td>
                      <td className="px-4 py-3">
                        <select value={t.plan} onChange={e => setTenantPlan(t.id, e.target.value as any)}
                          className="text-xs h-8 px-2 rounded-md border border-border bg-background">
                          <option value="free">Free</option>
                          <option value="pro">Pro</option>
                          <option value="business">Business</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                        {data?.dishes.length ?? 0} / {data?.reservations.length ?? 0}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {t.suspended
                          ? <span className="text-xs px-2 py-0.5 rounded-md border border-border bg-background-muted text-foreground-muted">Suspendido</span>
                          : <span className="text-xs px-2 py-0.5 rounded-md border border-border bg-background-muted text-foreground-muted">Activo</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {owner && (
                            <button onClick={() => handleImpersonate(owner.id)} title="Iniciar sesión como propietario"
                              className="p-2 hover:bg-background-muted rounded-md">
                              <LogIn className="h-4 w-4" strokeWidth={1.5} />
                            </button>
                          )}
                          <button onClick={() => suspendTenant(t.id, !t.suspended)} title={t.suspended ? "Reactivar" : "Suspender"}
                            className="p-2 hover:bg-background-muted rounded-md">
                            {t.suspended
                              ? <Play className="h-4 w-4" strokeWidth={1.5} />
                              : <Pause className="h-4 w-4" strokeWidth={1.5} />}
                          </button>
                          <button onClick={() => handleDeleteTenant(t.id, data?.restaurant.name || t.slug)} title="Eliminar"
                            className="p-2 hover:bg-background-muted rounded-md text-error">
                            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredTenants.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">Sin resultados.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === "users" && (
          <div className="border border-border rounded-lg bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-background-muted text-xs text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Usuario</th>
                  <th className="text-left px-4 py-3 font-medium">Rol</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Restaurante</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Alta</th>
                  <th className="text-right px-4 py-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => {
                  const tenant = u.tenantId ? tenants.find(t => t.id === u.tenantId) : null;
                  const data = tenant ? allData[tenant.id] : null;
                  return (
                    <tr key={u.id} className="border-t border-border-subtle hover:bg-background-muted">
                      <td className="px-4 py-3">
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-md border border-border bg-background-muted text-foreground-muted">
                          {roleLabel[u.role]}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{data?.restaurant.name || "—"}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs text-muted-foreground">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {u.role !== "superadmin" && (
                          <button onClick={() => handleImpersonate(u.id)} className="text-xs underline text-muted-foreground hover:text-foreground">
                            Impersonar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default SuperAdmin;
