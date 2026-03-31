import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { restaurant, categories, dishes, wines, dailyMenu, tables, reservations, metricsData, ALLERGENS, type Dish, type Reservation } from "@/data/mockData";
import { QRCodeSVG } from "qrcode.react";
import {
  UtensilsCrossed, Store, Book, CalendarCheck, LayoutGrid, BarChart3,
  QrCode, Settings, Bell, ChevronDown, Plus, Search, Filter, Eye,
  Edit, Trash2, Copy, GripVertical, Check, X, Clock, Users, Phone,
  Mail, MapPin, Instagram, Globe, Wifi, ParkingCircle, Accessibility,
  Dog, CreditCard, Baby, Truck, ChefHat, Star, ArrowLeft, ArrowRight,
  Download, Share2, ExternalLink, TrendingUp, AlertCircle, XCircle, CheckCircle2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";

type Section = "restaurant" | "menu" | "reservations" | "tables" | "metrics" | "qr" | "settings";

const sidebarItems: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "restaurant", label: "Mi restaurante", icon: Store },
  { id: "menu", label: "Carta", icon: Book },
  { id: "reservations", label: "Reservas", icon: CalendarCheck },
  { id: "tables", label: "Mesas", icon: LayoutGrid },
  { id: "metrics", label: "Métricas", icon: BarChart3 },
  { id: "qr", label: "QR y compartir", icon: QrCode },
  { id: "settings", label: "Configuración", icon: Settings },
];

// ── Restaurant Section ──
const RestaurantSection = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-2xl font-bold mb-1">Mi restaurante</h2>
      <p className="text-muted-foreground text-sm">Configura los datos de tu restaurante</p>
    </div>
    <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
      <h3 className="text-lg font-bold font-sans">Datos del restaurante</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Nombre", value: restaurant.name },
          { label: "Eslogan", value: restaurant.subtitle },
          { label: "Categoría", value: restaurant.category },
          { label: "Cocina", value: restaurant.cuisine.join(", ") },
          { label: "Teléfono", value: restaurant.phone },
          { label: "Email", value: restaurant.email },
          { label: "Web", value: restaurant.web },
          { label: "Instagram", value: restaurant.instagram },
          { label: "Dirección", value: restaurant.address },
        ].map((f, i) => (
          <div key={i}>
            <label className="text-xs font-medium text-muted-foreground">{f.label}</label>
            <div className="mt-1 px-3 py-2 bg-secondary rounded-lg text-sm">{f.value}</div>
          </div>
        ))}
      </div>
      <div>
        <label className="text-xs font-medium text-muted-foreground">Descripción</label>
        <div className="mt-1 px-3 py-2 bg-secondary rounded-lg text-sm">{restaurant.description}</div>
      </div>
    </div>

    <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
      <h3 className="text-lg font-bold font-sans">Horario</h3>
      <div className="space-y-2">
        {restaurant.hours.map((h, i) => (
          <div key={i} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
            <span className="w-24 font-medium text-sm">{h.day}</span>
            {h.closed ? (
              <span className="text-sm text-muted-foreground">Cerrado</span>
            ) : (
              <span className="text-sm">
                {h.morning && `${h.morning.open} - ${h.morning.close}`}
                {h.evening && !h.continuous && ` / ${h.evening.open} - ${h.evening.close}`}
                {h.continuous && " (continuo)"}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>

    <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
      <h3 className="text-lg font-bold font-sans">Servicios</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Object.entries(restaurant.services).map(([key, val]) => {
          const labels: Record<string, string> = {
            terraza: "Terraza", parking: "Parking", accessible: "Accesible", pets: "Mascotas",
            reservations: "Reservas", groups: "Grupos (+8)", wifi: "WiFi", card: "Tarjeta",
            menuDelDia: "Menú del día", menuInfantil: "Menú infantil", takeaway: "Take away", delivery: "Delivery",
          };
          return (
            <div key={key} className="flex items-center gap-2 text-sm">
              {val ? <CheckCircle2 className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-muted-foreground/40" />}
              <span className={val ? "" : "text-muted-foreground"}>{labels[key] || key}</span>
            </div>
          );
        })}
      </div>
    </div>

    <div className="flex gap-3">
      <Button variant="gradient">Guardar cambios</Button>
      <Button variant="outline-primary" asChild>
        <Link to="/r/casa-martin" target="_blank">Vista previa <ExternalLink className="ml-1 h-4 w-4" /></Link>
      </Button>
    </div>
  </div>
);

// ── Menu Section ──
const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState("c1");
  const [showDishModal, setShowDishModal] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  const categoryDishes = dishes.filter(d => d.categoryId === activeCategory);
  const activeCat = categories.find(c => c.id === activeCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Carta</h2>
          <p className="text-muted-foreground text-sm">Gestiona las categorías y platos de tu carta</p>
        </div>
      </div>

      {/* Daily Menu */}
      <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-sans flex items-center gap-2">📌 Menú del día</h3>
          <span className="text-2xl font-bold text-primary">€{dailyMenu.price.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="text-xs text-muted-foreground">Primer plato</label><div className="mt-1 text-sm font-medium">{dailyMenu.starter}</div></div>
          <div><label className="text-xs text-muted-foreground">Segundo plato</label><div className="mt-1 text-sm font-medium">{dailyMenu.main}</div></div>
          <div><label className="text-xs text-muted-foreground">Postre</label><div className="mt-1 text-sm font-medium">{dailyMenu.dessert}</div></div>
        </div>
        <p className="text-xs text-muted-foreground">{dailyMenu.includes} · {dailyMenu.schedule}</p>
        <Button size="sm" variant="outline-primary">Actualizar menú del día</Button>
      </div>

      <div className="flex gap-6">
        {/* Categories sidebar */}
        <div className="w-56 shrink-0 space-y-2">
          {categories.filter(c => c.id !== "c0").map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${activeCategory === cat.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-secondary text-muted-foreground'}`}
            >
              <span>{cat.icon}</span>
              <span className="flex-1">{cat.name}</span>
              <span className="text-xs text-muted-foreground">{dishes.filter(d => d.categoryId === cat.id).length}</span>
            </button>
          ))}
          <Button variant="ghost" size="sm" className="w-full justify-start text-primary">
            <Plus className="h-4 w-4 mr-1" /> Añadir categoría
          </Button>
        </div>

        {/* Dishes list */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold font-sans">{activeCat?.icon} {activeCat?.name}</h3>
            <Button size="sm" variant="gradient" onClick={() => { setEditingDish(null); setShowDishModal(true); }}>
              <Plus className="h-4 w-4 mr-1" /> Añadir plato
            </Button>
          </div>
          {categoryDishes.map(dish => (
            <div key={dish.id} className={`flex items-center gap-4 bg-card rounded-xl border border-border p-4 ${!dish.available ? 'opacity-60' : ''}`}>
              <GripVertical className="h-4 w-4 text-muted-foreground/40 cursor-grab" />
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/10 to-gold/10 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{dish.name}</span>
                  {dish.isNew && <span className="bg-gold text-gold-foreground text-[10px] px-2 py-0.5 rounded-full font-bold">Nuevo</span>}
                  {!dish.available && <span className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full font-bold">Agotado</span>}
                </div>
                <p className="text-xs text-muted-foreground truncate">{dish.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  {dish.allergens.slice(0, 4).map(a => {
                    const allergen = ALLERGENS.find(al => al.id === a);
                    return allergen ? <span key={a} className="text-xs" title={allergen.name}>{allergen.emoji}</span> : null;
                  })}
                  {dish.dietary.includes("vegetarian") && <span className="text-xs">🌿</span>}
                  {dish.dietary.includes("vegan") && <span className="text-xs">🌱</span>}
                  {dish.dietary.includes("spicy") && <span className="text-xs">🔥</span>}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold text-primary">€{dish.price.toFixed(2)}</div>
                {dish.chefNote && <div className="text-[10px] text-muted-foreground italic">{dish.chefNote}</div>}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button className="p-1.5 hover:bg-secondary rounded-lg" onClick={() => { setEditingDish(dish); setShowDishModal(true); }}>
                  <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                <button className="p-1.5 hover:bg-secondary rounded-lg"><Copy className="h-3.5 w-3.5 text-muted-foreground" /></button>
                <button className="p-1.5 hover:bg-secondary rounded-lg"><Trash2 className="h-3.5 w-3.5 text-destructive/60" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wine section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold font-sans flex items-center gap-2">🍷 Carta de vinos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {wines.map(wine => (
            <div key={wine.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
              <div className="w-10 h-14 rounded bg-gradient-to-b from-primary/20 to-primary/5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{wine.name} {wine.year && <span className="text-muted-foreground">{wine.year}</span>}</div>
                <div className="text-xs text-muted-foreground">{wine.region} · {wine.grape}</div>
              </div>
              <div className="text-right shrink-0 text-sm">
                {wine.priceGlass && <div className="text-muted-foreground">Copa €{wine.priceGlass.toFixed(2)}</div>}
                <div className="font-bold text-primary">€{wine.priceBottle.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simple dish modal */}
      {showDishModal && (
        <div className="fixed inset-0 z-50 bg-foreground/40 flex items-center justify-center p-4" onClick={() => setShowDishModal(false)}>
          <div className="bg-card rounded-2xl border border-border p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold font-sans">{editingDish ? "Editar plato" : "Nuevo plato"}</h3>
            <div className="space-y-3">
              <div><label className="text-xs font-medium text-muted-foreground">Nombre</label><input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" defaultValue={editingDish?.name || ""} /></div>
              <div><label className="text-xs font-medium text-muted-foreground">Descripción</label><textarea className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" rows={2} defaultValue={editingDish?.description || ""} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-muted-foreground">Precio (€)</label><input type="number" className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" defaultValue={editingDish?.price || ""} /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Precio anterior (€)</label><input type="number" className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" defaultValue={editingDish?.oldPrice || ""} /></div>
              </div>
              <div><label className="text-xs font-medium text-muted-foreground">Nota del chef</label><input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" defaultValue={editingDish?.chefNote || ""} /></div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="gradient" className="flex-1">Guardar</Button>
              <Button variant="outline-primary" onClick={() => setShowDishModal(false)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Reservations Section ──
const statusColors: Record<string, string> = {
  pending: "bg-star/10 text-star",
  confirmed: "bg-success/10 text-success",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/10 text-destructive",
  noshow: "bg-destructive/20 text-destructive",
};
const statusLabels: Record<string, string> = {
  pending: "Pendiente", confirmed: "Confirmada", completed: "Completada",
  cancelled: "Cancelada", noshow: "No-show",
};

const ReservationsSection = () => {
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Reservas</h2>
          <p className="text-muted-foreground text-sm">Gestiona las reservas de tu restaurante</p>
        </div>
        <Button variant="gradient" size="sm"><Plus className="h-4 w-4 mr-1" /> Nueva reserva</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Reservas hoy", value: metricsData.reservationsToday, icon: CalendarCheck },
          { label: "Cubiertos hoy", value: `${metricsData.coversToday}/${metricsData.totalCovers}`, icon: Users },
          { label: "Pendientes", value: metricsData.pendingToday, icon: Clock },
          { label: "Cancelaciones hoy", value: metricsData.cancelledToday, icon: XCircle },
        ].map((kpi, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{kpi.label}</span>
            </div>
            <div className="text-2xl font-bold">{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Reservations table */}
        <div className="flex-1 bg-card rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Fecha</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Hora</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nombre</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Pers.</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Estado</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Fuente</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(res => (
                  <tr key={res.id} className="border-b border-border last:border-0 hover:bg-secondary/30 cursor-pointer transition-colors" onClick={() => setSelectedRes(res)}>
                    <td className="px-4 py-3">{new Date(res.date).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}</td>
                    <td className="px-4 py-3">{res.time}</td>
                    <td className="px-4 py-3 font-medium">{res.name}</td>
                    <td className="px-4 py-3">{res.guests}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[res.status]}`}>
                        {statusLabels[res.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{res.source === "digital" ? "Carta digital" : res.source === "manual" ? "Manual" : "Teléfono"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        {selectedRes && (
          <div className="w-80 bg-card rounded-2xl border border-border p-6 space-y-4 shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="font-bold font-sans">Detalle de reserva</h3>
              <button onClick={() => setSelectedRes(null)}><X className="h-4 w-4 text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <div><span className="text-xs text-muted-foreground">Nombre</span><div className="font-medium">{selectedRes.name}</div></div>
              <div><span className="text-xs text-muted-foreground">Teléfono</span><div className="font-medium">{selectedRes.phone}</div></div>
              {selectedRes.email && <div><span className="text-xs text-muted-foreground">Email</span><div className="text-sm">{selectedRes.email}</div></div>}
              <div className="flex gap-4">
                <div><span className="text-xs text-muted-foreground">Personas</span><div className="font-medium">{selectedRes.guests}</div></div>
                <div><span className="text-xs text-muted-foreground">Hora</span><div className="font-medium">{selectedRes.time}</div></div>
              </div>
              <div><span className="text-xs text-muted-foreground">Fecha</span><div className="font-medium">{new Date(selectedRes.date).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}</div></div>
              {selectedRes.notes && <div><span className="text-xs text-muted-foreground">Notas</span><div className="text-sm bg-secondary rounded-lg p-2 mt-1">{selectedRes.notes}</div></div>}
              <div>
                <span className="text-xs text-muted-foreground">Estado</span>
                <div className="mt-1">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[selectedRes.status]}`}>
                    {statusLabels[selectedRes.status]}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="gradient" className="flex-1">Confirmar</Button>
              <Button size="sm" variant="outline-primary">Cancelar</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Tables Section ──
const zoneColors: Record<string, string> = { Interior: "bg-primary/10", Terraza: "bg-success/10", Barra: "bg-gold/10", Privado: "bg-muted" };
const statusBg: Record<string, string> = { free: "border-success bg-success/5", reserved: "border-primary bg-primary/5", occupied: "border-destructive bg-destructive/5", "out-of-service": "border-muted bg-muted/50" };
const statusLabel: Record<string, string> = { free: "Libre", reserved: "Reservada", occupied: "Ocupada", "out-of-service": "Fuera de servicio" };

const TablesSection = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-1">Mesas</h2>
        <p className="text-muted-foreground text-sm">Plano visual de tu restaurante · Capacidad total: 42 cubiertos</p>
      </div>
      <Button variant="gradient" size="sm"><Plus className="h-4 w-4 mr-1" /> Añadir mesa</Button>
    </div>
    <div className="flex gap-3 mb-4">
      {["Interior", "Terraza", "Barra", "Privado"].map(zone => (
        <span key={zone} className={`px-3 py-1 rounded-full text-xs font-medium ${zoneColors[zone]}`}>{zone}</span>
      ))}
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {tables.map(table => (
        <div key={table.id} className={`rounded-2xl border-2 p-4 space-y-2 transition-colors ${statusBg[table.status]}`}>
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm">{table.number}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${zoneColors[table.zone]}`}>{table.zone}</span>
          </div>
          <div className="text-xs text-muted-foreground">{table.capacity} pers.</div>
          <div className="text-xs font-medium">{statusLabel[table.status]}</div>
          {table.reservedBy && <div className="text-xs text-primary">{table.reservedBy} · {table.reservedTime}</div>}
          {table.combinable && <div className="text-[10px] text-muted-foreground">Combinable</div>}
        </div>
      ))}
    </div>
  </div>
);

// ── Metrics Section ──
const MetricsSection = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold mb-1">Métricas</h2>
      <p className="text-muted-foreground text-sm">Datos de los últimos 30 días</p>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: "Reservas totales", value: metricsData.totalReservations },
        { label: "Cubiertos totales", value: metricsData.totalCoversMonth },
        { label: "Ocupación media", value: `${metricsData.avgOccupancy}%` },
        { label: "Tasa no-show", value: `${metricsData.noshowRate}%` },
      ].map((kpi, i) => (
        <div key={i} className="bg-card rounded-xl border border-border p-4">
          <div className="text-xs text-muted-foreground mb-1">{kpi.label}</div>
          <div className="text-2xl font-bold">{kpi.value}</div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-sm font-bold font-sans mb-4">Reservas por día</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={metricsData.reservationsByDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="lunch" name="Mediodía" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
            <Bar dataKey="dinner" name="Noche" fill="hsl(var(--gold))" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-sm font-bold font-sans mb-4">Ocupación semanal</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={metricsData.weeklyOccupancy}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="occupancy" name="Ocupación %" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-sm font-bold font-sans mb-4">Platos más vistos</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={metricsData.topDishes} layout="vertical">
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
            <Tooltip />
            <Bar dataKey="views" fill="hsl(var(--primary))" radius={[0,4,4,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card rounded-2xl border border-border p-6">
        <h3 className="text-sm font-bold font-sans mb-4">Reservas por fuente</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={metricsData.reservationsBySource} dataKey="value" nameKey="source" cx="50%" cy="50%" outerRadius={80} label={({ source, value }) => `${source} ${value}%`}>
              {metricsData.reservationsBySource.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="bg-primary/5 rounded-2xl border border-primary/20 p-6">
      <div className="flex items-start gap-3">
        <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
        <div>
          <h4 className="font-bold text-sm font-sans">Insight</h4>
          <p className="text-sm text-muted-foreground mt-1">Los viernes y sábados noche tienes un 94% de ocupación. Los martes mediodía solo un 45%. Considera una promoción de menú del día los martes.</p>
        </div>
      </div>
    </div>
  </div>
);

// ── QR Section ──
const QRSection = () => {
  const url = `${window.location.origin}/r/${restaurant.slug}`;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">QR y compartir</h2>
        <p className="text-muted-foreground text-sm">Tu QR listo para imprimir y compartir</p>
      </div>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="bg-card rounded-2xl border border-border p-8 flex flex-col items-center gap-6">
          <QRCodeSVG value={url} size={200} bgColor="transparent" fgColor="hsl(15, 25%, 9%)" level="M" />
          <p className="text-sm text-muted-foreground text-center max-w-xs">Escanea para ver la carta y reservar mesa</p>
          <div className="flex gap-3">
            <Button variant="gradient" size="sm"><Download className="h-4 w-4 mr-1" /> Descargar PNG</Button>
            <Button variant="outline-primary" size="sm"><Download className="h-4 w-4 mr-1" /> PDF para imprimir</Button>
          </div>
        </div>
        <div className="flex-1 space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
            <h3 className="text-sm font-bold font-sans">Link directo</h3>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-secondary px-3 py-2 rounded-lg text-sm truncate">{url}</code>
              <Button size="sm" variant="outline-primary" onClick={() => navigator.clipboard.writeText(url)}>Copiar</Button>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
            <h3 className="text-sm font-bold font-sans">Compartir</h3>
            <div className="flex gap-2">
              {["WhatsApp", "Instagram", "Facebook", "Email"].map(s => (
                <Button key={s} size="sm" variant="secondary">{s}</Button>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
            <h3 className="text-sm font-bold font-sans">Widget embebible</h3>
            <code className="block bg-secondary px-3 py-2 rounded-lg text-xs overflow-x-auto">{`<script src="${window.location.origin}/widget/${restaurant.slug}.js"></script>`}</code>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Settings Section ──
const SettingsSection = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold mb-1">Configuración</h2>
      <p className="text-muted-foreground text-sm">Ajustes generales y facturación</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <h3 className="text-lg font-bold font-sans">General</h3>
        {[
          { label: "Idioma del panel", value: "Español" },
          { label: "Zona horaria", value: "Europe/Madrid" },
          { label: "Moneda", value: "EUR (€)" },
        ].map((s, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <span className="text-sm">{s.label}</span>
            <span className="text-sm text-muted-foreground">{s.value}</span>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <h3 className="text-lg font-bold font-sans">Facturación</h3>
        <div className="flex items-center justify-between">
          <span className="text-sm">Plan actual</span>
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">PRO — €29/mes</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-border">
          <span className="text-sm">Próxima factura</span>
          <span className="text-sm text-muted-foreground">15 abril 2026</span>
        </div>
        <Button variant="outline-primary" size="sm">Gestionar suscripción</Button>
      </div>
      <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <h3 className="text-lg font-bold font-sans">Notificaciones</h3>
        {[
          { label: "Email al recibir reserva", on: true },
          { label: "Email en cancelación", on: true },
          { label: "Resumen diario", on: false },
          { label: "Alerta de no-show", on: true },
        ].map((n, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <span className="text-sm">{n.label}</span>
            <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${n.on ? 'bg-success' : 'bg-muted'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-card shadow transition-transform ${n.on ? 'left-5' : 'left-0.5'}`} />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <h3 className="text-lg font-bold font-sans">Multi-idioma</h3>
        {[
          { lang: "Español", flag: "🇪🇸", on: true },
          { lang: "English", flag: "🇬🇧", on: true },
          { lang: "Français", flag: "🇫🇷", on: true },
          { lang: "Català", flag: "🏳️", on: true },
        ].map((l, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <span className="text-sm">{l.flag} {l.lang}</span>
            <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${l.on ? 'bg-success' : 'bg-muted'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-card shadow transition-transform ${l.on ? 'left-5' : 'left-0.5'}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Dashboard Layout ──
const sections: Record<Section, React.FC> = {
  restaurant: RestaurantSection,
  menu: MenuSection,
  reservations: ReservationsSection,
  tables: TablesSection,
  metrics: MetricsSection,
  qr: QRSection,
  settings: SettingsSection,
};

const Dashboard = () => {
  const [active, setActive] = useState<Section>("restaurant");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const ActiveSection = sections[active];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-0 overflow-hidden'} shrink-0 border-r border-border bg-card transition-all duration-200`}>
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            <span className="font-serif text-lg font-bold">CARTA</span>
          </Link>
        </div>
        <nav className="p-3 space-y-1">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${active === item.id ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-4 left-3 right-3 px-3">
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">PRO</span>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 hover:bg-secondary rounded-lg">
              <LayoutGrid className="h-4 w-4 text-muted-foreground" />
            </button>
            <span className="text-sm text-muted-foreground">{restaurant.name}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-secondary rounded-lg">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-primary" />
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <ActiveSection />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;