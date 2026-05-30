import React, { createContext, useContext, useCallback, useMemo, useEffect, useState } from "react";
import {
  restaurant as defaultRestaurant,
  categories as defaultCategories,
  dishes as defaultDishes,
  wines as defaultWines,
  tables as defaultTables,
  reservations as defaultReservations,
  dailyMenu as defaultDailyMenu,
  type Restaurant,
  type Category,
  type Dish,
  type Wine,
  type Table,
  type Reservation,
  type DailyMenu,
} from "@/data/mockData";

// ─────────── Types ───────────
export type Role = "superadmin" | "owner" | "staff";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  tenantId: string | null;
  createdAt: string;
}

export interface Tenant {
  id: string;
  slug: string;
  plan: "free" | "pro" | "business";
  createdAt: string;
  ownerId: string;
  suspended?: boolean;
}

interface NotificationSettings {
  emailOnReservation: boolean;
  emailOnCancellation: boolean;
  dailySummary: boolean;
  noshowAlert: boolean;
}

export interface AppNotification {
  id: string;
  type: "reservation" | "cancellation" | "noshow" | "system";
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface TenantData {
  restaurant: Restaurant;
  categories: Category[];
  dishes: Dish[];
  wines: Wine[];
  tables: Table[];
  reservations: Reservation[];
  dailyMenu: DailyMenu;
  notifications: NotificationSettings;
  appNotifications: AppNotification[];
}

interface DBState {
  users: User[];
  tenants: Tenant[];
  data: Record<string, TenantData>;
  session: { userId: string } | null;
}

const DB_KEY = "carta_db";
const PLAN_LIMITS = {
  free: { maxDishes: 20, maxCategories: 3 },
  pro: { maxDishes: Infinity, maxCategories: Infinity },
  business: { maxDishes: Infinity, maxCategories: Infinity },
};

const defaultNotificationSettings: NotificationSettings = {
  emailOnReservation: true,
  emailOnCancellation: true,
  dailySummary: false,
  noshowAlert: true,
};

const emptyTenantData = (name = ""): TenantData => ({
  restaurant: {
    ...defaultRestaurant,
    id: "",
    name,
    slug: "",
    description: "",
    phone: "",
    email: "",
    web: "",
    instagram: "",
    address: "",
    cuisine: [],
    services: {},
    plan: "free",
    hours: defaultRestaurant.hours.map(h => ({ ...h })),
  },
  categories: [],
  dishes: [],
  wines: [],
  tables: [],
  reservations: [],
  dailyMenu: { ...defaultDailyMenu, visible: false },
  notifications: { ...defaultNotificationSettings },
  appNotifications: [],
});

// ─────────── ID generator ───────────
let idCounter = Date.now();
const genId = (prefix: string) => `${prefix}_${++idCounter}_${Math.random().toString(36).slice(2, 6)}`;

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `r-${Date.now()}`;

// ─────────── Default DB / Migration ───────────
function buildDefaultDb(): DBState {
  const superAdminId = "u_admin";
  const demoUserId = "u_demo";
  const demoTenantId = "t_demo";
  const now = new Date().toISOString();
  return {
    users: [
      { id: superAdminId, email: "admin@carta.app", password: "admin1234", name: "Super Admin", role: "superadmin", tenantId: null, createdAt: now },
      { id: demoUserId, email: "demo@carta.app", password: "demo1234", name: "Demo Owner", role: "owner", tenantId: demoTenantId, createdAt: now },
    ],
    tenants: [
      { id: demoTenantId, slug: defaultRestaurant.slug, plan: "pro", createdAt: now, ownerId: demoUserId },
    ],
    data: {
      [demoTenantId]: {
        restaurant: { ...defaultRestaurant, id: demoTenantId },
        categories: defaultCategories,
        dishes: defaultDishes,
        wines: defaultWines,
        tables: defaultTables,
        reservations: defaultReservations,
        dailyMenu: defaultDailyMenu,
        notifications: { ...defaultNotificationSettings },
        appNotifications: [],
      },
    },
    session: null,
  };
}

function tryMigrateLegacy(): DBState | null {
  try {
    const legacyRest = localStorage.getItem("carta_restaurant");
    const legacyCreds = localStorage.getItem("carta_credentials");
    if (!legacyRest && !legacyCreds) return null;

    const restaurant = legacyRest ? JSON.parse(legacyRest) : defaultRestaurant;
    const categories = JSON.parse(localStorage.getItem("carta_categories") || "[]");
    const dishes = JSON.parse(localStorage.getItem("carta_dishes") || "[]");
    const wines = JSON.parse(localStorage.getItem("carta_wines") || "[]");
    const tables = JSON.parse(localStorage.getItem("carta_tables") || "[]");
    const reservations = JSON.parse(localStorage.getItem("carta_reservations") || "[]");
    const dailyMenu = JSON.parse(localStorage.getItem("carta_dailyMenu") || JSON.stringify(defaultDailyMenu));
    const notifications = JSON.parse(localStorage.getItem("carta_notifications") || JSON.stringify(defaultNotificationSettings));
    const appNotifications = JSON.parse(localStorage.getItem("carta_appNotifications") || "[]");
    const userEmail = JSON.parse(localStorage.getItem("carta_userEmail") || '""');
    const userName = JSON.parse(localStorage.getItem("carta_userName") || '""');
    const userPlan = JSON.parse(localStorage.getItem("carta_userPlan") || '"pro"');
    const creds = legacyCreds ? JSON.parse(legacyCreds) : null;
    const wasLoggedIn = JSON.parse(localStorage.getItem("carta_loggedIn") || "false");

    const base = buildDefaultDb();
    const tenantId = "t_migrated";
    const userId = "u_migrated";
    const now = new Date().toISOString();
    const slug = restaurant.slug || slugify(restaurant.name || userName || "mi-restaurante");

    const user: User = {
      id: userId,
      email: creds?.email || userEmail || "owner@carta.app",
      password: creds?.password || "changeme",
      name: userName || "Propietario",
      role: "owner",
      tenantId,
      createdAt: now,
    };
    const tenant: Tenant = { id: tenantId, slug, plan: userPlan, createdAt: now, ownerId: userId };

    base.users.push(user);
    base.tenants.push(tenant);
    base.data[tenantId] = {
      restaurant: { ...restaurant, id: tenantId, slug, plan: userPlan },
      categories, dishes, wines, tables, reservations, dailyMenu, notifications, appNotifications,
    };
    if (wasLoggedIn) base.session = { userId };

    // Clean legacy keys
    [
      "carta_restaurant", "carta_categories", "carta_dishes", "carta_wines",
      "carta_tables", "carta_reservations", "carta_dailyMenu", "carta_loggedIn",
      "carta_userPlan", "carta_userEmail", "carta_userName", "carta_credentials",
      "carta_notifications", "carta_appNotifications",
    ].forEach(k => localStorage.removeItem(k));
    return base;
  } catch {
    return null;
  }
}

function loadInitialDb(): DBState {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* fallthrough */ }
  const migrated = tryMigrateLegacy();
  if (migrated) return migrated;
  return buildDefaultDb();
}

// ─────────── Context shape ───────────
interface AppState {
  // Active tenant convenience (same as before)
  restaurant: Restaurant;
  categories: Category[];
  dishes: Dish[];
  wines: Wine[];
  tables: Table[];
  reservations: Reservation[];
  dailyMenu: DailyMenu;
  notifications: NotificationSettings;
  appNotifications: AppNotification[];
  userPlan: "free" | "pro" | "business";
  userEmail: string;
  userName: string;
  isLoggedIn: boolean;

  // Multi-tenant / roles
  currentUser: User | null;
  currentTenant: Tenant | null;
  role: Role | null;
  users: User[];
  tenants: Tenant[];
  allData: Record<string, TenantData>;

  // Plan limits
  planLimits: { maxDishes: number; maxCategories: number };
  canAddDish: boolean;
  canAddCategory: boolean;

  // Auth
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (email: string, password: string, name: string) => boolean;
  setUserPlan: (plan: "free" | "pro" | "business") => void;

  // Restaurant / data
  updateRestaurant: (data: Partial<Restaurant>) => void;

  // Dishes
  addDish: (dish: Omit<Dish, "id">) => void;
  updateDish: (id: string, data: Partial<Dish>) => void;
  deleteDish: (id: string) => void;
  duplicateDish: (id: string) => void;
  toggleDishAvailability: (id: string) => void;

  // Categories
  addCategory: (name: string, icon: string) => string;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  updateDailyMenu: (data: Partial<DailyMenu>) => void;

  // Tables
  addTable: (table: Omit<Table, "id">) => void;
  updateTable: (id: string, data: Partial<Table>) => void;
  deleteTable: (id: string) => void;

  // Reservations
  addReservation: (reservation: Omit<Reservation, "id" | "createdAt">) => void;
  addReservationToTenant: (tenantId: string, reservation: Omit<Reservation, "id" | "createdAt">) => void;
  updateReservationStatus: (id: string, status: Reservation["status"]) => void;

  // Wines
  addWine: (wine: Omit<Wine, "id">) => void;
  updateWine: (id: string, data: Partial<Wine>) => void;
  deleteWine: (id: string) => void;

  // Notifications
  toggleNotification: (key: keyof NotificationSettings) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Multi-tenant management (superadmin / owner)
  getTenantBySlug: (slug: string) => { tenant: Tenant; data: TenantData } | null;
  setTenantPlan: (tenantId: string, plan: "free" | "pro" | "business") => void;
  suspendTenant: (tenantId: string, suspended: boolean) => void;
  deleteTenant: (tenantId: string) => void;
  impersonate: (userId: string) => void;

  inviteTeamMember: (email: string, password: string, name: string, role: Exclude<Role, "superadmin">) => boolean;
  updateUserRole: (userId: string, role: Exclude<Role, "superadmin">) => void;
  removeUser: (userId: string) => void;

  // helpers
  can: (action: "manage" | "edit" | "view") => boolean;
}

const AppContext = createContext<AppState | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

// ─────────── Provider ───────────
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDbState] = useState<DBState>(() => loadInitialDb());

  // Persist
  useEffect(() => {
    try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch { /* ignore */ }
  }, [db]);

  const setDb = useCallback((updater: (prev: DBState) => DBState) => {
    setDbState(prev => updater(prev));
  }, []);

  // Derived
  const currentUser = useMemo(() => {
    if (!db.session) return null;
    return db.users.find(u => u.id === db.session!.userId) || null;
  }, [db.session, db.users]);

  const currentTenant = useMemo(() => {
    if (!currentUser?.tenantId) return null;
    return db.tenants.find(t => t.id === currentUser.tenantId) || null;
  }, [currentUser, db.tenants]);

  const activeData = useMemo<TenantData>(() => {
    if (currentTenant && db.data[currentTenant.id]) return db.data[currentTenant.id];
    return emptyTenantData();
  }, [currentTenant, db.data]);

  const role = currentUser?.role ?? null;
  const isLoggedIn = !!currentUser;
  const userPlan = currentTenant?.plan ?? "free";
  const planLimits = PLAN_LIMITS[userPlan];
  const canAddDish = activeData.dishes.length < planLimits.maxDishes;
  const canAddCategory = activeData.categories.filter(c => c.id !== "c0").length < planLimits.maxCategories;

  // ── Helpers to mutate active tenant data ──
  const updateActiveData = useCallback((mut: (data: TenantData) => TenantData) => {
    setDb(prev => {
      if (!prev.session) return prev;
      const user = prev.users.find(u => u.id === prev.session!.userId);
      const tenantId = user?.tenantId;
      if (!tenantId || !prev.data[tenantId]) return prev;
      return { ...prev, data: { ...prev.data, [tenantId]: mut(prev.data[tenantId]) } };
    });
  }, [setDb]);

  const addAppNotification = useCallback((type: AppNotification["type"], title: string, message: string) => {
    const notif: AppNotification = { id: genId("n"), type, title, message, date: new Date().toISOString(), read: false };
    updateActiveData(d => ({ ...d, appNotifications: [notif, ...d.appNotifications].slice(0, 50) }));
  }, [updateActiveData]);

  // ─────── Auth ───────
  const login = useCallback((email: string, password: string) => {
    let success = false;
    setDb(prev => {
      const user = prev.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (!user) return prev;
      if (user.tenantId) {
        const tenant = prev.tenants.find(t => t.id === user.tenantId);
        if (tenant?.suspended) return prev;
      }
      success = true;
      return { ...prev, session: { userId: user.id } };
    });
    return success;
  }, [setDb]);

  const logout = useCallback(() => setDb(prev => ({ ...prev, session: null })), [setDb]);

  const register = useCallback((email: string, password: string, name: string): boolean => {
    let ok = false;
    setDb(prev => {
      if (prev.users.some(u => u.email.toLowerCase() === email.toLowerCase())) return prev;
      const userId = genId("u");
      const tenantId = genId("t");
      const now = new Date().toISOString();
      const slug = slugify(name);
      const user: User = { id: userId, email, password, name, role: "owner", tenantId, createdAt: now };
      const tenant: Tenant = { id: tenantId, slug, plan: "free", createdAt: now, ownerId: userId };
      const data: TenantData = {
        ...emptyTenantData(name),
        restaurant: { ...emptyTenantData(name).restaurant, id: tenantId, slug, name },
      };
      ok = true;
      return {
        ...prev,
        users: [...prev.users, user],
        tenants: [...prev.tenants, tenant],
        data: { ...prev.data, [tenantId]: data },
        session: { userId },
      };
    });
    return ok;
  }, [setDb]);

  const setUserPlan = useCallback((plan: "free" | "pro" | "business") => {
    setDb(prev => {
      if (!prev.session) return prev;
      const user = prev.users.find(u => u.id === prev.session!.userId);
      if (!user?.tenantId) return prev;
      return {
        ...prev,
        tenants: prev.tenants.map(t => t.id === user.tenantId ? { ...t, plan } : t),
        data: prev.data[user.tenantId]
          ? { ...prev.data, [user.tenantId]: { ...prev.data[user.tenantId], restaurant: { ...prev.data[user.tenantId].restaurant, plan } } }
          : prev.data,
      };
    });
  }, [setDb]);

  // ─────── Restaurant ───────
  const updateRestaurant = useCallback((data: Partial<Restaurant>) => {
    updateActiveData(d => ({ ...d, restaurant: { ...d.restaurant, ...data } }));
    // keep tenant.slug in sync if slug changed
    if (data.slug) {
      setDb(prev => {
        if (!prev.session) return prev;
        const u = prev.users.find(x => x.id === prev.session!.userId);
        if (!u?.tenantId) return prev;
        return { ...prev, tenants: prev.tenants.map(t => t.id === u.tenantId ? { ...t, slug: data.slug! } : t) };
      });
    }
  }, [updateActiveData, setDb]);

  // ─────── Dishes ───────
  const addDish = useCallback((dish: Omit<Dish, "id">) => {
    updateActiveData(d => {
      const newDish: Dish = { ...dish, id: genId("d") };
      return {
        ...d,
        dishes: [...d.dishes, newDish],
        categories: d.categories.map(c => c.id === dish.categoryId ? { ...c, dishCount: c.dishCount + 1 } : c),
      };
    });
  }, [updateActiveData]);

  const updateDish = useCallback((id: string, data: Partial<Dish>) => {
    updateActiveData(d => ({ ...d, dishes: d.dishes.map(x => x.id === id ? { ...x, ...data } : x) }));
  }, [updateActiveData]);

  const deleteDish = useCallback((id: string) => {
    updateActiveData(d => {
      const dish = d.dishes.find(x => x.id === id);
      return {
        ...d,
        dishes: d.dishes.filter(x => x.id !== id),
        categories: dish
          ? d.categories.map(c => c.id === dish.categoryId ? { ...c, dishCount: Math.max(0, c.dishCount - 1) } : c)
          : d.categories,
      };
    });
  }, [updateActiveData]);

  const duplicateDish = useCallback((id: string) => {
    updateActiveData(d => {
      const original = d.dishes.find(x => x.id === id);
      if (!original) return d;
      const copy: Dish = { ...original, id: genId("d"), name: `${original.name} (copia)`, position: original.position + 1 };
      return {
        ...d,
        dishes: [...d.dishes, copy],
        categories: d.categories.map(c => c.id === original.categoryId ? { ...c, dishCount: c.dishCount + 1 } : c),
      };
    });
  }, [updateActiveData]);

  const toggleDishAvailability = useCallback((id: string) => {
    updateActiveData(d => ({ ...d, dishes: d.dishes.map(x => x.id === id ? { ...x, available: !x.available } : x) }));
  }, [updateActiveData]);

  // ─────── Categories ───────
  const addCategory = useCallback((name: string, icon: string): string => {
    const id = genId("c");
    updateActiveData(d => {
      const maxPos = Math.max(0, ...d.categories.map(c => c.position));
      return { ...d, categories: [...d.categories, { id, name, icon, position: maxPos + 1, visible: true, dishCount: 0 }] };
    });
    return id;
  }, [updateActiveData]);

  const updateCategory = useCallback((id: string, data: Partial<Category>) => {
    updateActiveData(d => ({ ...d, categories: d.categories.map(c => c.id === id ? { ...c, ...data } : c) }));
  }, [updateActiveData]);

  const deleteCategory = useCallback((id: string) => {
    updateActiveData(d => ({
      ...d,
      dishes: d.dishes.filter(x => x.categoryId !== id),
      categories: d.categories.filter(c => c.id !== id),
    }));
  }, [updateActiveData]);

  // ─────── Daily menu ───────
  const updateDailyMenu = useCallback((data: Partial<DailyMenu>) => {
    updateActiveData(d => ({ ...d, dailyMenu: { ...d.dailyMenu, ...data } }));
  }, [updateActiveData]);

  // ─────── Tables ───────
  const addTable = useCallback((table: Omit<Table, "id">) => {
    updateActiveData(d => ({ ...d, tables: [...d.tables, { ...table, id: genId("tb") }] }));
  }, [updateActiveData]);
  const updateTable = useCallback((id: string, data: Partial<Table>) => {
    updateActiveData(d => ({ ...d, tables: d.tables.map(t => t.id === id ? { ...t, ...data } : t) }));
  }, [updateActiveData]);
  const deleteTable = useCallback((id: string) => {
    updateActiveData(d => ({ ...d, tables: d.tables.filter(t => t.id !== id) }));
  }, [updateActiveData]);

  // ─────── Reservations ───────
  const addReservation = useCallback((reservation: Omit<Reservation, "id" | "createdAt">) => {
    const newRes: Reservation = { ...reservation, id: genId("res"), createdAt: new Date().toISOString().split("T")[0] };
    updateActiveData(d => ({ ...d, reservations: [...d.reservations, newRes] }));
    addAppNotification("reservation", "Nueva reserva", `${reservation.name} — ${reservation.guests} pers. el ${reservation.date} a las ${reservation.time}`);
  }, [updateActiveData, addAppNotification]);

  const addReservationToTenant = useCallback((tenantId: string, reservation: Omit<Reservation, "id" | "createdAt">) => {
    const newRes: Reservation = { ...reservation, id: genId("res"), createdAt: new Date().toISOString().split("T")[0] };
    const notif: AppNotification = {
      id: genId("n"), type: "reservation", title: "Nueva reserva",
      message: `${reservation.name} — ${reservation.guests} pers. el ${reservation.date} a las ${reservation.time}`,
      date: new Date().toISOString(), read: false,
    };
    setDb(prev => {
      const data = prev.data[tenantId];
      if (!data) return prev;
      return {
        ...prev,
        data: {
          ...prev.data,
          [tenantId]: {
            ...data,
            reservations: [...data.reservations, newRes],
            appNotifications: [notif, ...data.appNotifications].slice(0, 50),
          },
        },
      };
    });
  }, [setDb]);

  const updateReservationStatus = useCallback((id: string, status: Reservation["status"]) => {
    updateActiveData(d => {
      const res = d.reservations.find(r => r.id === id);
      if (res) {
        if (status === "cancelled") addAppNotification("cancellation", "Reserva cancelada", `${res.name} canceló su reserva del ${res.date}`);
        else if (status === "noshow") addAppNotification("noshow", "No-show", `${res.name} no se presentó a su reserva del ${res.date}`);
      }
      return { ...d, reservations: d.reservations.map(r => r.id === id ? { ...r, status } : r) };
    });
  }, [updateActiveData, addAppNotification]);

  // ─────── Wines ───────
  const addWine = useCallback((wine: Omit<Wine, "id">) => {
    updateActiveData(d => ({ ...d, wines: [...d.wines, { ...wine, id: genId("w") }] }));
  }, [updateActiveData]);
  const updateWine = useCallback((id: string, data: Partial<Wine>) => {
    updateActiveData(d => ({ ...d, wines: d.wines.map(w => w.id === id ? { ...w, ...data } : w) }));
  }, [updateActiveData]);
  const deleteWine = useCallback((id: string) => {
    updateActiveData(d => ({ ...d, wines: d.wines.filter(w => w.id !== id) }));
  }, [updateActiveData]);

  // ─────── Notification settings ───────
  const toggleNotification = useCallback((key: keyof NotificationSettings) => {
    updateActiveData(d => ({ ...d, notifications: { ...d.notifications, [key]: !d.notifications[key] } }));
  }, [updateActiveData]);

  const markNotificationRead = useCallback((id: string) => {
    updateActiveData(d => ({ ...d, appNotifications: d.appNotifications.map(n => n.id === id ? { ...n, read: true } : n) }));
  }, [updateActiveData]);

  const markAllNotificationsRead = useCallback(() => {
    updateActiveData(d => ({ ...d, appNotifications: d.appNotifications.map(n => ({ ...n, read: true })) }));
  }, [updateActiveData]);

  // ─────── Multi-tenant management ───────
  const getTenantBySlug = useCallback((slug: string) => {
    const tenant = db.tenants.find(t => t.slug === slug);
    if (!tenant) return null;
    const data = db.data[tenant.id];
    if (!data) return null;
    return { tenant, data };
  }, [db.tenants, db.data]);

  const setTenantPlan = useCallback((tenantId: string, plan: "free" | "pro" | "business") => {
    setDb(prev => ({
      ...prev,
      tenants: prev.tenants.map(t => t.id === tenantId ? { ...t, plan } : t),
      data: prev.data[tenantId]
        ? { ...prev.data, [tenantId]: { ...prev.data[tenantId], restaurant: { ...prev.data[tenantId].restaurant, plan } } }
        : prev.data,
    }));
  }, [setDb]);

  const suspendTenant = useCallback((tenantId: string, suspended: boolean) => {
    setDb(prev => ({ ...prev, tenants: prev.tenants.map(t => t.id === tenantId ? { ...t, suspended } : t) }));
  }, [setDb]);

  const deleteTenant = useCallback((tenantId: string) => {
    setDb(prev => {
      const { [tenantId]: _removed, ...rest } = prev.data;
      return {
        ...prev,
        tenants: prev.tenants.filter(t => t.id !== tenantId),
        users: prev.users.filter(u => u.tenantId !== tenantId),
        data: rest,
        session: prev.session && prev.users.find(u => u.id === prev.session!.userId)?.tenantId === tenantId ? null : prev.session,
      };
    });
  }, [setDb]);

  const impersonate = useCallback((userId: string) => {
    setDb(prev => prev.users.some(u => u.id === userId) ? { ...prev, session: { userId } } : prev);
  }, [setDb]);

  const inviteTeamMember = useCallback((email: string, password: string, name: string, newRole: Exclude<Role, "superadmin">): boolean => {
    let ok = false;
    setDb(prev => {
      if (!prev.session) return prev;
      const owner = prev.users.find(u => u.id === prev.session!.userId);
      if (!owner?.tenantId) return prev;
      if (prev.users.some(u => u.email.toLowerCase() === email.toLowerCase())) return prev;
      const user: User = {
        id: genId("u"), email, password, name, role: newRole,
        tenantId: owner.tenantId, createdAt: new Date().toISOString(),
      };
      ok = true;
      return { ...prev, users: [...prev.users, user] };
    });
    return ok;
  }, [setDb]);

  const updateUserRole = useCallback((userId: string, newRole: Exclude<Role, "superadmin">) => {
    setDb(prev => ({ ...prev, users: prev.users.map(u => u.id === userId && u.role !== "superadmin" ? { ...u, role: newRole } : u) }));
  }, [setDb]);

  const removeUser = useCallback((userId: string) => {
    setDb(prev => {
      const target = prev.users.find(u => u.id === userId);
      if (!target || target.role === "superadmin") return prev;
      // do not delete owner of a tenant via this method
      const tenant = prev.tenants.find(t => t.ownerId === userId);
      if (tenant) return prev;
      return { ...prev, users: prev.users.filter(u => u.id !== userId) };
    });
  }, [setDb]);

  const can = useCallback((action: "manage" | "edit" | "view") => {
    if (!role) return false;
    if (role === "superadmin" || role === "owner") return true;
    if (role === "staff") return action !== "manage";
    return false;
  }, [role]);

  const value: AppState = {
    restaurant: activeData.restaurant,
    categories: activeData.categories,
    dishes: activeData.dishes,
    wines: activeData.wines,
    tables: activeData.tables,
    reservations: activeData.reservations,
    dailyMenu: activeData.dailyMenu,
    notifications: activeData.notifications,
    appNotifications: activeData.appNotifications,
    userPlan,
    userEmail: currentUser?.email ?? "",
    userName: currentUser?.name ?? "",
    isLoggedIn,
    currentUser, currentTenant, role,
    users: db.users, tenants: db.tenants, allData: db.data,
    planLimits, canAddDish, canAddCategory,
    login, logout, register, setUserPlan,
    updateRestaurant,
    addDish, updateDish, deleteDish, duplicateDish, toggleDishAvailability,
    addCategory, updateCategory, deleteCategory,
    updateDailyMenu,
    addTable, updateTable, deleteTable,
    addReservation, updateReservationStatus,
    addWine, updateWine, deleteWine,
    toggleNotification, markNotificationRead, markAllNotificationsRead,
    getTenantBySlug, setTenantPlan, suspendTenant, deleteTenant, impersonate,
    inviteTeamMember, updateUserRole, removeUser,
    can,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
