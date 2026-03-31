import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { metricsData, ALLERGENS, type Dish, type Reservation, type Table as TableType } from "@/data/mockData";
import { dishImages } from "@/data/dishImages";
import { getWineImage } from "@/data/wineImages";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import {
  UtensilsCrossed, Store, Book, CalendarCheck, LayoutGrid, BarChart3,
  QrCode, Settings, Bell, ChevronDown, Plus, Edit, Trash2, Copy,
  GripVertical, X, Clock, Users, XCircle, CheckCircle2,
  Download, ExternalLink, TrendingUp, LogOut, Eye, EyeOff, Menu,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";

type Section = "restaurant" | "menu" | "reservations" | "tables" | "metrics" | "qr" | "settings";

const sidebarItems: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "restaurant", label: "Mi restaurante", icon: Store },
  { id: "menu", label: "Carta", icon: Book },
  { id: "reservations", label: "Reservas", icon: CalendarCheck },
  { id: "tables", label: "Mesas", icon: LayoutGrid },
  { id: "metrics", label: "Métricas", icon: BarChart3 },
  { id: "qr", label: "QR", icon: QrCode },
  { id: "settings", label: "Ajustes", icon: Settings },
];

// ── Login Screen ──
const LoginScreen = () => {
  const { login } = useApp();
  const [email, setEmail] = useState("demo@carta.app");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      toast.success("¡Bienvenido al panel de Carta!");
    } else {
      setError(true);
      toast.error("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <UtensilsCrossed className="h-8 w-8 text-primary" />
            <span className="font-serif text-2xl font-bold">CARTA</span>
          </div>
          <p className="text-muted-foreground text-sm">Accede al panel de tu restaurante</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" type="email" value={email} onChange={e => { setEmail(e.target.value); setError(false); }} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Contraseña</label>
            <input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" type="password" value={password} onChange={e => { setPassword(e.target.value); setError(false); }} />
          </div>
          {error && <p className="text-xs text-destructive">Email o contraseña incorrectos</p>}
          <Button variant="gradient" className="w-full" type="submit">Iniciar sesión</Button>
          <p className="text-xs text-muted-foreground text-center">Demo: demo@carta.app / demo1234</p>
        </form>
      </div>
    </div>
  );
};

// ── Restaurant Section ──
const RestaurantSection = () => {
  const { restaurant, updateRestaurant } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...restaurant });

  const handleSave = () => {
    updateRestaurant(form);
    setEditing(false);
    toast.success("Restaurante actualizado");
  };

  const handleServiceToggle = (key: string) => {
    const newServices = { ...form.services, [key]: !form.services[key] };
    setForm(prev => ({ ...prev, services: newServices }));
    if (!editing) {
      updateRestaurant({ services: newServices });
      toast.success("Servicio actualizado");
    }
  };

  const serviceLabels: Record<string, string> = {
    terraza: "Terraza", parking: "Parking", accessible: "Accesible", pets: "Mascotas",
    reservations: "Reservas", groups: "Grupos (+8)", wifi: "WiFi", card: "Tarjeta",
    menuDelDia: "Menú del día", menuInfantil: "Menú infantil", takeaway: "Take away", delivery: "Delivery",
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-1">Mi restaurante</h2>
          <p className="text-muted-foreground text-sm">Configura los datos de tu restaurante</p>
        </div>
        {!editing && <Button variant="outline-primary" size="sm" onClick={() => { setForm({ ...restaurant }); setEditing(true); }}><Edit className="h-4 w-4 mr-1" /> Editar</Button>}
      </div>
      <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-6">
        <h3 className="text-lg font-bold font-sans">Datos del restaurante</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Nombre", key: "name" },
            { label: "Eslogan", key: "subtitle" },
            { label: "Categoría", key: "category" },
            { label: "Teléfono", key: "phone" },
            { label: "Email", key: "email" },
            { label: "Web", key: "web" },
            { label: "Instagram", key: "instagram" },
            { label: "Dirección", key: "address" },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-xs font-medium text-muted-foreground">{f.label}</label>
              {editing ? (
                <input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={(form as any)[f.key] || ""} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
              ) : (
                <div className="mt-1 px-3 py-2 bg-secondary rounded-lg text-sm">{(restaurant as any)[f.key]}</div>
              )}
            </div>
          ))}
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Descripción</label>
          {editing ? (
            <textarea className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" rows={3} value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} />
          ) : (
            <div className="mt-1 px-3 py-2 bg-secondary rounded-lg text-sm">{restaurant.description}</div>
          )}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-4">
        <h3 className="text-lg font-bold font-sans">Horario</h3>
        <div className="space-y-2">
          {(editing ? form : restaurant).hours.map((h, i) => (
            <div key={i} className="flex flex-col gap-1 py-2 border-b border-border last:border-0 sm:flex-row sm:items-center sm:gap-4">
              <span className="w-24 font-medium text-sm shrink-0">{h.day}</span>
              {editing ? (
                <div className="flex items-center gap-2 flex-1 flex-wrap">
                  <button onClick={() => {
                    const hours = [...form.hours];
                    hours[i] = { ...hours[i], closed: !hours[i].closed };
                    setForm(prev => ({ ...prev, hours }));
                  }} className={`text-xs px-2 py-1 rounded-full ${h.closed ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'}`}>
                    {h.closed ? "Cerrado" : "Abierto"}
                  </button>
                  {!h.closed && h.morning && (
                    <div className="flex items-center gap-1 text-sm">
                      <input type="time" value={h.morning.open} className="px-1 py-0.5 bg-secondary border border-border rounded text-xs w-20" onChange={e => {
                        const hours = [...form.hours];
                        hours[i] = { ...hours[i], morning: { ...hours[i].morning!, open: e.target.value } };
                        setForm(prev => ({ ...prev, hours }));
                      }} />
                      <span>-</span>
                      <input type="time" value={h.morning.close} className="px-1 py-0.5 bg-secondary border border-border rounded text-xs w-20" onChange={e => {
                        const hours = [...form.hours];
                        hours[i] = { ...hours[i], morning: { ...hours[i].morning!, close: e.target.value } };
                        setForm(prev => ({ ...prev, hours }));
                      }} />
                    </div>
                  )}
                </div>
              ) : (
                h.closed ? (
                  <span className="text-sm text-muted-foreground">Cerrado</span>
                ) : (
                  <span className="text-sm">
                    {h.morning && `${h.morning.open} - ${h.morning.close}`}
                    {h.evening && !h.continuous && ` / ${h.evening.open} - ${h.evening.close}`}
                    {h.continuous && " (continuo)"}
                  </span>
                )
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-4">
        <h3 className="text-lg font-bold font-sans">Servicios</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries((editing ? form : restaurant).services).map(([key, val]) => (
            <button key={key} onClick={() => handleServiceToggle(key)} className="flex items-center gap-2 text-sm text-left">
              {val ? <CheckCircle2 className="h-4 w-4 text-success shrink-0" /> : <XCircle className="h-4 w-4 text-muted-foreground/40 shrink-0" />}
              <span className={val ? "" : "text-muted-foreground"}>{serviceLabels[key] || key}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        {editing ? (
          <>
            <Button variant="gradient" onClick={handleSave}>Guardar cambios</Button>
            <Button variant="outline-primary" onClick={() => setEditing(false)}>Cancelar</Button>
          </>
        ) : (
          <Button variant="outline-primary" asChild>
            <Link to="/r/casa-martin" target="_blank">Vista previa <ExternalLink className="ml-1 h-4 w-4" /></Link>
          </Button>
        )}
      </div>
    </div>
  );
};

// ── Menu Section ──
const MenuSection = () => {
  const { categories, dishes, wines, dailyMenu, addDish, updateDish, deleteDish, duplicateDish, toggleDishAvailability, addCategory, updateDailyMenu } = useApp();
  const [activeCategory, setActiveCategory] = useState("c1");
  const [showDishModal, setShowDishModal] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("🍽️");
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [dailyForm, setDailyForm] = useState({ ...dailyMenu });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showCatDrawer, setShowCatDrawer] = useState(false);

  const [dishForm, setDishForm] = useState<Partial<Dish>>({});

  const categoryDishes = dishes.filter(d => d.categoryId === activeCategory);
  const activeCat = categories.find(c => c.id === activeCategory);

  const openNewDish = () => {
    setEditingDish(null);
    setDishForm({ categoryId: activeCategory, name: "", description: "", price: 0, allergens: [], dietary: [], available: true, isNew: false, position: categoryDishes.length + 1 });
    setShowDishModal(true);
  };

  const openEditDish = (dish: Dish) => {
    setEditingDish(dish);
    setDishForm({ ...dish });
    setShowDishModal(true);
  };

  const saveDish = () => {
    if (!dishForm.name || !dishForm.price) {
      toast.error("Nombre y precio son obligatorios");
      return;
    }
    if (editingDish) {
      updateDish(editingDish.id, dishForm);
      toast.success("Plato actualizado");
    } else {
      addDish(dishForm as Omit<Dish, "id">);
      toast.success("Plato añadido");
    }
    setShowDishModal(false);
  };

  const handleDelete = (id: string) => {
    deleteDish(id);
    setDeleteConfirm(null);
    toast.success("Plato eliminado");
  };

  const handleDuplicate = (id: string) => {
    duplicateDish(id);
    toast.success("Plato duplicado");
  };

  const saveDailyMenu = () => {
    updateDailyMenu(dailyForm);
    setShowDailyModal(false);
    toast.success("Menú del día actualizado");
  };

  const saveCategory = () => {
    if (!newCatName) return;
    addCategory(newCatName, newCatIcon);
    setShowCategoryModal(false);
    setNewCatName("");
    toast.success("Categoría añadida");
  };

  const selectCategory = (id: string) => {
    setActiveCategory(id);
    setShowCatDrawer(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-1">Carta</h2>
          <p className="text-muted-foreground text-sm">Gestiona las categorías y platos de tu carta</p>
        </div>
      </div>

      {/* Daily Menu */}
      <div className="bg-primary/5 rounded-2xl border border-primary/20 p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base sm:text-lg font-bold font-sans flex items-center gap-2">📌 Menú del día</h3>
          <span className="text-xl sm:text-2xl font-bold text-primary">€{dailyMenu.price.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div><label className="text-xs text-muted-foreground">Primer plato</label><div className="mt-1 text-sm font-medium">{dailyMenu.starter}</div></div>
          <div><label className="text-xs text-muted-foreground">Segundo plato</label><div className="mt-1 text-sm font-medium">{dailyMenu.main}</div></div>
          <div><label className="text-xs text-muted-foreground">Postre</label><div className="mt-1 text-sm font-medium">{dailyMenu.dessert}</div></div>
        </div>
        <p className="text-xs text-muted-foreground">{dailyMenu.includes} · {dailyMenu.schedule}</p>
        <Button size="sm" variant="outline-primary" onClick={() => { setDailyForm({ ...dailyMenu }); setShowDailyModal(true); }}>Actualizar menú del día</Button>
      </div>

      {/* Mobile: category selector as horizontal scroll */}
      <div className="lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {categories.filter(c => c.id !== "c0").map(cat => (
            <button key={cat.id} onClick={() => selectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${activeCategory === cat.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              <span className="opacity-60">({dishes.filter(d => d.categoryId === cat.id).length})</span>
            </button>
          ))}
          <button onClick={() => setShowCategoryModal(true)} className="flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium text-primary bg-primary/10 whitespace-nowrap shrink-0">
            <Plus className="h-3 w-3" /> Nueva
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop: Categories sidebar */}
        <div className="hidden lg:block w-56 shrink-0 space-y-2">
          {categories.filter(c => c.id !== "c0").map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${activeCategory === cat.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-secondary text-muted-foreground'}`}>
              <span>{cat.icon}</span>
              <span className="flex-1">{cat.name}</span>
              <span className="text-xs text-muted-foreground">{dishes.filter(d => d.categoryId === cat.id).length}</span>
            </button>
          ))}
          <Button variant="ghost" size="sm" className="w-full justify-start text-primary" onClick={() => setShowCategoryModal(true)}>
            <Plus className="h-4 w-4 mr-1" /> Añadir categoría
          </Button>
        </div>

        {/* Dishes list */}
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold font-sans text-sm sm:text-base">{activeCat?.icon} {activeCat?.name}</h3>
            <Button size="sm" variant="gradient" onClick={openNewDish}>
              <Plus className="h-4 w-4 mr-1" /> <span className="hidden sm:inline">Añadir plato</span><span className="sm:hidden">Añadir</span>
            </Button>
          </div>
          {categoryDishes.map(dish => (
            <div key={dish.id} className={`bg-card rounded-xl border border-border p-3 sm:p-4 ${!dish.available ? 'opacity-60' : ''}`}>
              <div className="flex items-start gap-3">
                <GripVertical className="h-4 w-4 text-muted-foreground/40 cursor-grab mt-1 hidden sm:block" />
                {dishImages[dish.id] ? (
                  <img src={dishImages[dish.id]} alt={dish.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover shrink-0" loading="lazy" />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br from-primary/10 to-gold/10 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{dish.name}</span>
                    {dish.isNew && <span className="bg-gold text-gold-foreground text-[10px] px-2 py-0.5 rounded-full font-bold">Nuevo</span>}
                    {!dish.available && <span className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full font-bold">Agotado</span>}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{dish.description}</p>
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
                  <div className="font-bold text-primary text-sm">€{dish.price.toFixed(2)}</div>
                </div>
              </div>
              {/* Actions row */}
              <div className="flex items-center justify-end gap-1 mt-2 pt-2 border-t border-border">
                <button className="p-1.5 hover:bg-secondary rounded-lg" onClick={() => toggleDishAvailability(dish.id)} title={dish.available ? "Marcar agotado" : "Marcar disponible"}>
                  {dish.available ? <Eye className="h-3.5 w-3.5 text-success" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
                </button>
                <button className="p-1.5 hover:bg-secondary rounded-lg" onClick={() => openEditDish(dish)}><Edit className="h-3.5 w-3.5 text-muted-foreground" /></button>
                <button className="p-1.5 hover:bg-secondary rounded-lg" onClick={() => handleDuplicate(dish.id)}><Copy className="h-3.5 w-3.5 text-muted-foreground" /></button>
                <button className="p-1.5 hover:bg-secondary rounded-lg" onClick={() => setDeleteConfirm(dish.id)}><Trash2 className="h-3.5 w-3.5 text-destructive/60" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wine section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold font-sans flex items-center gap-2">🍷 Carta de vinos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {wines.map(wine => (
            <div key={wine.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
              <img src={getWineImage(wine.id, wine.type)} alt={wine.name} className="w-10 h-14 rounded object-cover shrink-0" loading="lazy" />
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

      {/* Dish modal */}
      {showDishModal && (
        <div className="fixed inset-0 z-50 bg-foreground/40 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowDishModal(false)}>
          <div className="bg-card rounded-t-2xl sm:rounded-2xl border border-border p-5 sm:p-6 w-full sm:max-w-lg max-h-[90vh] overflow-y-auto space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold font-sans">{editingDish ? "Editar plato" : "Nuevo plato"}</h3>
            <div className="space-y-3">
              <div><label className="text-xs font-medium text-muted-foreground">Nombre *</label><input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={dishForm.name || ""} onChange={e => setDishForm(prev => ({ ...prev, name: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-muted-foreground">Descripción</label><textarea className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" rows={2} value={dishForm.description || ""} onChange={e => setDishForm(prev => ({ ...prev, description: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-muted-foreground">Precio (€) *</label><input type="number" step="0.01" className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={dishForm.price || ""} onChange={e => setDishForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))} /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Precio anterior (€)</label><input type="number" step="0.01" className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={dishForm.oldPrice || ""} onChange={e => setDishForm(prev => ({ ...prev, oldPrice: parseFloat(e.target.value) || undefined }))} /></div>
              </div>
              <div><label className="text-xs font-medium text-muted-foreground">Nota del chef</label><input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={dishForm.chefNote || ""} onChange={e => setDishForm(prev => ({ ...prev, chefNote: e.target.value }))} /></div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Alérgenos</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {ALLERGENS.map(a => (
                    <button key={a.id} onClick={() => setDishForm(prev => ({ ...prev, allergens: prev.allergens?.includes(a.id) ? prev.allergens.filter(x => x !== a.id) : [...(prev.allergens || []), a.id] }))}
                      className={`text-xs px-2 py-1 rounded-full transition-colors ${dishForm.allergens?.includes(a.id) ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                      {a.emoji} {a.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={dishForm.available ?? true} onChange={e => setDishForm(prev => ({ ...prev, available: e.target.checked }))} />
                  Disponible
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={dishForm.isNew ?? false} onChange={e => setDishForm(prev => ({ ...prev, isNew: e.target.checked }))} />
                  Nuevo
                </label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="gradient" className="flex-1" onClick={saveDish}>Guardar</Button>
              <Button variant="outline-primary" onClick={() => setShowDishModal(false)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-foreground/40 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-card rounded-2xl border border-border p-6 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold">¿Eliminar plato?</h3>
            <p className="text-sm text-muted-foreground">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <Button variant="destructive" className="flex-1" onClick={() => handleDelete(deleteConfirm)}>Eliminar</Button>
              <Button variant="outline-primary" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Category modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-foreground/40 flex items-center justify-center p-4" onClick={() => setShowCategoryModal(false)}>
          <div className="bg-card rounded-2xl border border-border p-6 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold">Nueva categoría</h3>
            <div><label className="text-xs font-medium text-muted-foreground">Nombre</label><input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={newCatName} onChange={e => setNewCatName(e.target.value)} /></div>
            <div><label className="text-xs font-medium text-muted-foreground">Icono (emoji)</label><input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)} /></div>
            <div className="flex gap-3">
              <Button variant="gradient" className="flex-1" onClick={saveCategory}>Añadir</Button>
              <Button variant="outline-primary" onClick={() => setShowCategoryModal(false)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Daily menu modal */}
      {showDailyModal && (
        <div className="fixed inset-0 z-50 bg-foreground/40 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowDailyModal(false)}>
          <div className="bg-card rounded-t-2xl sm:rounded-2xl border border-border p-5 sm:p-6 w-full sm:max-w-lg space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold">Actualizar menú del día</h3>
            <div><label className="text-xs font-medium text-muted-foreground">Primer plato</label><input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={dailyForm.starter} onChange={e => setDailyForm(prev => ({ ...prev, starter: e.target.value }))} /></div>
            <div><label className="text-xs font-medium text-muted-foreground">Segundo plato</label><input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={dailyForm.main} onChange={e => setDailyForm(prev => ({ ...prev, main: e.target.value }))} /></div>
            <div><label className="text-xs font-medium text-muted-foreground">Postre</label><input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={dailyForm.dessert} onChange={e => setDailyForm(prev => ({ ...prev, dessert: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-medium text-muted-foreground">Precio (€)</label><input type="number" step="0.01" className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={dailyForm.price} onChange={e => setDailyForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))} /></div>
              <div><label className="text-xs font-medium text-muted-foreground">Incluye</label><input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={dailyForm.includes} onChange={e => setDailyForm(prev => ({ ...prev, includes: e.target.value }))} /></div>
            </div>
            <div className="flex gap-3">
              <Button variant="gradient" className="flex-1" onClick={saveDailyMenu}>Guardar</Button>
              <Button variant="outline-primary" onClick={() => setShowDailyModal(false)}>Cancelar</Button>
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
  const { reservations, updateReservationStatus, addReservation, tables } = useApp();
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newRes, setNewRes] = useState({ name: "", phone: "", email: "", date: "", time: "", guests: 2, notes: "", zonePreference: "Sin preferencia" });
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = statusFilter === "all" ? reservations : reservations.filter(r => r.status === statusFilter);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayRes = reservations.filter(r => r.date === todayStr);
  const todayCovers = todayRes.reduce((sum, r) => sum + r.guests, 0);
  const pendingToday = todayRes.filter(r => r.status === "pending").length;
  const cancelledToday = todayRes.filter(r => r.status === "cancelled").length;

  const handleStatusChange = (id: string, status: Reservation["status"]) => {
    updateReservationStatus(id, status);
    setSelectedRes(prev => prev?.id === id ? { ...prev, status } : prev);
    toast.success(`Reserva ${statusLabels[status].toLowerCase()}`);
  };

  const saveNewRes = () => {
    if (!newRes.name || !newRes.phone || !newRes.date || !newRes.time) {
      toast.error("Completa los campos obligatorios");
      return;
    }
    addReservation({ ...newRes, status: "confirmed", source: "manual" });
    setShowNewModal(false);
    setNewRes({ name: "", phone: "", email: "", date: "", time: "", guests: 2, notes: "", zonePreference: "Sin preferencia" });
    toast.success("Reserva creada");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-1">Reservas</h2>
          <p className="text-muted-foreground text-sm">Gestiona las reservas de tu restaurante</p>
        </div>
        <Button variant="gradient" size="sm" onClick={() => setShowNewModal(true)}><Plus className="h-4 w-4 mr-1" /> Nueva reserva</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {[
          { label: "Reservas hoy", value: todayRes.length, icon: CalendarCheck },
          { label: "Cubiertos hoy", value: `${todayCovers}/42`, icon: Users },
          { label: "Pendientes", value: pendingToday, icon: Clock },
          { label: "Cancelaciones", value: cancelledToday, icon: XCircle },
        ].map((kpi, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-[10px] sm:text-xs text-muted-foreground">{kpi.label}</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {[{ id: "all", label: "Todas" }, { id: "pending", label: "Pendientes" }, { id: "confirmed", label: "Confirmadas" }, { id: "completed", label: "Completadas" }, { id: "cancelled", label: "Canceladas" }].map(f => (
          <button key={f.id} onClick={() => setStatusFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${statusFilter === f.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Mobile: Card list. Desktop: Table + detail panel */}
      <div className="hidden md:flex gap-6">
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
                {filtered.map(res => (
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
            <div className="flex flex-wrap gap-2 pt-2">
              {selectedRes.status === "pending" && (
                <>
                  <Button size="sm" variant="gradient" className="flex-1" onClick={() => handleStatusChange(selectedRes.id, "confirmed")}>Confirmar</Button>
                  <Button size="sm" variant="outline-primary" onClick={() => handleStatusChange(selectedRes.id, "cancelled")}>Cancelar</Button>
                </>
              )}
              {selectedRes.status === "confirmed" && (
                <>
                  <Button size="sm" variant="gradient" className="flex-1" onClick={() => handleStatusChange(selectedRes.id, "completed")}>Completar</Button>
                  <Button size="sm" variant="outline-primary" onClick={() => handleStatusChange(selectedRes.id, "noshow")}>No-show</Button>
                  <Button size="sm" variant="outline-primary" onClick={() => handleStatusChange(selectedRes.id, "cancelled")}>Cancelar</Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile: reservation cards */}
      <div className="md:hidden space-y-3">
        {filtered.map(res => (
          <div key={res.id} className="bg-card rounded-xl border border-border p-4 space-y-3" onClick={() => setSelectedRes(selectedRes?.id === res.id ? null : res)}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{res.name}</div>
                <div className="text-xs text-muted-foreground">{new Date(res.date).toLocaleDateString("es-ES", { day: "numeric", month: "short" })} · {res.time} · {res.guests} pers.</div>
              </div>
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[res.status]}`}>
                {statusLabels[res.status]}
              </span>
            </div>
            {selectedRes?.id === res.id && (
              <div className="pt-2 border-t border-border space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-xs text-muted-foreground">Teléfono</span><div>{res.phone}</div></div>
                  {res.email && <div><span className="text-xs text-muted-foreground">Email</span><div className="truncate">{res.email}</div></div>}
                </div>
                {res.notes && <div className="text-sm bg-secondary rounded-lg p-2">{res.notes}</div>}
                <div className="flex flex-wrap gap-2">
                  {res.status === "pending" && (
                    <>
                      <Button size="sm" variant="gradient" className="flex-1" onClick={(e) => { e.stopPropagation(); handleStatusChange(res.id, "confirmed"); }}>Confirmar</Button>
                      <Button size="sm" variant="outline-primary" onClick={(e) => { e.stopPropagation(); handleStatusChange(res.id, "cancelled"); }}>Cancelar</Button>
                    </>
                  )}
                  {res.status === "confirmed" && (
                    <>
                      <Button size="sm" variant="gradient" className="flex-1" onClick={(e) => { e.stopPropagation(); handleStatusChange(res.id, "completed"); }}>Completar</Button>
                      <Button size="sm" variant="outline-primary" onClick={(e) => { e.stopPropagation(); handleStatusChange(res.id, "noshow"); }}>No-show</Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New reservation modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-foreground/40 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowNewModal(false)}>
          <div className="bg-card rounded-t-2xl sm:rounded-2xl border border-border p-5 sm:p-6 w-full sm:max-w-lg space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold">Nueva reserva</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2"><label className="text-xs font-medium text-muted-foreground">Nombre *</label><input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={newRes.name} onChange={e => setNewRes(prev => ({ ...prev, name: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-muted-foreground">Teléfono *</label><input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={newRes.phone} onChange={e => setNewRes(prev => ({ ...prev, phone: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-muted-foreground">Email</label><input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={newRes.email} onChange={e => setNewRes(prev => ({ ...prev, email: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-muted-foreground">Fecha *</label><input type="date" className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={newRes.date} onChange={e => setNewRes(prev => ({ ...prev, date: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-muted-foreground">Hora *</label><input type="time" className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={newRes.time} onChange={e => setNewRes(prev => ({ ...prev, time: e.target.value }))} /></div>
              <div><label className="text-xs font-medium text-muted-foreground">Personas</label><input type="number" min={1} className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={newRes.guests} onChange={e => setNewRes(prev => ({ ...prev, guests: parseInt(e.target.value) || 1 }))} /></div>
              <div className="sm:col-span-2"><label className="text-xs font-medium text-muted-foreground">Notas</label><textarea className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" rows={2} value={newRes.notes} onChange={e => setNewRes(prev => ({ ...prev, notes: e.target.value }))} /></div>
            </div>
            <div className="flex gap-3">
              <Button variant="gradient" className="flex-1" onClick={saveNewRes}>Crear reserva</Button>
              <Button variant="outline-primary" onClick={() => setShowNewModal(false)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Tables Section ──
const zoneColors: Record<string, string> = { Interior: "bg-primary/10", Terraza: "bg-success/10", Barra: "bg-gold/10", Privado: "bg-muted" };
const statusBg: Record<string, string> = { free: "border-success bg-success/5", reserved: "border-primary bg-primary/5", occupied: "border-destructive bg-destructive/5", "out-of-service": "border-muted bg-muted/50" };
const statusLabel: Record<string, string> = { free: "Libre", reserved: "Reservada", occupied: "Ocupada", "out-of-service": "Fuera de servicio" };

const TablesSection = () => {
  const { tables, addTable, updateTable, deleteTable } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState<TableType | null>(null);
  const [form, setForm] = useState({ number: "", capacity: 2, zone: "Interior" as TableType["zone"], combinable: false, status: "free" as TableType["status"] });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0);

  const openNew = () => {
    setEditingTable(null);
    setForm({ number: `Mesa ${tables.length + 1}`, capacity: 2, zone: "Interior", combinable: false, status: "free" });
    setShowModal(true);
  };

  const openEdit = (table: TableType) => {
    setEditingTable(table);
    setForm({ number: table.number, capacity: table.capacity, zone: table.zone, combinable: table.combinable, status: table.status });
    setShowModal(true);
  };

  const saveTable = () => {
    if (!form.number) return;
    if (editingTable) {
      updateTable(editingTable.id, form);
      toast.success("Mesa actualizada");
    } else {
      addTable(form);
      toast.success("Mesa añadida");
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    deleteTable(id);
    setDeleteConfirm(null);
    toast.success("Mesa eliminada");
  };

  const cycleStatus = (table: TableType) => {
    const order: TableType["status"][] = ["free", "reserved", "occupied", "out-of-service"];
    const next = order[(order.indexOf(table.status) + 1) % order.length];
    updateTable(table.id, { status: next });
    toast.success(`${table.number}: ${statusLabel[next]}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-1">Mesas</h2>
          <p className="text-muted-foreground text-sm">Capacidad total: {totalCapacity} cubiertos</p>
        </div>
        <Button variant="gradient" size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" /> Añadir mesa</Button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {["Interior", "Terraza", "Barra", "Privado"].map(zone => (
          <span key={zone} className={`px-3 py-1 rounded-full text-xs font-medium ${zoneColors[zone]}`}>{zone}</span>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {tables.map(table => (
          <div key={table.id} className={`rounded-2xl border-2 p-3 sm:p-4 space-y-1.5 sm:space-y-2 transition-colors cursor-pointer ${statusBg[table.status]}`} onClick={() => openEdit(table)}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm">{table.number}</span>
              <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-medium ${zoneColors[table.zone]}`}>{table.zone}</span>
            </div>
            <div className="text-xs text-muted-foreground">{table.capacity} pers.</div>
            <button onClick={e => { e.stopPropagation(); cycleStatus(table); }} className="text-xs font-medium hover:underline">
              {statusLabel[table.status]}
            </button>
            {table.reservedBy && <div className="text-xs text-primary truncate">{table.reservedBy}</div>}
            {table.combinable && <div className="text-[10px] text-muted-foreground">Combinable</div>}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-foreground/40 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowModal(false)}>
          <div className="bg-card rounded-t-2xl sm:rounded-2xl border border-border p-5 sm:p-6 w-full sm:max-w-sm space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold">{editingTable ? "Editar mesa" : "Nueva mesa"}</h3>
            <div><label className="text-xs font-medium text-muted-foreground">Nombre</label><input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={form.number} onChange={e => setForm(prev => ({ ...prev, number: e.target.value }))} /></div>
            <div><label className="text-xs font-medium text-muted-foreground">Capacidad</label><input type="number" min={1} className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={form.capacity} onChange={e => setForm(prev => ({ ...prev, capacity: parseInt(e.target.value) || 1 }))} /></div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Zona</label>
              <div className="grid grid-cols-2 sm:flex gap-2 mt-1">
                {(["Interior", "Terraza", "Barra", "Privado"] as const).map(z => (
                  <button key={z} onClick={() => setForm(prev => ({ ...prev, zone: z }))}
                    className={`py-2 rounded-xl text-xs font-medium transition-colors ${form.zone === z ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>{z}</button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.combinable} onChange={e => setForm(prev => ({ ...prev, combinable: e.target.checked }))} />
              Combinable
            </label>
            <div className="flex gap-3">
              <Button variant="gradient" className="flex-1" onClick={saveTable}>Guardar</Button>
              {editingTable && <Button variant="destructive" size="sm" onClick={() => { setShowModal(false); setDeleteConfirm(editingTable.id); }}>Eliminar</Button>}
              <Button variant="outline-primary" onClick={() => setShowModal(false)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-foreground/40 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-card rounded-2xl border border-border p-6 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold">¿Eliminar mesa?</h3>
            <p className="text-sm text-muted-foreground">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <Button variant="destructive" className="flex-1" onClick={() => handleDelete(deleteConfirm)}>Eliminar</Button>
              <Button variant="outline-primary" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Metrics Section ──
const MetricsSection = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl sm:text-2xl font-bold mb-1">Métricas</h2>
      <p className="text-muted-foreground text-sm">Datos de los últimos 30 días</p>
    </div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {[
        { label: "Reservas totales", value: metricsData.totalReservations },
        { label: "Cubiertos totales", value: metricsData.totalCoversMonth },
        { label: "Ocupación media", value: `${metricsData.avgOccupancy}%` },
        { label: "Tasa no-show", value: `${metricsData.noshowRate}%` },
      ].map((kpi, i) => (
        <div key={i} className="bg-card rounded-xl border border-border p-3 sm:p-4">
          <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">{kpi.label}</div>
          <div className="text-xl sm:text-2xl font-bold">{kpi.value}</div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="bg-card rounded-2xl border border-border p-4 sm:p-6">
        <h3 className="text-sm font-bold font-sans mb-4">Reservas por día</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={metricsData.reservationsByDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="lunch" name="Mediodía" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
            <Bar dataKey="dinner" name="Noche" fill="hsl(var(--gold))" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card rounded-2xl border border-border p-4 sm:p-6">
        <h3 className="text-sm font-bold font-sans mb-4">Ocupación semanal</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={metricsData.weeklyOccupancy}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="occupancy" name="Ocupación %" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card rounded-2xl border border-border p-4 sm:p-6">
        <h3 className="text-sm font-bold font-sans mb-4">Platos más vistos</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={metricsData.topDishes} layout="vertical">
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={80} />
            <Tooltip />
            <Bar dataKey="views" fill="hsl(var(--primary))" radius={[0,4,4,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-card rounded-2xl border border-border p-4 sm:p-6">
        <h3 className="text-sm font-bold font-sans mb-4">Reservas por fuente</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={metricsData.reservationsBySource} dataKey="value" nameKey="source" cx="50%" cy="50%" outerRadius={70} label={({ source, value }) => `${source} ${value}%`}>
              {metricsData.reservationsBySource.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div className="bg-primary/5 rounded-2xl border border-primary/20 p-4 sm:p-6">
      <div className="flex items-start gap-3">
        <TrendingUp className="h-5 w-5 text-primary mt-0.5 shrink-0" />
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
  const { restaurant } = useApp();
  const url = `${window.location.origin}/r/${restaurant.slug}`;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-1">QR y compartir</h2>
        <p className="text-muted-foreground text-sm">Tu QR listo para imprimir y compartir</p>
      </div>
      <div className="flex flex-col md:flex-row gap-6 items-stretch md:items-start">
        <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 flex flex-col items-center gap-4 sm:gap-6">
          <QRCodeSVG value={url} size={160} bgColor="transparent" fgColor="hsl(15, 25%, 9%)" level="M" className="sm:w-[200px] sm:h-[200px]" />
          <p className="text-sm text-muted-foreground text-center max-w-xs">Escanea para ver la carta y reservar mesa</p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Button variant="gradient" size="sm"><Download className="h-4 w-4 mr-1" /> PNG</Button>
            <Button variant="outline-primary" size="sm"><Download className="h-4 w-4 mr-1" /> PDF</Button>
          </div>
        </div>
        <div className="flex-1 space-y-4 sm:space-y-6">
          <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-3">
            <h3 className="text-sm font-bold font-sans">Link directo</h3>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <code className="flex-1 bg-secondary px-3 py-2 rounded-lg text-xs sm:text-sm truncate block">{url}</code>
              <Button size="sm" variant="outline-primary" className="shrink-0" onClick={() => { navigator.clipboard.writeText(url); toast.success("Link copiado"); }}>Copiar</Button>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-3">
            <h3 className="text-sm font-bold font-sans">Compartir</h3>
            <div className="flex gap-2 flex-wrap">
              {["WhatsApp", "Instagram", "Facebook", "Email"].map(s => (
                <Button key={s} size="sm" variant="secondary">{s}</Button>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-3">
            <h3 className="text-sm font-bold font-sans">Widget embebible</h3>
            <code className="block bg-secondary px-3 py-2 rounded-lg text-xs overflow-x-auto">{`<script src="${window.location.origin}/widget/${restaurant.slug}.js"></script>`}</code>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Settings Section ──
const SettingsSection = () => {
  const { notifications, toggleNotification } = useApp();

  const notifItems: { key: keyof typeof notifications; label: string }[] = [
    { key: "emailOnReservation", label: "Email al recibir reserva" },
    { key: "emailOnCancellation", label: "Email en cancelación" },
    { key: "dailySummary", label: "Resumen diario" },
    { key: "noshowAlert", label: "Alerta de no-show" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-1">Configuración</h2>
        <p className="text-muted-foreground text-sm">Ajustes generales y facturación</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-4">
          <h3 className="text-base sm:text-lg font-bold font-sans">General</h3>
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
        <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-4">
          <h3 className="text-base sm:text-lg font-bold font-sans">Facturación</h3>
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
        <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-4">
          <h3 className="text-base sm:text-lg font-bold font-sans">Notificaciones</h3>
          {notifItems.map((n) => (
            <div key={n.key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm">{n.label}</span>
              <button onClick={() => { toggleNotification(n.key); toast.success("Notificación actualizada"); }}
                className={`w-10 h-5 rounded-full relative transition-colors shrink-0 ${notifications[n.key] ? 'bg-success' : 'bg-muted'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-card shadow transition-transform ${notifications[n.key] ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-4">
          <h3 className="text-base sm:text-lg font-bold font-sans">Multi-idioma</h3>
          {[
            { lang: "Español", flag: "🇪🇸", on: true },
            { lang: "English", flag: "🇬🇧", on: true },
            { lang: "Français", flag: "🇫🇷", on: true },
            { lang: "Català", flag: "🏳️", on: true },
          ].map((l, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm">{l.flag} {l.lang}</span>
              <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors shrink-0 ${l.on ? 'bg-success' : 'bg-muted'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-card shadow transition-transform ${l.on ? 'left-5' : 'left-0.5'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

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
  const { isLoggedIn, logout, restaurant } = useApp();
  const [active, setActive] = useState<Section>("restaurant");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const ActiveSection = sections[active];

  if (!isLoggedIn) return <LoginScreen />;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar — hidden on mobile, slide-in as overlay */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-60 bg-card border-r border-border transition-transform duration-200
        md:static md:translate-x-0 md:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            <span className="font-serif text-lg font-bold">CARTA</span>
          </Link>
          <button className="md:hidden p-1.5 hover:bg-secondary rounded-lg" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {sidebarItems.map(item => (
            <button key={item.id} onClick={() => { setActive(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${active === item.id ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-4 left-3 right-3 px-3">
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">PRO</span>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 hover:bg-secondary rounded-lg">
              <Menu className="h-5 w-5 text-muted-foreground md:hidden" />
              <LayoutGrid className="h-4 w-4 text-muted-foreground hidden md:block" />
            </button>
            <span className="text-sm text-muted-foreground hidden sm:inline">{restaurant.name}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block" />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="relative p-2 hover:bg-secondary rounded-lg">
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            <button onClick={() => { logout(); toast.success("Sesión cerrada"); }} className="p-2 hover:bg-secondary rounded-lg" title="Cerrar sesión">
              <LogOut className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-primary" />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto pb-20 md:pb-6">
          <ActiveSection />
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-card border-t border-border md:hidden safe-area-bottom">
        <div className="flex justify-around items-center h-14">
          {sidebarItems.slice(0, 5).map(item => (
            <button key={item.id} onClick={() => setActive(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${active === item.id ? 'text-primary' : 'text-muted-foreground'}`}>
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
          <button onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-muted-foreground">
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-medium">Más</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
