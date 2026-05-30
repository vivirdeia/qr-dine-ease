import { motion } from "framer-motion";
import { Book, CalendarCheck, LayoutGrid, BarChart3, Settings, Bell } from "lucide-react";
import { dishImages } from "@/data/dishImages";

const navItems = [
  { icon: Book, label: "Carta", active: true },
  { icon: CalendarCheck, label: "Reservas" },
  { icon: LayoutGrid, label: "Mesas" },
  { icon: BarChart3, label: "Métricas" },
  { icon: Settings, label: "Ajustes" },
];

const dishes = [
  { id: "d1", name: "Croquetas de jamón", price: "8,50€" },
  { id: "d2", name: "Pulpo a la brasa", price: "18,00€" },
  { id: "d8", name: "Arroz con bogavante", price: "24,00€" },
  { id: "d11", name: "Solomillo ibérico", price: "22,50€" },
];

export const DashboardMockup = () => (
  <div className="relative w-full max-w-[28rem] h-96 rounded-2xl shadow-warm-lg overflow-hidden border border-border bg-card">
    {/* Window chrome */}
    <div className="h-7 bg-secondary border-b border-border flex items-center gap-1.5 px-3">
      <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
      <div className="h-2.5 w-2.5 rounded-full bg-warning/60" />
      <div className="h-2.5 w-2.5 rounded-full bg-success/60" />
      <div className="flex-1 text-center text-[10px] text-muted-foreground font-mono">carta.app/dashboard</div>
    </div>
    <div className="flex h-[calc(100%-1.75rem)]">
      {/* Sidebar */}
      <aside className="w-28 border-r border-border bg-background/50 p-2 space-y-1">
        <div className="px-2 py-2 mb-1 font-serif font-bold text-xs">CARTA</div>
        {navItems.map((n, i) => (
          <div
            key={i}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] ${n.active ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground"}`}
          >
            <n.icon className="h-3 w-3" strokeWidth={1.5} />
            {n.label}
          </div>
        ))}
      </aside>
      {/* Main */}
      <main className="flex-1 p-3 overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[10px] text-muted-foreground">Restaurante</div>
            <div className="text-sm font-bold">Casa Martín</div>
          </div>
          <div className="flex items-center gap-1.5">
            <Bell className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
            <div className="w-6 h-6 rounded-full bg-gradient-primary" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {dishes.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              <img src={dishImages[d.id]} alt="" className="h-12 w-full object-cover" />
              <div className="p-1.5">
                <div className="text-[10px] font-medium truncate">{d.name}</div>
                <div className="text-[10px] text-primary font-bold">{d.price}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
    {/* Floating reservation toast */}
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      className="absolute bottom-3 right-3 bg-card border border-border rounded-xl shadow-warm-lg p-3 w-48 animate-pulse-soft"
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-success/15 flex items-center justify-center">
          <CalendarCheck className="h-3.5 w-3.5 text-success" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold">Nueva reserva</div>
          <div className="text-[9px] text-muted-foreground truncate">Pedro · 4 pax · 21:30</div>
        </div>
      </div>
    </motion.div>
  </div>
);
