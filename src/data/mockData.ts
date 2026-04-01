export interface BrandColors {
  primary: string;
  accent: string;
  background: string;
}

export interface TrackingConfig {
  googleAnalyticsId?: string;
  metaPixelId?: string;
  customHeadScript?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  category: string;
  cuisine: string[];
  description: string;
  phone: string;
  email: string;
  web: string;
  instagram: string;
  address: string;
  lat: number;
  lng: number;
  hours: DayHours[];
  services: Record<string, boolean>;
  plan: "free" | "pro" | "business";
  brandColors?: BrandColors;
  tracking?: TrackingConfig;
}

export interface DayHours {
  day: string;
  closed: boolean;
  continuous: boolean;
  morning?: { open: string; close: string };
  evening?: { open: string; close: string };
  note?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  position: number;
  visible: boolean;
  dishCount: number;
}

export interface Dish {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  photoUrl?: string;
  allergens: string[];
  dietary: string[];
  chefNote?: string;
  available: boolean;
  isNew: boolean;
  position: number;
}

export interface Wine {
  id: string;
  name: string;
  year?: number;
  region: string;
  grape: string;
  type: "tinto" | "blanco" | "rosado" | "espumoso" | "dulce";
  priceGlass?: number;
  priceBottle: number;
  description?: string;
  position: number;
}

export interface Table {
  id: string;
  number: string;
  capacity: number;
  zone: "Interior" | "Terraza" | "Barra" | "Privado";
  combinable: boolean;
  status: "free" | "reserved" | "occupied" | "out-of-service";
  reservedBy?: string;
  reservedTime?: string;
}

export interface Reservation {
  id: string;
  tableId?: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  zonePreference?: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "noshow";
  source: "digital" | "manual" | "phone";
  createdAt: string;
}

export interface DailyMenu {
  id: string;
  starter: string;
  main: string;
  dessert: string;
  price: number;
  includes: string;
  schedule: string;
  visible: boolean;
}

export const ALLERGENS = [
  { id: "gluten", name: "Gluten", emoji: "🌾" },
  { id: "crustaceans", name: "Crustáceos", emoji: "🦐" },
  { id: "eggs", name: "Huevos", emoji: "🥚" },
  { id: "fish", name: "Pescado", emoji: "🐟" },
  { id: "peanuts", name: "Cacahuetes", emoji: "🥜" },
  { id: "soy", name: "Soja", emoji: "🫘" },
  { id: "dairy", name: "Lácteos", emoji: "🥛" },
  { id: "nuts", name: "Frutos secos", emoji: "🌰" },
  { id: "celery", name: "Apio", emoji: "🥬" },
  { id: "mustard", name: "Mostaza", emoji: "🟡" },
  { id: "sesame", name: "Sésamo", emoji: "⚪" },
  { id: "sulfites", name: "Sulfitos", emoji: "🍷" },
  { id: "lupin", name: "Altramuces", emoji: "🌸" },
  { id: "mollusks", name: "Moluscos", emoji: "🐚" },
];

export const restaurant: Restaurant = {
  id: "r1",
  name: "Casa Martín",
  slug: "casa-martin",
  subtitle: "Cocina mediterránea desde 1998",
  category: "Restaurante",
  cuisine: ["Mediterránea", "Española"],
  description: "Restaurante de barrio con cocina mediterránea de producto. Carnes a la brasa, arroces, pescado fresco del día. Terraza en verano.",
  phone: "+34 912 345 678",
  email: "info@casamartin.es",
  web: "https://casamartin.es",
  instagram: "@casamartin",
  address: "Calle de la Cava Baja 18, Madrid",
  lat: 40.4128,
  lng: -3.7076,
  hours: [
    { day: "Lunes", closed: true, continuous: false },
    { day: "Martes", closed: false, continuous: false, morning: { open: "13:00", close: "16:00" }, evening: { open: "20:30", close: "23:30" } },
    { day: "Miércoles", closed: false, continuous: false, morning: { open: "13:00", close: "16:00" }, evening: { open: "20:30", close: "23:30" } },
    { day: "Jueves", closed: false, continuous: false, morning: { open: "13:00", close: "16:00" }, evening: { open: "20:30", close: "23:30" } },
    { day: "Viernes", closed: false, continuous: false, morning: { open: "13:00", close: "16:00" }, evening: { open: "20:30", close: "23:30" } },
    { day: "Sábado", closed: false, continuous: true, morning: { open: "13:00", close: "23:30" } },
    { day: "Domingo", closed: false, continuous: false, morning: { open: "13:00", close: "16:00" } },
  ],
  services: {
    terraza: true, parking: true, accessible: true, pets: true, reservations: true,
    groups: true, wifi: true, card: true, menuDelDia: true, menuInfantil: false,
    takeaway: false, delivery: false,
  },
  plan: "pro",
};

export const categories: Category[] = [
  { id: "c0", name: "Menú del día", icon: "📌", position: 0, visible: true, dishCount: 0 },
  { id: "c1", name: "Entrantes", icon: "🍽️", position: 1, visible: true, dishCount: 4 },
  { id: "c2", name: "Ensaladas", icon: "🥗", position: 2, visible: true, dishCount: 3 },
  { id: "c3", name: "Arroces", icon: "🥘", position: 3, visible: true, dishCount: 3 },
  { id: "c4", name: "Carnes", icon: "🥩", position: 4, visible: true, dishCount: 3 },
  { id: "c5", name: "Pescados", icon: "🐟", position: 5, visible: true, dishCount: 3 },
  { id: "c6", name: "Postres", icon: "🍰", position: 6, visible: true, dishCount: 4 },
  { id: "c7", name: "Bebidas", icon: "🥤", position: 7, visible: true, dishCount: 5 },
];

export const dishes: Dish[] = [
  // Entrantes
  { id: "d1", categoryId: "c1", name: "Croquetas caseras de jamón ibérico (8 uds)", description: "Crujientes por fuera, cremosas por dentro", price: 9.50, allergens: ["gluten", "dairy", "eggs"], dietary: [], available: true, isNew: false, position: 1 },
  { id: "d2", categoryId: "c1", name: "Pulpo a la gallega", description: "Sobre cama de patata cachela con pimentón de la Vera", price: 14.00, allergens: ["mollusks"], dietary: ["spicy"], available: true, isNew: false, position: 2 },
  { id: "d3", categoryId: "c1", name: "Hummus de remolacha con crudités", description: "Hummus artesanal con bastones de verdura de temporada", price: 8.00, allergens: ["sesame"], dietary: ["vegan"], available: true, isNew: false, position: 3 },
  { id: "d4", categoryId: "c1", name: "Jamón ibérico de bellota cortado a mano", description: "36 meses de curación, cortado al momento", price: 22.00, allergens: [], dietary: [], available: true, isNew: false, position: 4 },
  // Ensaladas
  { id: "d5", categoryId: "c2", name: "Ensalada de tomate rosa, burrata y albahaca", description: "Tomate rosa de Barbastro con burrata fresca", price: 12.50, allergens: ["dairy"], dietary: ["vegetarian"], available: true, isNew: false, position: 1 },
  { id: "d6", categoryId: "c2", name: "César con pollo a la brasa", description: "Lechuga romana, parmesano, croutons y salsa César casera", price: 11.50, allergens: ["gluten", "dairy", "eggs", "fish"], dietary: [], available: true, isNew: false, position: 2 },
  { id: "d7", categoryId: "c2", name: "Ensalada templada de salmón y aguacate", description: "Salmón marinado, aguacate, mango y vinagreta cítrica", price: 13.00, allergens: ["fish"], dietary: [], available: true, isNew: false, position: 3 },
  // Arroces
  { id: "d8", categoryId: "c3", name: "Arroz meloso de bogavante", description: "Arroz bomba con bogavante fresco y fumé de marisco", price: 18.00, allergens: ["crustaceans", "fish"], dietary: [], chefNote: "Mínimo 2 personas", available: true, isNew: false, position: 1 },
  { id: "d9", categoryId: "c3", name: "Paella de verduras de temporada", description: "Arroz bomba con verduras frescas de la huerta", price: 14.00, allergens: ["celery"], dietary: ["vegetarian"], chefNote: "Mínimo 2 personas", available: true, isNew: false, position: 2 },
  { id: "d10", categoryId: "c3", name: "Arroz negro con alioli de ajo asado", description: "Arroz con tinta de calamar y alioli suave", price: 16.00, allergens: ["mollusks", "eggs"], dietary: [], available: true, isNew: false, position: 3 },
  // Carnes
  { id: "d11", categoryId: "c4", name: "Solomillo de ternera con reducción de Pedro Ximénez", description: "Ternera nacional con reducción dulce y patata trufada", price: 22.00, allergens: ["sulfites", "dairy"], dietary: [], available: true, isNew: false, position: 1 },
  { id: "d12", categoryId: "c4", name: "Secreto ibérico a la brasa", description: "Pieza ibérica a la brasa con pimientos de Padrón", price: 18.00, allergens: [], dietary: [], available: true, isNew: false, position: 2 },
  { id: "d13", categoryId: "c4", name: "Pollo de corral al horno con hierbas", description: "Medio pollo de corral con romero, tomillo y limón", price: 15.00, allergens: [], dietary: [], available: true, isNew: false, position: 3 },
  // Pescados
  { id: "d14", categoryId: "c5", name: "Lubina a la espalda", description: "Lubina salvaje al horno con verduras confitadas", price: 19.00, allergens: ["fish"], dietary: [], available: true, isNew: false, position: 1 },
  { id: "d15", categoryId: "c5", name: "Bacalao confitado a baja temperatura", description: "Lomo de bacalao con pilpil ligero y espuma de ajo", price: 17.50, allergens: ["fish", "dairy"], dietary: [], available: true, isNew: false, position: 2 },
  { id: "d16", categoryId: "c5", name: "Gambas al ajillo", description: "Gambas frescas con ajo, guindilla y aceite de oliva", price: 16.00, allergens: ["crustaceans"], dietary: ["spicy"], available: true, isNew: false, position: 3 },
  // Postres
  { id: "d17", categoryId: "c6", name: "Tarta de queso casera", description: "Nuestra famosa tarta de queso con mermelada de frutos rojos", price: 6.50, allergens: ["dairy", "eggs", "gluten"], dietary: ["vegetarian"], available: true, isNew: true, position: 1 },
  { id: "d18", categoryId: "c6", name: "Tiramisú de café y amaretto", description: "Receta clásica italiana con mascarpone y bizcocho", price: 7.00, allergens: ["dairy", "eggs", "gluten", "nuts"], dietary: ["vegetarian"], available: true, isNew: false, position: 2 },
  { id: "d19", categoryId: "c6", name: "Crema catalana", description: "Crema con canela y cítricos, caramelizada al momento", price: 6.00, allergens: ["dairy", "eggs"], dietary: ["vegetarian"], available: true, isNew: false, position: 3 },
  { id: "d20", categoryId: "c6", name: "Sorbete de limón al cava", description: "Sorbete artesanal refrescante con un toque de cava", price: 5.50, allergens: ["sulfites"], dietary: ["vegan"], available: true, isNew: false, position: 4 },
  // Bebidas
  { id: "d21", categoryId: "c7", name: "Vino tinto de la casa (copa)", description: "Tempranillo joven D.O. La Mancha", price: 3.50, allergens: ["sulfites"], dietary: [], available: true, isNew: false, position: 1 },
  { id: "d22", categoryId: "c7", name: "Cerveza artesana del día", description: "Pregunta al camarero por la selección del día", price: 4.00, allergens: ["gluten"], dietary: [], available: true, isNew: false, position: 2 },
  { id: "d23", categoryId: "c7", name: "Agua mineral 750ml", description: "Natural o con gas", price: 2.50, allergens: [], dietary: [], available: true, isNew: false, position: 3 },
  { id: "d24", categoryId: "c7", name: "Refrescos", description: "Coca-Cola, Fanta, Aquarius, tónica", price: 2.80, allergens: [], dietary: [], available: true, isNew: false, position: 4 },
  { id: "d25", categoryId: "c7", name: "Café / Cortado / Infusión", description: "Café de especialidad tostado en Madrid", price: 1.80, allergens: ["dairy"], dietary: [], available: true, isNew: false, position: 5 },
];

export const wines: Wine[] = [
  { id: "w1", name: "Protos Crianza", year: 2020, region: "Ribera del Duero", grape: "Tempranillo", type: "tinto", priceGlass: 4.50, priceBottle: 22, description: "Elegante, con notas de fruta madura y roble", position: 1 },
  { id: "w2", name: "Marqués de Cáceres Reserva", year: 2018, region: "Rioja", grape: "Tempranillo, Garnacha", type: "tinto", priceGlass: 5, priceBottle: 26, description: "Complejo, con taninos sedosos y final largo", position: 2 },
  { id: "w3", name: "Ramón Bilbao Edición Limitada", year: 2019, region: "Rioja", grape: "Tempranillo", type: "tinto", priceBottle: 18, description: "Moderno, afrutado y elegante", position: 3 },
  { id: "w4", name: "Albariño Mar de Frades", year: 2023, region: "Rías Baixas", grape: "Albariño", type: "blanco", priceGlass: 5, priceBottle: 24, description: "Fresco, mineral, con notas de fruta blanca", position: 4 },
  { id: "w5", name: "Verdejo José Pariente", year: 2023, region: "Rueda", grape: "Verdejo", type: "blanco", priceGlass: 4, priceBottle: 16, description: "Aromático, con notas herbáceas y cítricas", position: 5 },
  { id: "w6", name: "Muga Rosado", year: 2023, region: "Rioja", grape: "Garnacha, Viura", type: "rosado", priceGlass: 4, priceBottle: 14, description: "Fresco y frutal, ideal para terraza", position: 6 },
  { id: "w7", name: "Freixenet Cordón Negro Brut", region: "Penedès", grape: "Macabeo, Xarel·lo, Parellada", type: "espumoso", priceBottle: 12, description: "Clásico cava brut, burbujas finas", position: 7 },
  { id: "w8", name: "Pedro Ximénez Toro Albalá", region: "Montilla-Moriles", grape: "Pedro Ximénez", type: "dulce", priceGlass: 5, priceBottle: 28, description: "Denso, dulce, con notas de pasas y dátiles", position: 8 },
  { id: "w9", name: "Châteauneuf-du-Pape", year: 2019, region: "Ródano", grape: "Garnacha, Syrah", type: "tinto", priceBottle: 38, description: "Potente, especiado, con cuerpo", position: 9 },
  { id: "w10", name: "Barolo Fontanafredda", year: 2018, region: "Piamonte", grape: "Nebbiolo", type: "tinto", priceBottle: 42, description: "Elegante, taninos firmes, gran complejidad", position: 10 },
];

export const tables: Table[] = [
  { id: "t1", number: "Mesa 1", capacity: 2, zone: "Interior", combinable: false, status: "free" },
  { id: "t2", number: "Mesa 2", capacity: 2, zone: "Interior", combinable: false, status: "reserved", reservedBy: "Carlos M.", reservedTime: "21:00" },
  { id: "t3", number: "Mesa 3", capacity: 4, zone: "Interior", combinable: true, status: "occupied" },
  { id: "t4", number: "Mesa 4", capacity: 4, zone: "Interior", combinable: true, status: "free" },
  { id: "t5", number: "Mesa 5", capacity: 4, zone: "Terraza", combinable: false, status: "reserved", reservedBy: "Ana T.", reservedTime: "21:00" },
  { id: "t6", number: "Mesa 6", capacity: 6, zone: "Terraza", combinable: true, status: "free" },
  { id: "t7", number: "Mesa 7", capacity: 6, zone: "Terraza", combinable: true, status: "free" },
  { id: "t8", number: "Mesa 8", capacity: 2, zone: "Terraza", combinable: false, status: "out-of-service" },
  { id: "t9", number: "Mesa 9", capacity: 8, zone: "Privado", combinable: false, status: "reserved", reservedBy: "Grupo empresa", reservedTime: "21:30" },
  { id: "t10", number: "Mesa 10", capacity: 2, zone: "Barra", combinable: false, status: "free" },
  { id: "t11", number: "Mesa 11", capacity: 2, zone: "Barra", combinable: false, status: "occupied" },
  { id: "t12", number: "Mesa 12", capacity: 4, zone: "Interior", combinable: true, status: "free" },
];

const today = new Date();
const getDateStr = (offset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  return d.toISOString().split("T")[0];
};
const dayOfWeek = today.getDay();
const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

export const reservations: Reservation[] = [
  // Martes mediodía
  { id: "res1", tableId: "t1", name: "María López", phone: "612345001", date: getDateStr(mondayOffset + 1), time: "13:30", guests: 2, status: "confirmed", source: "digital", createdAt: getDateStr(mondayOffset - 2) },
  { id: "res2", tableId: "t3", name: "Juan García", phone: "612345002", date: getDateStr(mondayOffset + 1), time: "14:00", guests: 4, status: "confirmed", source: "digital", createdAt: getDateStr(mondayOffset - 1) },
  { id: "res3", tableId: "t4", name: "Laura Pérez", phone: "612345003", date: getDateStr(mondayOffset + 1), time: "13:30", guests: 3, status: "completed", source: "manual", createdAt: getDateStr(mondayOffset - 3) },
  // Martes noche
  { id: "res4", tableId: "t1", name: "Pedro Sánchez", phone: "612345004", date: getDateStr(mondayOffset + 1), time: "21:00", guests: 2, status: "confirmed", source: "digital", createdAt: getDateStr(mondayOffset) },
  { id: "res5", tableId: "t3", name: "Ana Ruiz", phone: "612345005", date: getDateStr(mondayOffset + 1), time: "20:30", guests: 4, status: "confirmed", source: "digital", createdAt: getDateStr(mondayOffset - 1) },
  { id: "res6", tableId: "t5", name: "Carlos Martínez", phone: "612345006", email: "carlos@email.com", date: getDateStr(mondayOffset + 1), time: "21:00", guests: 4, notes: "Cumpleaños de mi mujer. ¿Podéis poner una vela en el postre?", status: "confirmed", source: "digital", createdAt: getDateStr(mondayOffset - 3) },
  { id: "res7", tableId: "t6", name: "Isabel Torres", phone: "612345007", date: getDateStr(mondayOffset + 1), time: "21:30", guests: 5, status: "confirmed", source: "phone", createdAt: getDateStr(mondayOffset - 1) },
  { id: "res8", tableId: "t12", name: "David Moreno", phone: "612345008", date: getDateStr(mondayOffset + 1), time: "21:00", guests: 3, status: "pending", source: "digital", createdAt: getDateStr(mondayOffset) },
  // Miércoles
  { id: "res9", tableId: "t1", name: "Carmen Vidal", phone: "612345009", date: getDateStr(mondayOffset + 2), time: "14:00", guests: 2, status: "confirmed", source: "digital", createdAt: getDateStr(mondayOffset) },
  { id: "res10", tableId: "t4", name: "Roberto Díaz", phone: "612345010", date: getDateStr(mondayOffset + 2), time: "13:30", guests: 4, status: "confirmed", source: "manual", createdAt: getDateStr(mondayOffset + 1) },
  { id: "res11", tableId: "t5", name: "Lucía Navarro", phone: "612345011", date: getDateStr(mondayOffset + 2), time: "21:00", guests: 3, status: "cancelled", source: "digital", createdAt: getDateStr(mondayOffset - 2), notes: "Cancelada por el cliente" },
  { id: "res12", tableId: "t6", name: "Grupo empresa Acme", phone: "612345012", date: getDateStr(mondayOffset + 2), time: "21:30", guests: 6, status: "confirmed", source: "phone", createdAt: getDateStr(mondayOffset - 4) },
  // Jueves
  { id: "res13", tableId: "t3", name: "Elena Fernández", phone: "612345013", date: getDateStr(mondayOffset + 3), time: "14:00", guests: 4, status: "confirmed", source: "digital", createdAt: getDateStr(mondayOffset) },
  { id: "res14", tableId: "t9", name: "Antonio Muñoz", phone: "612345014", date: getDateStr(mondayOffset + 3), time: "21:00", guests: 8, status: "confirmed", source: "phone", notes: "Cena de negocios, necesitan proyector", createdAt: getDateStr(mondayOffset - 5) },
  { id: "res15", tableId: "t1", name: "Paula Jiménez", phone: "612345015", date: getDateStr(mondayOffset + 3), time: "21:30", guests: 2, status: "noshow", source: "digital", createdAt: getDateStr(mondayOffset - 1) },
  // Viernes
  { id: "res16", tableId: "t5", name: "Miguel Ángel R.", phone: "612345016", date: getDateStr(mondayOffset + 4), time: "14:00", guests: 4, status: "confirmed", source: "digital", createdAt: getDateStr(mondayOffset) },
  { id: "res17", tableId: "t6", name: "Sara Blanco", phone: "612345017", date: getDateStr(mondayOffset + 4), time: "21:00", guests: 6, status: "confirmed", source: "digital", createdAt: getDateStr(mondayOffset + 1) },
  // Sábado
  { id: "res18", tableId: "t3", name: "Alejandro Ramos", phone: "612345018", date: getDateStr(mondayOffset + 5), time: "14:00", guests: 4, status: "confirmed", source: "digital", createdAt: getDateStr(mondayOffset + 2) },
  { id: "res19", tableId: "t7", name: "Marina Costa", phone: "612345019", date: getDateStr(mondayOffset + 5), time: "21:00", guests: 5, status: "pending", source: "digital", notes: "Alergia grave a marisco", createdAt: getDateStr(mondayOffset + 3) },
  { id: "res20", tableId: "t9", name: "Familia Rodríguez", phone: "612345020", date: getDateStr(mondayOffset + 5), time: "14:30", guests: 8, status: "confirmed", source: "phone", createdAt: getDateStr(mondayOffset) },
  // Domingo
  { id: "res21", tableId: "t4", name: "Cristina Molina", phone: "612345021", date: getDateStr(mondayOffset + 6), time: "13:30", guests: 3, status: "confirmed", source: "digital", createdAt: getDateStr(mondayOffset + 3) },
];

export const dailyMenu: DailyMenu = {
  id: "dm1",
  starter: "Crema de calabaza con picatostes de romero",
  main: "Merluza a la plancha con patatas panaderas",
  dessert: "Tarta de queso casera",
  price: 14.90,
  includes: "Pan, bebida y café",
  schedule: "De lunes a viernes, solo mediodía",
  visible: true,
};

export const metricsData = {
  reservationsToday: 14,
  coversToday: 38,
  totalCovers: 42,
  pendingToday: 2,
  cancelledToday: 1,
  totalReservations: 87,
  totalCoversMonth: 234,
  avgOccupancy: 78,
  noshowRate: 4.6,
  cancellationRate: 6.9,
  avgPartySize: 2.7,
  topDish: "Croquetas caseras de jamón ibérico",
  topDishViews: 342,
  reservationsByDay: [
    { day: "Lun", lunch: 0, dinner: 0 },
    { day: "Mar", lunch: 3, dinner: 5 },
    { day: "Mié", lunch: 4, dinner: 6 },
    { day: "Jue", lunch: 5, dinner: 7 },
    { day: "Vie", lunch: 6, dinner: 8 },
    { day: "Sáb", lunch: 7, dinner: 9 },
    { day: "Dom", lunch: 5, dinner: 0 },
  ],
  weeklyOccupancy: [
    { week: "S1", occupancy: 65 },
    { week: "S2", occupancy: 72 },
    { week: "S3", occupancy: 68 },
    { week: "S4", occupancy: 75 },
    { week: "S5", occupancy: 80 },
    { week: "S6", occupancy: 78 },
    { week: "S7", occupancy: 82 },
    { week: "S8", occupancy: 78 },
  ],
  topDishes: [
    { name: "Croquetas", views: 342 },
    { name: "Tarta de queso", views: 289 },
    { name: "Pulpo a la gallega", views: 267 },
    { name: "Solomillo de ternera", views: 245 },
    { name: "Gambas al ajillo", views: 231 },
    { name: "Arroz de bogavante", views: 218 },
    { name: "Lubina a la espalda", views: 198 },
    { name: "Secreto ibérico", views: 187 },
    { name: "Ensalada burrata", views: 176 },
    { name: "Tiramisú", views: 165 },
  ],
  reservationsBySource: [
    { source: "Carta digital", value: 72, fill: "hsl(var(--primary))" },
    { source: "Manual", value: 18, fill: "hsl(var(--gold))" },
    { source: "Teléfono", value: 10, fill: "hsl(var(--muted-foreground))" },
  ],
  heatmap: [
    { hour: "13:00", mon: 0, tue: 60, wed: 70, thu: 75, fri: 85, sat: 90, sun: 80 },
    { hour: "13:30", mon: 0, tue: 70, wed: 75, thu: 80, fri: 90, sat: 95, sun: 85 },
    { hour: "14:00", mon: 0, tue: 80, wed: 85, thu: 90, fri: 95, sat: 98, sun: 90 },
    { hour: "14:30", mon: 0, tue: 65, wed: 70, thu: 75, fri: 85, sat: 90, sun: 75 },
    { hour: "15:00", mon: 0, tue: 45, wed: 50, thu: 55, fri: 65, sat: 70, sun: 50 },
    { hour: "20:30", mon: 0, tue: 50, wed: 55, thu: 65, fri: 80, sat: 90, sun: 0 },
    { hour: "21:00", mon: 0, tue: 65, wed: 70, thu: 80, fri: 94, sat: 98, sun: 0 },
    { hour: "21:30", mon: 0, tue: 55, wed: 60, thu: 70, fri: 85, sat: 94, sun: 0 },
    { hour: "22:00", mon: 0, tue: 40, wed: 45, thu: 55, fri: 70, sat: 80, sun: 0 },
  ],
};