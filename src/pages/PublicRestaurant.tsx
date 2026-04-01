import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { ALLERGENS } from "@/data/mockData";
import { heroRestaurant, dishImages } from "@/data/dishImages";
import { getWineImage } from "@/data/wineImages";
import { t, type Lang } from "@/data/translations";
import { toast } from "sonner";
import {
  Clock, MapPin, Phone, Instagram, Share2, Search, ChevronRight,
  Globe, Check, UtensilsCrossed, CalendarCheck, ArrowLeft, Users, X,
} from "lucide-react";

const PublicRestaurant = () => {
  const { restaurant, categories, dishes, wines, dailyMenu, addReservation } = useApp();
  const [activeCategory, setActiveCategory] = useState("menu-del-dia");
  const [searchQuery, setSearchQuery] = useState("");
  const [dietaryFilter, setDietaryFilter] = useState<string[]>([]);
  const [showReservation, setShowReservation] = useState(false);
  const [lang, setLang] = useState<Lang>("ES");
  const [reservationStep, setReservationStep] = useState(0);
  const [resData, setResData] = useState({ guests: 2, date: "", period: "", time: "", name: "", phone: "", email: "", notes: "", zone: "Sin preferencia" });
  const [wineFilter, setWineFilter] = useState("Todos");
  const [customGuests, setCustomGuests] = useState(false);

  const isOpen = () => {
    const now = new Date();
    const day = now.getDay();
    const dayMap = [6, 0, 1, 2, 3, 4, 5];
    const h = restaurant.hours[dayMap[day]];
    return !h?.closed;
  };

  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Apply brand colors
  useEffect(() => {
    const colors = restaurant.brandColors;
    if (!colors) return;
    const root = document.documentElement;
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
    const origPrimary = getComputedStyle(root).getPropertyValue('--primary').trim();
    const origGold = getComputedStyle(root).getPropertyValue('--gold').trim();
    const origBg = getComputedStyle(root).getPropertyValue('--background').trim();
    root.style.setProperty('--primary', hexToHsl(colors.primary));
    root.style.setProperty('--gold', hexToHsl(colors.accent));
    root.style.setProperty('--background', hexToHsl(colors.background));
    return () => {
      root.style.setProperty('--primary', origPrimary);
      root.style.setProperty('--gold', origGold);
      root.style.setProperty('--background', origBg);
    };
  }, [restaurant.brandColors]);

  // Inject tracking scripts
  useEffect(() => {
    const t = restaurant.tracking;
    if (!t) return;
    const scripts: HTMLScriptElement[] = [];
    if (t.googleAnalyticsId) {
      const s1 = document.createElement('script');
      s1.src = `https://www.googletagmanager.com/gtag/js?id=${t.googleAnalyticsId}`;
      s1.async = true;
      document.head.appendChild(s1);
      scripts.push(s1);
      const s2 = document.createElement('script');
      s2.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${t.googleAnalyticsId}');`;
      document.head.appendChild(s2);
      scripts.push(s2);
    }
    if (t.metaPixelId) {
      const s = document.createElement('script');
      s.textContent = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${t.metaPixelId}');fbq('track','PageView');`;
      document.head.appendChild(s);
      scripts.push(s);
    }
    return () => { scripts.forEach(s => s.remove()); };
  }, [restaurant.tracking]);

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    const el = categoryRefs.current[catId];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filteredDishes = dishes.filter(d => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q);
    }
    if (dietaryFilter.includes("vegetarian") && !d.dietary.includes("vegetarian")) return false;
    if (dietaryFilter.includes("vegan") && !d.dietary.includes("vegan")) return false;
    if (dietaryFilter.includes("gluten-free") && d.allergens.includes("gluten")) return false;
    return true;
  });

  const toggleDietary = (f: string) => setDietaryFilter(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  return (
    <div className="min-h-screen bg-background pb-24 max-w-lg mx-auto relative">
      {/* Header */}
      <div className="relative h-56">
        <img src={heroRestaurant} alt={restaurant.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <select value={lang} onChange={e => setLang(e.target.value)} className="text-xs text-white bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg px-2 py-1">
            <option>ES</option><option>EN</option><option>FR</option><option>CA</option>
          </select>
          <button className="p-2 bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg text-white" onClick={async () => {
            const shareData = { title: restaurant.name, text: `${restaurant.name} — ${restaurant.subtitle}`, url: window.location.href };
            if (navigator.share) { try { await navigator.share(shareData); } catch {} }
            else { await navigator.clipboard.writeText(window.location.href); toast.success("Enlace copiado al portapapeles"); }
          }}><Share2 className="h-4 w-4" /></button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">{restaurant.name}</h1>
          <p className="text-sm text-white/70 mt-0.5">{restaurant.subtitle}</p>
          <span className={`mt-2 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${isOpen() ? 'bg-green-500/20 text-green-300 border border-green-400/30' : 'bg-red-500/20 text-red-300 border border-red-400/30'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOpen() ? 'bg-green-400' : 'bg-red-400'}`} />
            {isOpen() ? t(lang, "menu.open") : t(lang, "menu.closed")}
          </span>
        </div>
      </div>

      {/* Info card */}
      <div className="px-4 mt-4">
        <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>{t(lang, "menu.today")}: {(() => {
              const d = new Date().getDay();
              const dayMap = [6, 0, 1, 2, 3, 4, 5];
              const h = restaurant.hours[dayMap[d]];
              if (h?.closed) return t(lang, "menu.closed");
              if (h?.continuous) return `${h.morning?.open} - ${h.morning?.close} (${t(lang, "menu.continuous")})`;
              return `${h?.morning?.open}-${h?.morning?.close}${h?.evening ? ` / ${h.evening.open}-${h.evening.close}` : ''}`;
            })()}</span>
          </div>
          <a href={`https://maps.google.com/?q=${restaurant.lat},${restaurant.lng}`} target="_blank" rel="noopener" className="flex items-center gap-2 text-sm text-primary">
            <MapPin className="h-4 w-4 shrink-0" />{restaurant.address}
          </a>
          <a href={`tel:${restaurant.phone}`} className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />{restaurant.phone}
          </a>
          <div className="flex flex-wrap gap-2">
            {Object.entries(restaurant.services).filter(([,v]) => v).slice(0, 6).map(([k]) => {
              const labels: Record<string, string> = { terraza: "Terraza", parking: "Parking", wifi: "WiFi", accessible: "Accesible", card: "Tarjeta", pets: "Mascotas" };
              return labels[k] ? <span key={k} className="text-xs bg-secondary px-2 py-1 rounded-full">{labels[k]}</span> : null;
            })}
          </div>
        </div>
      </div>

      {/* Category nav */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border mt-6">
        <div className="px-4 py-2">
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t(lang, "menu.search")}
              className="w-full pl-9 pr-3 py-2 bg-secondary border border-border rounded-xl text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => scrollToCategory("menu-del-dia")}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === "menu-del-dia" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
            >
              📌 {t(lang, "menu.daily")}
            </button>
            {categories.filter(c => c.id !== "c0" && c.visible).map(cat => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
            <button
              onClick={() => scrollToCategory("vinos")}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === "vinos" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
            >
              🍷 Vinos
            </button>
          </div>
          <div className="flex gap-2 pb-1">
            {[
              { id: "vegetarian", label: "🌿 Vegetariano" },
              { id: "vegan", label: "🌱 Vegano" },
              { id: "gluten-free", label: "Sin gluten" },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => toggleDietary(f.id)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs transition-colors ${dietaryFilter.includes(f.id) ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground border border-border"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu sections */}
      <div className="px-4 mt-4 space-y-8">
        {/* Daily menu */}
        {dailyMenu.visible && !searchQuery && (
          <div ref={el => { categoryRefs.current["menu-del-dia"] = el; }}>
            <div className="bg-primary/5 rounded-2xl border border-primary/20 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">📌 Menú del día</h2>
                <span className="text-xl font-bold text-primary">€{dailyMenu.price.toFixed(2)}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2"><span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">1º</span><span className="text-sm">{dailyMenu.starter}</span></div>
                <div className="flex items-start gap-2"><span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">2º</span><span className="text-sm">{dailyMenu.main}</span></div>
                <div className="flex items-start gap-2"><span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded font-medium">🍰</span><span className="text-sm">{dailyMenu.dessert}</span></div>
              </div>
              <p className="text-xs text-muted-foreground">{dailyMenu.includes}</p>
              <p className="text-xs text-muted-foreground">{dailyMenu.schedule}</p>
            </div>
          </div>
        )}

        {/* Dish categories */}
        {categories.filter(c => c.id !== "c0" && c.visible).map(cat => {
          const catDishes = filteredDishes.filter(d => d.categoryId === cat.id);
          if (catDishes.length === 0 && searchQuery) return null;
          return (
            <div key={cat.id} ref={el => { categoryRefs.current[cat.id] = el; }}>
              <h2 className="text-xl font-bold mb-4">{cat.icon} {cat.name}</h2>
              <div className="space-y-3">
                {(searchQuery ? catDishes : dishes.filter(d => d.categoryId === cat.id)).map(dish => (
                  <div key={dish.id} className={`flex gap-3 ${!dish.available ? 'opacity-50' : ''}`}>
                    {(dish.photoUrl || dishImages[dish.id]) ? (
                      <img src={dish.photoUrl || dishImages[dish.id]} alt={dish.name} className="w-20 h-20 rounded-xl object-cover shrink-0" loading="lazy" />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/10 to-gold/10 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-medium text-sm">{dish.name}</span>
                            {dish.isNew && <span className="bg-gold text-gold-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">Nuevo</span>}
                            {!dish.available && <span className="bg-muted text-muted-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">Agotado</span>}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{dish.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`font-bold text-sm ${!dish.available ? 'line-through text-muted-foreground' : 'text-primary'}`}>€{dish.price.toFixed(2)}</span>
                          {dish.oldPrice && <span className="block text-xs text-muted-foreground line-through">€{dish.oldPrice.toFixed(2)}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        {dish.dietary.includes("vegetarian") && <span className="text-xs">🌿</span>}
                        {dish.dietary.includes("vegan") && <span className="text-xs">🌱</span>}
                        {dish.dietary.includes("spicy") && <span className="text-xs">🔥</span>}
                        {dish.allergens.slice(0, 3).map(a => {
                          const al = ALLERGENS.find(x => x.id === a);
                          return al ? <span key={a} className="text-[10px]" title={al.name}>{al.emoji}</span> : null;
                        })}
                      </div>
                      {dish.chefNote && <p className="text-xs text-primary/70 italic mt-1">👨‍🍳 {dish.chefNote}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Wines */}
        <div ref={el => { categoryRefs.current["vinos"] = el; }}>
          <h2 className="text-xl font-bold mb-4">🍷 Carta de vinos</h2>
          <div className="flex gap-2 overflow-x-auto pb-3">
            {["Todos", "Tintos", "Blancos", "Rosados", "Espumosos", "Dulces"].map(t => (
              <button key={t} onClick={() => setWineFilter(t)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs transition-colors ${wineFilter === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {wines.filter(w => {
              if (wineFilter === "Todos") return true;
              const map: Record<string, string> = { Tintos: "tinto", Blancos: "blanco", Rosados: "rosado", Espumosos: "espumoso", Dulces: "dulce" };
              return w.type === map[wineFilter];
            }).map(wine => (
              <div key={wine.id} className="flex gap-3 bg-card rounded-xl border border-border p-3">
                <img src={getWineImage(wine.id, wine.type)} alt={wine.name} loading="lazy" className="w-10 h-14 rounded object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{wine.name} {wine.year && <span className="text-muted-foreground">{wine.year}</span>}</div>
                  <div className="text-xs text-muted-foreground">{wine.region} · {wine.grape}</div>
                  {wine.description && <div className="text-xs text-muted-foreground mt-0.5">{wine.description}</div>}
                </div>
                <div className="text-right shrink-0 text-sm">
                  {wine.priceGlass && <div className="text-muted-foreground text-xs">Copa €{wine.priceGlass.toFixed(2)}</div>}
                  <div className="font-bold text-primary">€{wine.priceBottle.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 italic">Pregunta al camarero por las sugerencias de maridaje</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 px-4 pb-8 border-t border-border pt-6 space-y-3">
        <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" />{restaurant.address}</div>
        <div className="text-xs text-muted-foreground space-y-1">
          {restaurant.hours.map((h, i) => (
            <div key={i} className="flex gap-2">
              <span className="w-20">{h.day}</span>
              {h.closed ? <span>Cerrado</span> : <span>{h.morning?.open}-{h.morning?.close}{h.evening && !h.continuous ? ` / ${h.evening.open}-${h.evening.close}` : ''}{h.continuous ? ' (continuo)' : ''}</span>}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <a href={`tel:${restaurant.phone}`} className="flex items-center gap-1"><Phone className="h-4 w-4" />{restaurant.phone}</a>
          <span className="text-muted-foreground">{restaurant.instagram}</span>
        </div>
        <p className="text-xs text-muted-foreground pt-2">Powered by <Link to="/" className="text-primary font-medium">Carta</Link></p>
        <p className="text-[10px] text-muted-foreground">Todos nuestros platos se elaboran con producto fresco. Consulta alérgenos con el personal.</p>
      </div>

      {/* Floating reserve button */}
      {!showReservation && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-lg w-full px-4">
          <Button variant="gradient" size="xl" className="w-full shadow-warm-lg" onClick={() => { setShowReservation(true); setReservationStep(0); }}>
            <CalendarCheck className="mr-2 h-5 w-5" /> Reservar mesa
          </Button>
        </div>
      )}

      {/* Reservation flow */}
      {showReservation && (
        <div className="fixed inset-0 z-50 bg-foreground/40 flex items-end md:items-center justify-center" onClick={() => setShowReservation(false)}>
          <div className="bg-card w-full max-w-lg rounded-t-3xl md:rounded-3xl p-6 max-h-[85vh] overflow-y-auto space-y-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">
                {reservationStep === 0 && "Reservar mesa"}
                {reservationStep === 1 && "Elige hora"}
                {reservationStep === 2 && "Tus datos"}
                {reservationStep === 3 && "¡Reserva confirmada!"}
              </h3>
              <button onClick={() => setShowReservation(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
            </div>

            {reservationStep === 0 && (
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">¿Cuántos sois?</label>
                  <div className="flex gap-2 flex-wrap">
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <button key={n} onClick={() => { setResData(d => ({...d, guests: n})); setCustomGuests(false); }}
                        className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${resData.guests === n && !customGuests ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                        {n}
                      </button>
                    ))}
                    <button onClick={() => { setCustomGuests(true); setResData(d => ({...d, guests: 9})); }}
                      className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${customGuests ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>9+</button>
                  </div>
                  {customGuests && (
                    <div className="mt-2 flex items-center gap-2">
                      <input type="number" min={9} max={30} value={resData.guests} onChange={e => setResData(d => ({...d, guests: parseInt(e.target.value) || 9}))}
                        className="w-20 px-3 py-2 bg-secondary border border-border rounded-xl text-sm" />
                      <span className="text-xs text-muted-foreground">personas</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">¿Qué día?</label>
                  <input type="date" value={resData.date} onChange={e => setResData(d => ({...d, date: e.target.value}))}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-xl text-sm" min={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">¿Mediodía o noche?</label>
                  <div className="flex gap-2">
                    {[{id: "lunch", label: "Mediodía (13:00-16:00)"}, {id: "dinner", label: "Noche (20:30-23:30)"}].map(p => (
                      <button key={p.id} onClick={() => setResData(d => ({...d, period: p.id}))}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${resData.period === p.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <Button variant="gradient" size="lg" className="w-full" disabled={!resData.date || !resData.period}
                  onClick={() => setReservationStep(1)}>
                  Ver disponibilidad <ChevronRight className="ml-1" />
                </Button>
              </div>
            )}

            {reservationStep === 1 && (
              <div className="space-y-6">
                <label className="text-sm font-medium mb-2 block">Hora disponible</label>
                <div className="grid grid-cols-3 gap-2">
                  {(resData.period === "lunch" ? ["13:00","13:30","14:00","14:30","15:00"] : ["20:30","21:00","21:30","22:00"]).map(t => (
                    <button key={t} onClick={() => setResData(d => ({...d, time: t}))}
                      className={`py-3 rounded-xl text-sm font-medium transition-colors ${resData.time === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}>
                      {t}
                    </button>
                  ))}
                  <button disabled className="py-3 rounded-xl text-sm bg-muted text-muted-foreground/40 cursor-not-allowed">
                    {resData.period === "lunch" ? "15:30" : "22:30"}
                    <span className="block text-[10px]">Completo</span>
                  </button>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline-primary" onClick={() => setReservationStep(0)}><ArrowLeft className="h-4 w-4" /></Button>
                  <Button variant="gradient" size="lg" className="flex-1" disabled={!resData.time} onClick={() => setReservationStep(2)}>
                    Continuar <ChevronRight className="ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {reservationStep === 2 && (
              <div className="space-y-4">
                <div><label className="text-xs font-medium text-muted-foreground">Nombre *</label><input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-xl text-sm" value={resData.name} onChange={e => setResData(d => ({...d, name: e.target.value}))} /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Teléfono *</label><input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-xl text-sm" value={resData.phone} onChange={e => setResData(d => ({...d, phone: e.target.value}))} /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Email</label><input className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-xl text-sm" value={resData.email} onChange={e => setResData(d => ({...d, email: e.target.value}))} /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Notas</label><textarea className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-xl text-sm" rows={2} placeholder="Ej: Cumpleaños, alergias, silla de bebé..." value={resData.notes} onChange={e => setResData(d => ({...d, notes: e.target.value}))} /></div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Preferencia de zona</label>
                  <div className="flex gap-2">
                    {["Interior", "Terraza", "Sin preferencia"].map(z => (
                      <button key={z} onClick={() => setResData(d => ({...d, zone: z}))}
                        className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${resData.zone === z ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                        {z}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline-primary" onClick={() => setReservationStep(1)}><ArrowLeft className="h-4 w-4" /></Button>
                    <Button variant="gradient" size="lg" className="flex-1" disabled={!resData.name || !resData.phone} onClick={() => {
                      addReservation({
                        name: resData.name,
                        phone: resData.phone,
                        email: resData.email || undefined,
                        date: resData.date,
                        time: resData.time,
                        guests: resData.guests,
                        zonePreference: resData.zone,
                        notes: resData.notes || undefined,
                        status: "pending",
                        source: "digital",
                      });
                      toast.success("¡Reserva enviada!");
                      setReservationStep(3);
                    }}>
                    Confirmar reserva
                  </Button>
                </div>
              </div>
            )}

            {reservationStep === 3 && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                  <Check className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-xl font-bold">¡Reserva confirmada!</h3>
                <div className="bg-secondary rounded-xl p-4 text-sm space-y-2 text-left">
                  <div className="flex justify-between"><span className="text-muted-foreground">Nombre</span><span className="font-medium">{resData.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Fecha</span><span className="font-medium">{resData.date && new Date(resData.date).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Hora</span><span className="font-medium">{resData.time}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Personas</span><span className="font-medium">{resData.guests}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Zona</span><span className="font-medium">{resData.zone}</span></div>
                </div>
                <p className="text-xs text-muted-foreground">Te enviaremos la confirmación por WhatsApp al {resData.phone}</p>
                <div className="flex gap-3">
                  <Button variant="outline-primary" className="flex-1" onClick={() => {
                    const dtStart = resData.date.replace(/-/g, '') + 'T' + resData.time.replace(':', '') + '00';
                    const [h, m] = resData.time.split(':').map(Number);
                    const endH = String(h + 2).padStart(2, '0');
                    const dtEnd = resData.date.replace(/-/g, '') + 'T' + endH + String(m).padStart(2, '0') + '00';
                    const ics = [
                      'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
                      `DTSTART:${dtStart}`, `DTEND:${dtEnd}`,
                      `SUMMARY:Reserva en ${restaurant.name}`,
                      `DESCRIPTION:${resData.guests} personas - ${resData.zone}`,
                      `LOCATION:${restaurant.address}`,
                      'END:VEVENT', 'END:VCALENDAR'
                    ].join('\r\n');
                    const blob = new Blob([ics], { type: 'text/calendar' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a'); a.href = url; a.download = 'reserva.ics'; a.click();
                    URL.revokeObjectURL(url);
                    toast.success("Archivo de calendario descargado");
                  }}>Añadir al calendario</Button>
                  <Button variant="gradient" className="flex-1" onClick={() => setShowReservation(false)}>Volver a la carta</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicRestaurant;