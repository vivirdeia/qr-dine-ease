import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { ALLERGENS, type Dish, type Category, type Reservation, type Table as TableType, type Wine } from "@/data/mockData";
import { dishImages } from "@/data/dishImages";
import { getWineImage } from "@/data/wineImages";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import {
  UtensilsCrossed, Store, Book, CalendarCheck, LayoutGrid, BarChart3,
  QrCode, Settings, Bell, ChevronDown, Plus, Edit, Trash2, Copy,
  GripVertical, X, Clock, Users, XCircle, CheckCircle2,
  Download, ExternalLink, TrendingUp, LogOut, Eye, EyeOff, Menu,
  FileDown, AlertTriangle, Sparkles,
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

// LoginScreen removed — now handled by /login route
// ── Restaurant Section ──
const RestaurantSection = () => {
  const { restaurant, updateRestaurant, isSlugAvailable, currentTenant, suggestSlug } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...restaurant });

  const handleSave = () => {
    const nextSlug = (form.slug || "").trim().toLowerCase();
    if (!nextSlug) { toast.error("El slug no puede estar vacío"); return; }
    if (!/^[a-z0-9-]+$/.test(nextSlug)) { toast.error("Solo letras minúsculas, números y guiones"); return; }
    if (nextSlug !== restaurant.slug && !isSlugAvailable(nextSlug, currentTenant?.id)) {
      const sug = suggestSlug(nextSlug);
      toast.error(`Ese enlace ya está en uso. Sugerencia: ${sug}`);
      return;
    }
    updateRestaurant({ ...form, slug: nextSlug });
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
          <label className="text-xs font-medium text-muted-foreground">Enlace público (slug)</label>
          {editing ? (
            <>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{window.location.origin}/r/</span>
                <input
                  className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm font-mono"
                  value={form.slug || ""}
                  onChange={e => setForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") }))}
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">Solo minúsculas, números y guiones. Debe ser único.</p>
            </>
          ) : (
            <div className="mt-1 px-3 py-2 bg-secondary rounded-lg text-sm font-mono break-all">{window.location.origin}/r/{restaurant.slug}</div>
          )}
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
                      <span className="text-xs text-muted-foreground mr-1">M:</span>
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
                  {!h.closed && h.evening && !h.continuous && (
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-xs text-muted-foreground mr-1">N:</span>
                      <input type="time" value={h.evening.open} className="px-1 py-0.5 bg-secondary border border-border rounded text-xs w-20" onChange={e => {
                        const hours = [...form.hours];
                        hours[i] = { ...hours[i], evening: { ...hours[i].evening!, open: e.target.value } };
                        setForm(prev => ({ ...prev, hours }));
                      }} />
                      <span>-</span>
                      <input type="time" value={h.evening.close} className="px-1 py-0.5 bg-secondary border border-border rounded text-xs w-20" onChange={e => {
                        const hours = [...form.hours];
                        hours[i] = { ...hours[i], evening: { ...hours[i].evening!, close: e.target.value } };
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
  const { categories, dishes, wines, dailyMenu, addDish, updateDish, deleteDish, duplicateDish, toggleDishAvailability, addCategory, updateCategory, deleteCategory, updateDailyMenu, addWine, updateWine, deleteWine, canAddDish, canAddCategory, userPlan, planLimits, dishViews } = useApp();
  const [activeCategory, setActiveCategory] = useState("c1");
  const [showDishModal, setShowDishModal] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("🍽️");
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [dailyForm, setDailyForm] = useState({ ...dailyMenu });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteCatConfirm, setDeleteCatConfirm] = useState<string | null>(null);
  const [showCatDrawer, setShowCatDrawer] = useState(false);
  const [showWineModal, setShowWineModal] = useState(false);
  const [editingWine, setEditingWine] = useState<Wine | null>(null);
  const [wineForm, setWineForm] = useState<Partial<Wine>>({});

  const [dishForm, setDishForm] = useState<Partial<Dish>>({});

  const categoryDishes = dishes.filter(d => d.categoryId === activeCategory);
  const activeCat = categories.find(c => c.id === activeCategory);

  const openNewDish = () => {
    if (!canAddDish) {
      toast.error(`Plan ${userPlan}: máximo ${planLimits.maxDishes} platos. Haz upgrade para añadir más.`);
      return;
    }
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
    if (editingCategory) {
      updateCategory(editingCategory.id, { name: newCatName, icon: newCatIcon });
      toast.success("Categoría actualizada");
    } else {
      if (!canAddCategory) {
        toast.error(`Plan ${userPlan}: máximo ${planLimits.maxCategories} categorías. Haz upgrade para añadir más.`);
        return;
      }
      addCategory(newCatName, newCatIcon);
      toast.success("Categoría añadida");
    }
    setShowCategoryModal(false);
    setEditingCategory(null);
    setNewCatName("");
    setNewCatIcon("🍽️");
  };

  const openEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setNewCatName(cat.name);
    setNewCatIcon(cat.icon);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = (id: string) => {
    const catDishCount = dishes.filter(d => d.categoryId === id).length;
    if (catDishCount > 0) {
      toast.error(`Esta categoría tiene ${catDishCount} platos. Se eliminarán todos.`);
    }
    deleteCategory(id);
    setDeleteCatConfirm(null);
    if (activeCategory === id) setActiveCategory(categories.find(c => c.id !== id && c.id !== "c0")?.id || "c1");
    toast.success("Categoría eliminada");
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
            <div key={cat.id} className="group flex items-center gap-1">
              <button onClick={() => setActiveCategory(cat.id)}
                className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${activeCategory === cat.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-secondary text-muted-foreground'}`}>
                <span>{cat.icon}</span>
                <span className="flex-1">{cat.name}</span>
                <span className="text-xs text-muted-foreground">{dishes.filter(d => d.categoryId === cat.id).length}</span>
              </button>
              <div className="hidden group-hover:flex items-center gap-0.5">
                <button onClick={() => openEditCategory(cat)} className="p-1 hover:bg-secondary rounded"><Edit className="h-3 w-3 text-muted-foreground" /></button>
                <button onClick={() => setDeleteCatConfirm(cat.id)} className="p-1 hover:bg-secondary rounded"><Trash2 className="h-3 w-3 text-destructive/60" /></button>
              </div>
            </div>
          ))}
          <Button variant="ghost" size="sm" className="w-full justify-start text-primary" onClick={() => { setEditingCategory(null); setNewCatName(""); setNewCatIcon("🍽️"); setShowCategoryModal(true); }}>
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
                {(dish.photoUrl || dishImages[dish.id]) ? (
                  <img src={dish.photoUrl || dishImages[dish.id]} alt={dish.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover shrink-0" loading="lazy" />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br from-primary/10 to-gold/10 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{dish.name}</span>
                    {dish.featured && <span className="bg-primary/15 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">Destacado</span>}
                    {dish.isNew && <span className="bg-gold text-gold-foreground text-[10px] px-2 py-0.5 rounded-full font-bold">Nuevo</span>}
                    {!dish.available && <span className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full font-bold">Agotado</span>}
                    {dish.variants && dish.variants.length > 0 && <span className="bg-secondary text-muted-foreground text-[10px] px-2 py-0.5 rounded-full">{dish.variants.length} variantes</span>}
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

      {/* Wine section with CRUD */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-sans flex items-center gap-2">🍷 Carta de vinos</h3>
          <Button size="sm" variant="gradient" onClick={() => {
            setEditingWine(null);
            setWineForm({ name: "", region: "", grape: "", type: "tinto", priceBottle: 0, position: wines.length + 1 });
            setShowWineModal(true);
          }}><Plus className="h-4 w-4 mr-1" /> Añadir vino</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {wines.map(wine => (
            <div key={wine.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 group">
              <img src={getWineImage(wine.id, wine.type)} alt={wine.name} className="w-10 h-14 rounded object-cover shrink-0" loading="lazy" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{wine.name} {wine.year && <span className="text-muted-foreground">{wine.year}</span>}</div>
                <div className="text-xs text-muted-foreground">{wine.region} · {wine.grape}</div>
              </div>
              <div className="text-right shrink-0 text-sm">
                {wine.priceGlass && <div className="text-muted-foreground">Copa €{wine.priceGlass.toFixed(2)}</div>}
                <div className="font-bold text-primary">€{wine.priceBottle.toFixed(2)}</div>
              </div>
              <div className="hidden group-hover:flex items-center gap-0.5">
                <button onClick={() => { setEditingWine(wine); setWineForm({ ...wine }); setShowWineModal(true); }} className="p-1 hover:bg-secondary rounded"><Edit className="h-3 w-3 text-muted-foreground" /></button>
                <button onClick={() => { deleteWine(wine.id); toast.success("Vino eliminado"); }} className="p-1 hover:bg-secondary rounded"><Trash2 className="h-3 w-3 text-destructive/60" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wine modal */}
      {showWineModal && (
        <div className="fixed inset-0 z-50 bg-foreground/40 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setShowWineModal(false)}>
          <div className="bg-card rounded-t-2xl sm:rounded-2xl border border-border p-5 sm:p-6 w-full sm:max-w-lg max-h-[90vh] overflow-y-auto space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold font-sans">{editingWine ? "Editar vino" : "Nuevo vino"}</h3>
            <div className="space-y-3">
              <div><label className="text-xs font-medium text-muted-foreground">Nombre *</label><input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={wineForm.name || ""} onChange={e => setWineForm(prev => ({ ...prev, name: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-muted-foreground">Región/DO</label><input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={wineForm.region || ""} onChange={e => setWineForm(prev => ({ ...prev, region: e.target.value }))} /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Uva</label><input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={wineForm.grape || ""} onChange={e => setWineForm(prev => ({ ...prev, grape: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Tipo</label>
                  <select className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={wineForm.type || "tinto"} onChange={e => setWineForm(prev => ({ ...prev, type: e.target.value as Wine["type"] }))}>
                    <option value="tinto">Tinto</option><option value="blanco">Blanco</option><option value="rosado">Rosado</option><option value="espumoso">Espumoso</option><option value="dulce">Dulce</option>
                  </select>
                </div>
                <div><label className="text-xs font-medium text-muted-foreground">Año</label><input type="number" className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={wineForm.year || ""} onChange={e => setWineForm(prev => ({ ...prev, year: parseInt(e.target.value) || undefined }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-muted-foreground">Precio botella (€) *</label><input type="number" step="0.01" className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={wineForm.priceBottle || ""} onChange={e => setWineForm(prev => ({ ...prev, priceBottle: parseFloat(e.target.value) || 0 }))} /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Precio copa (€)</label><input type="number" step="0.01" className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={wineForm.priceGlass || ""} onChange={e => setWineForm(prev => ({ ...prev, priceGlass: parseFloat(e.target.value) || undefined }))} /></div>
              </div>
              <div><label className="text-xs font-medium text-muted-foreground">Descripción</label><textarea className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" rows={2} value={wineForm.description || ""} onChange={e => setWineForm(prev => ({ ...prev, description: e.target.value }))} /></div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="gradient" className="flex-1" onClick={() => {
                if (!wineForm.name || !wineForm.priceBottle) { toast.error("Nombre y precio son obligatorios"); return; }
                if (editingWine) { updateWine(editingWine.id, wineForm); toast.success("Vino actualizado"); }
                else { addWine(wineForm as Omit<Wine, "id">); toast.success("Vino añadido"); }
                setShowWineModal(false);
              }}>Guardar</Button>
              <Button variant="outline-primary" onClick={() => setShowWineModal(false)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}

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
                <label className="text-xs font-medium text-muted-foreground">Foto del plato</label>
                <div className="mt-1 flex items-center gap-2">
                  {(dishForm.photoUrl || (editingDish && dishImages[editingDish.id])) && (
                    <img src={dishForm.photoUrl || (editingDish ? dishImages[editingDish.id] : '')} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  )}
                  <input className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" placeholder="URL de imagen" value={dishForm.photoUrl || ""} onChange={e => setDishForm(prev => ({ ...prev, photoUrl: e.target.value }))} />
                  <label className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-xs font-medium cursor-pointer hover:bg-primary/20 transition-colors">
                    Subir
                    <input type="file" accept="image/*" className="hidden" onChange={e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) { toast.error("Imagen demasiado grande (máx 5MB)"); return; }
                      const canvas = document.createElement('canvas');
                      const img = new Image();
                      img.onload = () => {
                        const max = 800;
                        let w = img.width, h = img.height;
                        if (w > max) { h = h * max / w; w = max; }
                        if (h > max) { w = w * max / h; h = max; }
                        canvas.width = w; canvas.height = h;
                        canvas.getContext('2d')?.drawImage(img, 0, 0, w, h);
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                        setDishForm(prev => ({ ...prev, photoUrl: dataUrl }));
                      };
                      img.src = URL.createObjectURL(file);
                    }} />
                  </label>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Pega una URL o sube una foto (máx 5MB, se comprime)</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Etiquetas</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {[
                    { id: "vegetarian", label: "🌿 Vegetariano" },
                    { id: "vegan", label: "🌱 Vegano" },
                    { id: "gluten-free", label: "🚫🌾 Sin gluten" },
                    { id: "spicy", label: "🔥 Picante" },
                  ].map(tag => {
                    const active = dishForm.dietary?.includes(tag.id);
                    return (
                      <button key={tag.id} type="button" onClick={() => setDishForm(prev => ({
                        ...prev,
                        dietary: active ? (prev.dietary || []).filter(x => x !== tag.id) : [...(prev.dietary || []), tag.id],
                      }))}
                        className={`text-xs px-2 py-1 rounded-full transition-colors ${active ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Alérgenos</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {ALLERGENS.map(a => (
                    <button key={a.id} type="button" onClick={() => setDishForm(prev => ({ ...prev, allergens: prev.allergens?.includes(a.id) ? prev.allergens.filter(x => x !== a.id) : [...(prev.allergens || []), a.id] }))}
                      className={`text-xs px-2 py-1 rounded-full transition-colors ${dishForm.allergens?.includes(a.id) ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                      {a.emoji} {a.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground">Variantes (opcional)</label>
                  <button type="button" className="text-xs text-primary font-medium" onClick={() => setDishForm(prev => ({ ...prev, variants: [...(prev.variants || []), { name: "", price: 0 }] }))}>+ Añadir variante</button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Útil para medias raciones o tamaños. Si está vacío se usa solo el precio principal.</p>
                <div className="space-y-2 mt-2">
                  {(dishForm.variants || []).map((v, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" placeholder="Ej: Media ración" value={v.name}
                        onChange={e => setDishForm(prev => ({ ...prev, variants: (prev.variants || []).map((x, idx) => idx === i ? { ...x, name: e.target.value } : x) }))} />
                      <input type="number" step="0.01" className="w-24 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" placeholder="€" value={v.price || ""}
                        onChange={e => setDishForm(prev => ({ ...prev, variants: (prev.variants || []).map((x, idx) => idx === i ? { ...x, price: parseFloat(e.target.value) || 0 } : x) }))} />
                      <button type="button" className="p-1.5 hover:bg-secondary rounded" onClick={() => setDishForm(prev => ({ ...prev, variants: (prev.variants || []).filter((_, idx) => idx !== i) }))}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive/60" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={dishForm.available ?? true} onChange={e => setDishForm(prev => ({ ...prev, available: e.target.checked }))} />
                  Disponible
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={dishForm.isNew ?? false} onChange={e => setDishForm(prev => ({ ...prev, isNew: e.target.checked }))} />
                  Novedad
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={dishForm.featured ?? false} onChange={e => setDishForm(prev => ({ ...prev, featured: e.target.checked }))} />
                  Destacado
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
        <div className="fixed inset-0 z-50 bg-foreground/40 flex items-center justify-center p-4" onClick={() => { setShowCategoryModal(false); setEditingCategory(null); }}>
          <div className="bg-card rounded-2xl border border-border p-6 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold">{editingCategory ? "Editar categoría" : "Nueva categoría"}</h3>
            <div><label className="text-xs font-medium text-muted-foreground">Nombre</label><input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={newCatName} onChange={e => setNewCatName(e.target.value)} /></div>
            <div><label className="text-xs font-medium text-muted-foreground">Icono (emoji)</label><input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm" value={newCatIcon} onChange={e => setNewCatIcon(e.target.value)} /></div>
            <div className="flex gap-3">
              <Button variant="gradient" className="flex-1" onClick={saveCategory}>{editingCategory ? "Guardar" : "Añadir"}</Button>
              <Button variant="outline-primary" onClick={() => { setShowCategoryModal(false); setEditingCategory(null); }}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete category confirmation */}
      {deleteCatConfirm && (
        <div className="fixed inset-0 z-50 bg-foreground/40 flex items-center justify-center p-4" onClick={() => setDeleteCatConfirm(null)}>
          <div className="bg-card rounded-2xl border border-border p-6 max-w-sm w-full space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold">¿Eliminar categoría?</h3>
            <p className="text-sm text-muted-foreground">
              Se eliminará la categoría y sus {dishes.filter(d => d.categoryId === deleteCatConfirm).length} platos. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <Button variant="destructive" className="flex-1" onClick={() => handleDeleteCategory(deleteCatConfirm)}>Eliminar</Button>
              <Button variant="outline-primary" onClick={() => setDeleteCatConfirm(null)}>Cancelar</Button>
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
const MetricsSection = () => {
  const { reservations, tables, dishes, dishViews } = useApp();

  const metrics = useMemo(() => {
    const total = reservations.length;
    const confirmed = reservations.filter(r => r.status === "confirmed" || r.status === "completed").length;
    const completed = reservations.filter(r => r.status === "completed").length;
    const cancelled = reservations.filter(r => r.status === "cancelled").length;
    const noshows = reservations.filter(r => r.status === "noshow").length;
    const totalGuests = reservations.filter(r => r.status !== "cancelled").reduce((s, r) => s + r.guests, 0);
    const avgParty = total > 0 ? (totalGuests / (total - cancelled)).toFixed(1) : "0";
    const noshowRate = total > 0 ? ((noshows / total) * 100).toFixed(1) : "0";
    const totalCapacity = tables.reduce((s, t) => s + t.capacity, 0);
    const occupancy = totalCapacity > 0 ? Math.round((totalGuests / (totalCapacity * 7)) * 100) : 0;

    // Reservations by day
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const byDay = dayNames.map(day => ({ day, lunch: 0, dinner: 0 }));
    reservations.forEach(r => {
      const d = new Date(r.date).getDay();
      const hour = parseInt(r.time.split(":")[0]);
      if (hour < 17) byDay[d].lunch++;
      else byDay[d].dinner++;
    });

    // By source
    const digital = reservations.filter(r => r.source === "digital").length;
    const manual = reservations.filter(r => r.source === "manual").length;
    const phone = reservations.filter(r => r.source === "phone").length;
    const sourceData = [
      { source: "Carta digital", value: total > 0 ? Math.round((digital / total) * 100) : 0, fill: "hsl(var(--primary))" },
      { source: "Manual", value: total > 0 ? Math.round((manual / total) * 100) : 0, fill: "hsl(var(--gold))" },
      { source: "Teléfono", value: total > 0 ? Math.round((phone / total) * 100) : 0, fill: "hsl(var(--muted-foreground))" },
    ];

    const topDishes = dishes
      .map(d => ({ id: d.id, name: d.name, views: dishViews[d.id] || 0 }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
    const totalDishViews = topDishes.reduce((s, x) => s + x.views, 0);

    return { total, confirmed, completed, cancelled, noshows, totalGuests, avgParty, noshowRate, occupancy, byDay, sourceData, topDishes, totalDishViews };
  }, [reservations, tables, dishes, dishViews]);

  const exportCSV = () => {
    const header = "ID,Nombre,Teléfono,Email,Fecha,Hora,Personas,Estado,Fuente,Notas\n";
    const rows = reservations.map(r =>
      `${r.id},"${r.name}","${r.phone}","${r.email || ""}",${r.date},${r.time},${r.guests},${r.status},${r.source},"${(r.notes || "").replace(/"/g, '""')}"`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `reservas_${new Date().toISOString().split("T")[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV descargado");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-1">Métricas</h2>
          <p className="text-muted-foreground text-sm">Datos calculados de tus reservas reales</p>
        </div>
        <Button variant="outline-primary" size="sm" onClick={exportCSV}>
          <FileDown className="h-4 w-4 mr-1" /> Exportar CSV
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {[
          { label: "Reservas totales", value: metrics.total },
          { label: "Cubiertos totales", value: metrics.totalGuests },
          { label: "Ocupación estimada", value: `${metrics.occupancy}%` },
          { label: "Tasa no-show", value: `${metrics.noshowRate}%` },
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
            <BarChart data={metrics.byDay}>
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
          <h3 className="text-sm font-bold font-sans mb-4">Reservas por fuente</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={metrics.sourceData} dataKey="value" nameKey="source" cx="50%" cy="50%" outerRadius={70} label={({ source, value }) => `${source} ${value}%`}>
                {metrics.sourceData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Confirmadas", value: metrics.confirmed, color: "text-success" },
          { label: "Completadas", value: metrics.completed, color: "text-primary" },
          { label: "Canceladas", value: metrics.cancelled, color: "text-destructive" },
          { label: "Tamaño medio", value: `${metrics.avgParty} pers.`, color: "text-foreground" },
        ].map((kpi, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-3">
            <div className="text-[10px] text-muted-foreground mb-1">{kpi.label}</div>
            <div className={`text-lg font-bold ${kpi.color}`}>{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-border p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold font-sans">Platos más vistos</h3>
          <span className="text-xs text-muted-foreground">{metrics.totalDishViews} vistas totales</span>
        </div>
        {metrics.totalDishViews === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Todavía no hay vistas. Cuando los comensales abran un plato en la carta, aparecerá aquí.
          </p>
        ) : (
          <div className="space-y-2">
            {metrics.topDishes.filter(d => d.views > 0).map((d, i) => {
              const max = metrics.topDishes[0]?.views || 1;
              const pct = Math.max(4, Math.round((d.views / max) * 100));
              return (
                <div key={d.id} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-5 shrink-0">{i + 1}</span>
                  <span className="text-sm flex-1 min-w-0 truncate">{d.name}</span>
                  <div className="hidden sm:block flex-1 bg-secondary rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm font-bold w-12 text-right tabular-nums">{d.views}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-primary/5 rounded-2xl border border-primary/20 p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <h4 className="font-bold text-sm font-sans">Insight</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {metrics.noshows > 0 
                ? `Tienes ${metrics.noshows} no-shows (${metrics.noshowRate}%). Considera enviar recordatorios por WhatsApp.`
                : "¡Genial! No tienes no-shows. Tus clientes son puntuales."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── QR Section ──
const QRSection = () => {
  const { restaurant } = useApp();
  const baseUrl = `${window.location.origin}/r/${restaurant.slug}`;
  const tableUrl = `${baseUrl}?src=qr`;
  const shareText = `Mira la carta de ${restaurant.name}: ${baseUrl}`;

  const downloadPng = (svgId: string, suffix: string) => {
    const svg = document.getElementById(svgId) as unknown as SVGSVGElement | null;
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      const size = 1024;
      const canvas = document.createElement("canvas");
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `qr-${restaurant.slug || "carta"}-${suffix}.png`;
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(xml)));
  };

  const openPublic = (url: string) => window.open(url, "_blank", "noopener");
  const shareWhatsapp = () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank", "noopener");
  const shareEmail = () => { window.location.href = `mailto:?subject=${encodeURIComponent(restaurant.name)}&body=${encodeURIComponent(shareText)}`; };
  const nativeShare = async () => {
    if (navigator.share) { try { await navigator.share({ title: restaurant.name, text: shareText, url: baseUrl }); } catch { /* cancelled */ } }
    else { navigator.clipboard.writeText(baseUrl); toast.success("Enlace copiado"); }
  };

  const qrs = [
    {
      id: "dashboard-qr-svg",
      title: "QR general",
      desc: "Para tarjetas, redes, escaparate o cualquier sitio fuera del local.",
      url: baseUrl,
      suffix: "general",
    },
    {
      id: "dashboard-qr-table-svg",
      title: "QR de mesa / en sala",
      desc: "Pegatinas para mesas. Si activas la opción correspondiente en Ajustes, oculta el botón de reservar.",
      url: tableUrl,
      suffix: "mesa",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-1">QR y enlace público</h2>
        <p className="text-muted-foreground text-sm">Dos QR: uno para difusión externa y otro para imprimir en las mesas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {qrs.map(qr => (
          <div key={qr.id} className="bg-card rounded-2xl border border-border p-5 sm:p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-base font-bold font-sans">{qr.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{qr.desc}</p>
            </div>
            <div className="flex items-center justify-center bg-secondary/40 rounded-xl p-4">
              <QRCodeSVG id={qr.id} value={qr.url} size={180} bgColor="#ffffff" fgColor="hsl(15, 25%, 9%)" level="M" includeMargin />
            </div>
            <code className="bg-secondary px-3 py-2 rounded-lg text-[11px] break-all">{qr.url}</code>
            <div className="flex flex-wrap gap-2">
              <Button variant="gradient" size="sm" onClick={() => downloadPng(qr.id, qr.suffix)}><Download className="h-4 w-4 mr-1" /> Descargar PNG</Button>
              <Button variant="outline-primary" size="sm" onClick={() => openPublic(qr.url)}><ExternalLink className="h-4 w-4 mr-1" /> Abrir</Button>
              <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(qr.url); toast.success("Enlace copiado"); }}>Copiar</Button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-3">
          <h3 className="text-sm font-bold font-sans">Compartir</h3>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="secondary" onClick={shareWhatsapp}>WhatsApp</Button>
            <Button size="sm" variant="secondary" onClick={shareEmail}>Email</Button>
            <Button size="sm" variant="secondary" onClick={nativeShare}>Más…</Button>
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-2">
          <h3 className="text-sm font-bold font-sans">Consejo</h3>
          <p className="text-xs text-muted-foreground">Imprime el QR de mesa con la pegatina pequeña en cada mesa. Usa el QR general en tarjetas o redes para que la gente reserve.</p>
        </div>
      </div>
    </div>
  );
};


// ── Settings Section ──
const hexToHsl = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

const hslToHex = (hsl: string): string => {
  const parts = hsl.match(/[\d.]+/g);
  if (!parts || parts.length < 3) return "#c4704e";
  const h = parseFloat(parts[0]) / 360;
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  let r, g, b2;
  if (s === 0) { r = g = b2 = l; } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3); g = hue2rgb(p, q, h); b2 = hue2rgb(p, q, h - 1/3);
  }
  return `#${[r, g, b2].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('')}`;
};

const SettingsSection = () => {
  const { notifications, toggleNotification, restaurant, updateRestaurant, userPlan, setUserPlan, role, users, currentTenant, currentUser, inviteTeamMember, updateUserRole, removeUser } = useApp();
  const [inviteForm, setInviteForm] = useState({ email: "", password: "", name: "", role: "staff" as "staff" | "owner" });
  const teamMembers = useMemo(() => users.filter(u => u.tenantId === currentTenant?.id), [users, currentTenant]);
  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.email || !inviteForm.password || !inviteForm.name) {
      toast.error("Completa todos los campos"); return;
    }
    const ok = inviteTeamMember(inviteForm.email, inviteForm.password, inviteForm.name, inviteForm.role);
    if (!ok) { toast.error("Email ya registrado"); return; }
    toast.success("Miembro añadido");
    setInviteForm({ email: "", password: "", name: "", role: "staff" });
  };
  const [brandColors, setBrandColors] = useState({
    primary: restaurant.brandColors?.primary || "#c4704e",
    accent: restaurant.brandColors?.accent || "#d4a574",
    background: restaurant.brandColors?.background || "#faf6f1",
  });
  const [tracking, setTracking] = useState({
    googleAnalyticsId: restaurant.tracking?.googleAnalyticsId || "",
    metaPixelId: restaurant.tracking?.metaPixelId || "",
    customHeadScript: restaurant.tracking?.customHeadScript || "",
  });

  const defaultBrand = { primary: "#c4704e", accent: "#d4a574", background: "#faf6f1" };
  const saveBrandColors = () => {
    updateRestaurant({ brandColors });
    toast.success("Paleta de colores guardada. Se aplicará en la carta pública.");
  };
  const resetBrandColors = () => {
    setBrandColors(defaultBrand);
    updateRestaurant({ brandColors: undefined });
    toast.success("Colores restaurados por defecto.");
  };

  const saveTracking = () => {
    updateRestaurant({ tracking });
    toast.success("Códigos de tracking guardados");
  };

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
        <p className="text-muted-foreground text-sm">Ajustes generales, marca y tracking</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Personalización */}
        <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-4 sm:col-span-2">
          <h3 className="text-base sm:text-lg font-bold font-sans">🎨 Personalización de marca</h3>
          <p className="text-xs text-muted-foreground">Estos colores se aplican solo a la carta pública que ven tus clientes.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Color primario</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="color" value={brandColors.primary} onChange={e => setBrandColors(prev => ({ ...prev, primary: e.target.value }))}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
                <input className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm font-mono" value={brandColors.primary} onChange={e => setBrandColors(prev => ({ ...prev, primary: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Color acento</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="color" value={brandColors.accent} onChange={e => setBrandColors(prev => ({ ...prev, accent: e.target.value }))}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
                <input className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm font-mono" value={brandColors.accent} onChange={e => setBrandColors(prev => ({ ...prev, accent: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Fondo</label>
              <div className="flex items-center gap-2 mt-1">
                <input type="color" value={brandColors.background} onChange={e => setBrandColors(prev => ({ ...prev, background: e.target.value }))}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer" />
                <input className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm font-mono" value={brandColors.background} onChange={e => setBrandColors(prev => ({ ...prev, background: e.target.value }))} />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-1">
              <div className="w-8 h-8 rounded-full border border-border" style={{ backgroundColor: brandColors.primary }} />
              <div className="w-8 h-8 rounded-full border border-border" style={{ backgroundColor: brandColors.accent }} />
              <div className="w-8 h-8 rounded-full border border-border" style={{ backgroundColor: brandColors.background }} />
            </div>
            <Button variant="gradient" size="sm" onClick={saveBrandColors}>Guardar colores</Button>
            <Button variant="outline" size="sm" onClick={resetBrandColors}>Restaurar por defecto</Button>
          </div>

          {/* Live preview */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Vista previa</p>
            <div className="rounded-2xl border border-border overflow-hidden max-w-sm" style={{ backgroundColor: brandColors.background }}>
              <div className="h-16" style={{ backgroundColor: brandColors.primary }} />
              <div className="p-4 space-y-3">
                <div className="space-y-1">
                  <div className="h-3 w-2/3 rounded" style={{ backgroundColor: brandColors.primary, opacity: 0.85 }} />
                  <div className="h-2 w-1/2 rounded bg-black/15" />
                </div>
                <div className="flex items-center justify-between rounded-xl p-3" style={{ backgroundColor: "rgba(255,255,255,0.6)" }}>
                  <div className="space-y-1">
                    <div className="h-2 w-20 rounded bg-black/30" />
                    <div className="h-2 w-28 rounded bg-black/15" />
                  </div>
                  <div className="text-xs font-semibold px-2 py-1 rounded-md" style={{ backgroundColor: brandColors.accent, color: "#1a1a1a" }}>14€</div>
                </div>
                <div className="h-9 rounded-xl flex items-center justify-center text-xs font-medium text-white" style={{ backgroundColor: brandColors.primary }}>
                  Reservar mesa
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Tracking */}
        <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-4 sm:col-span-2">
          <h3 className="text-base sm:text-lg font-bold font-sans">📊 Tracking y píxeles</h3>
          <p className="text-xs text-muted-foreground">Los scripts se inyectan solo en la carta pública, nunca en el panel.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Google Analytics ID</label>
              <input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm font-mono" placeholder="G-XXXXXXXXXX" value={tracking.googleAnalyticsId} onChange={e => setTracking(prev => ({ ...prev, googleAnalyticsId: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Meta Pixel ID</label>
              <input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm font-mono" placeholder="1234567890" value={tracking.metaPixelId} onChange={e => setTracking(prev => ({ ...prev, metaPixelId: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Script personalizado (head)</label>
            <textarea className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-xs font-mono" rows={3} placeholder="<script>...</script>" value={tracking.customHeadScript} onChange={e => setTracking(prev => ({ ...prev, customHeadScript: e.target.value }))} />
          </div>
          <Button variant="gradient" size="sm" onClick={saveTracking}>Guardar tracking</Button>
        </div>

        {/* Módulos y reservas */}
        <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-4 sm:col-span-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold font-sans">🧩 Módulos activos</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Activa o desactiva módulos enteros del panel. Si los desactivas, desaparecen del menú lateral.
            </p>
          </div>

          {[
            {
              key: "reservations" as const,
              title: "Módulo de Reservas",
              desc: "Sección de Reservas en el panel para gestionar las reservas recibidas.",
              value: restaurant.modules?.reservations !== false,
            },
            {
              key: "tables" as const,
              title: "Módulo de Mesas",
              desc: "Sección de Mesas en el panel para configurar el plano y la disponibilidad.",
              value: restaurant.modules?.tables !== false,
            },
          ].map(m => (
            <div key={m.key} className="flex items-start justify-between gap-4 py-3 border-t border-border first:border-t-0">
              <div>
                <p className="text-sm font-medium">{m.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
              </div>
              <button
                onClick={() => {
                  const next = !m.value;
                  updateRestaurant({ modules: { ...restaurant.modules, [m.key]: next } });
                  toast.success(`${m.title} ${next ? "activado" : "desactivado"}`);
                }}
                className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ${m.value ? 'bg-success' : 'bg-muted'}`}
                aria-label={`Activar o desactivar ${m.title}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-transform ${m.value ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}

          <div className="flex items-start justify-between gap-4 py-3 border-t border-border">
            <div>
              <p className="text-sm font-medium">Botón "Reservar" en la carta pública</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Controla si los comensales ven el botón flotante de reservar en <span className="font-mono">/r/{restaurant.slug}</span>.
              </p>
            </div>
            <button
              onClick={() => {
                const next = restaurant.reservationsEnabled === false;
                updateRestaurant({ reservationsEnabled: next });
                toast.success(next ? "Botón de reservar activado" : "Botón de reservar desactivado");
              }}
              className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ${restaurant.reservationsEnabled !== false ? 'bg-success' : 'bg-muted'}`}
              aria-label="Activar o desactivar botón de reservar en la carta"
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-transform ${restaurant.reservationsEnabled !== false ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>

          <div className="flex items-start justify-between gap-4 py-3 border-t border-border">
            <div>
              <p className="text-sm font-medium">Ocultar "Reservar" cuando entran desde un QR</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Si está activo, los clientes que escaneen el <span className="font-medium">QR de mesa</span> (URL con <code className="text-[10px]">?src=qr</code>) no verán el botón de reservar. Quien entre desde redes, Google o un enlace compartido sí lo verá.
              </p>
            </div>
            <button
              onClick={() => {
                const next = !restaurant.hideReserveOnQr;
                updateRestaurant({ hideReserveOnQr: next });
                toast.success(next ? "Botón oculto al entrar por QR" : "Botón visible siempre");
              }}
              className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ${restaurant.hideReserveOnQr ? 'bg-success' : 'bg-muted'}`}
              aria-label="Ocultar botón Reservar al entrar desde QR"
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-transform ${restaurant.hideReserveOnQr ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>




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
            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase">
              {userPlan} — {userPlan === "free" ? "€0" : userPlan === "pro" ? "€29" : "€59"}/mes
            </span>
          </div>
          {userPlan === "free" && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 space-y-2">
              <p className="text-xs text-foreground font-medium">🚀 Desbloquea reservas, fotos y multi-idioma con Pro</p>
              <Button variant="gradient" size="sm" onClick={() => { setUserPlan("pro"); toast.success("¡Plan actualizado a Pro!"); }}>
                Upgrade a Pro
              </Button>
            </div>
          )}
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm">Próxima factura</span>
            <span className="text-sm text-muted-foreground">15 abril 2026</span>
          </div>
          <Button variant="outline-primary" size="sm" onClick={() => toast.info("Gestión de suscripción (demo simulada)")}>Gestionar suscripción</Button>
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
        {role === "owner" && (
          <div className="bg-card rounded-2xl border border-border p-4 sm:p-6 space-y-4 sm:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold font-sans">👥 Equipo</h3>
              <span className="text-xs text-muted-foreground">{teamMembers.length} miembro{teamMembers.length === 1 ? "" : "s"}</span>
            </div>
            <div className="space-y-2">
              {teamMembers.map(m => (
                <div key={m.id} className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{m.name} {m.id === currentUser?.id && <span className="text-xs text-muted-foreground">(tú)</span>}</div>
                    <div className="text-xs text-muted-foreground truncate">{m.email}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {m.id === currentTenant?.ownerId ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">Propietario</span>
                    ) : (
                      <>
                        <select value={m.role} onChange={e => updateUserRole(m.id, e.target.value as any)}
                          className="text-xs px-2 py-1 rounded-md border border-border bg-secondary">
                          <option value="staff">Empleado</option>
                          <option value="owner">Co-propietario</option>
                        </select>
                        <button onClick={() => { if (confirm(`¿Eliminar a ${m.name}?`)) { removeUser(m.id); toast.success("Miembro eliminado"); } }}
                          className="p-1.5 hover:bg-secondary rounded-md text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleInvite} className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2 border-t border-border">
              <input className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm sm:col-span-1" placeholder="Nombre"
                value={inviteForm.name} onChange={e => setInviteForm(p => ({ ...p, name: e.target.value }))} />
              <input className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm sm:col-span-1" placeholder="Email" type="email"
                value={inviteForm.email} onChange={e => setInviteForm(p => ({ ...p, email: e.target.value }))} />
              <input className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm sm:col-span-1" placeholder="Contraseña" type="text"
                value={inviteForm.password} onChange={e => setInviteForm(p => ({ ...p, password: e.target.value }))} />
              <select className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm sm:col-span-1"
                value={inviteForm.role} onChange={e => setInviteForm(p => ({ ...p, role: e.target.value as any }))}>
                <option value="staff">Empleado</option>
                <option value="owner">Co-propietario</option>
              </select>
              <Button type="submit" variant="gradient" size="sm" className="sm:col-span-1">Añadir</Button>
            </form>
            <p className="text-xs text-muted-foreground">Los miembros podrán iniciar sesión con el email y contraseña que les asignes.</p>
          </div>
        )}
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
  const { isLoggedIn, logout, restaurant, userPlan, setUserPlan, appNotifications, markNotificationRead, markAllNotificationsRead, canAddDish, canAddCategory, role, currentUser } = useApp();
  const [active, setActive] = useState<Section>("restaurant");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const visibleSidebarItems = sidebarItems.filter(item => {
    if (item.id === "reservations" && restaurant.modules?.reservations === false) return false;
    if (item.id === "tables" && restaurant.modules?.tables === false) return false;
    return true;
  });

  useEffect(() => {
    if (!visibleSidebarItems.find(i => i.id === active)) setActive("restaurant");
  }, [visibleSidebarItems, active]);

  const ActiveSection = sections[active];

  const unreadCount = appNotifications.filter(n => !n.read).length;

  // Auth is now handled by ProtectedRoute in App.tsx

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
          {visibleSidebarItems.map(item => (
            <button key={item.id} onClick={() => { setActive(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${active === item.id ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-4 left-3 right-3 px-3 flex items-center gap-2 flex-wrap">
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase">{userPlan}</span>
          {role && (
            <span className="bg-secondary text-muted-foreground text-xs font-medium px-2 py-1 rounded-full">
              {role === "owner" ? "Propietario" : role === "staff" ? "Empleado" : "Admin"}
            </span>
          )}
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
            <div className="relative">
              <button className="relative p-2 hover:bg-secondary rounded-lg" onClick={() => setNotifOpen(!notifOpen)}>
                <Bell className="h-4 w-4 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">{unreadCount > 9 ? "9+" : unreadCount}</span>
                )}
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 z-50 w-80 bg-card rounded-2xl border border-border shadow-warm-lg overflow-hidden">
                    <div className="flex items-center justify-between p-3 border-b border-border">
                      <h4 className="text-sm font-bold">Notificaciones</h4>
                      {unreadCount > 0 && (
                        <button onClick={() => markAllNotificationsRead()} className="text-xs text-primary hover:underline">Marcar todas leídas</button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {appNotifications.length === 0 ? (
                        <p className="p-4 text-sm text-muted-foreground text-center">No hay notificaciones</p>
                      ) : (
                        appNotifications.slice(0, 15).map(n => (
                          <button key={n.id} onClick={() => markNotificationRead(n.id)}
                            className={`w-full text-left p-3 border-b border-border last:border-0 hover:bg-secondary/50 transition-colors ${!n.read ? 'bg-primary/5' : ''}`}>
                            <div className="flex items-start gap-2">
                              {!n.read && <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium">{n.title}</div>
                                <div className="text-xs text-muted-foreground line-clamp-2">{n.message}</div>
                                <div className="text-[10px] text-muted-foreground mt-0.5">{new Date(n.date).toLocaleDateString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <button onClick={() => { logout(); toast.success("Sesión cerrada"); }} className="p-2 hover:bg-secondary rounded-lg" title="Cerrar sesión">
              <LogOut className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-primary" />
          </div>
        </header>

        {/* Plan limits banner */}
        {userPlan === "free" && (
          <div className="bg-primary/5 border-b border-primary/20 px-4 py-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <span>Plan Free: reservas, fotos y multi-idioma no disponibles.</span>
            </div>
            <Button variant="gradient" size="sm" className="text-xs shrink-0" onClick={() => { setUserPlan("pro"); toast.success("¡Plan actualizado a Pro!"); }}>Upgrade</Button>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 overflow-auto pb-20 md:pb-6">
          <ActiveSection />
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-card border-t border-border md:hidden safe-area-bottom">
        <div className="flex justify-around items-center h-14">
          {visibleSidebarItems.slice(0, 5).map(item => (
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
