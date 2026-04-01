import React, { createContext, useContext, useCallback, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
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

const PLAN_LIMITS = {
  free: { maxDishes: 20, maxCategories: 3 },
  pro: { maxDishes: Infinity, maxCategories: Infinity },
  business: { maxDishes: Infinity, maxCategories: Infinity },
};

interface AppState {
  restaurant: Restaurant;
  categories: Category[];
  dishes: Dish[];
  wines: Wine[];
  tables: Table[];
  reservations: Reservation[];
  dailyMenu: DailyMenu;
  isLoggedIn: boolean;
  notifications: NotificationSettings;
  appNotifications: AppNotification[];
  userPlan: "free" | "pro" | "business";
  userEmail: string;
  userName: string;

  // Plan limits
  planLimits: { maxDishes: number; maxCategories: number };
  canAddDish: boolean;
  canAddCategory: boolean;

  // Auth
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (email: string, password: string, name: string) => void;
  setUserPlan: (plan: "free" | "pro" | "business") => void;

  // Restaurant
  updateRestaurant: (data: Partial<Restaurant>) => void;

  // Dishes
  addDish: (dish: Omit<Dish, "id">) => void;
  updateDish: (id: string, data: Partial<Dish>) => void;
  deleteDish: (id: string) => void;
  duplicateDish: (id: string) => void;
  toggleDishAvailability: (id: string) => void;

  // Categories
  addCategory: (name: string, icon: string) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Daily menu
  updateDailyMenu: (data: Partial<DailyMenu>) => void;

  // Tables
  addTable: (table: Omit<Table, "id">) => void;
  updateTable: (id: string, data: Partial<Table>) => void;
  deleteTable: (id: string) => void;

  // Reservations
  addReservation: (reservation: Omit<Reservation, "id" | "createdAt">) => void;
  updateReservationStatus: (id: string, status: Reservation["status"]) => void;

  // Wines
  addWine: (wine: Omit<Wine, "id">) => void;
  updateWine: (id: string, data: Partial<Wine>) => void;
  deleteWine: (id: string) => void;

  // Notifications
  toggleNotification: (key: keyof NotificationSettings) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppState | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

let idCounter = Date.now();
const genId = (prefix: string) => `${prefix}${++idCounter}`;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [restaurant, setRestaurant] = useLocalStorage<Restaurant>("carta_restaurant", defaultRestaurant);
  const [categories, setCategories] = useLocalStorage<Category[]>("carta_categories", defaultCategories);
  const [dishes, setDishes] = useLocalStorage<Dish[]>("carta_dishes", defaultDishes);
  const [wines, setWines] = useLocalStorage<Wine[]>("carta_wines", defaultWines);
  const [tables, setTables] = useLocalStorage<Table[]>("carta_tables", defaultTables);
  const [reservations, setReservations] = useLocalStorage<Reservation[]>("carta_reservations", defaultReservations);
  const [dailyMenu, setDailyMenu] = useLocalStorage<DailyMenu>("carta_dailyMenu", defaultDailyMenu);
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage<boolean>("carta_loggedIn", false);
  const [userPlan, setUserPlanState] = useLocalStorage<"free" | "pro" | "business">("carta_userPlan", "pro");
  const [userEmail, setUserEmail] = useLocalStorage<string>("carta_userEmail", "");
  const [userName, setUserName] = useLocalStorage<string>("carta_userName", "");
  const [registeredCredentials, setRegisteredCredentials] = useLocalStorage<{ email: string; password: string } | null>("carta_credentials", null);
  const [notifications, setNotifications] = useLocalStorage<NotificationSettings>("carta_notifications", {
    emailOnReservation: true,
    emailOnCancellation: true,
    dailySummary: false,
    noshowAlert: true,
  });
  const [appNotifications, setAppNotifications] = useLocalStorage<AppNotification[]>("carta_appNotifications", []);

  const planLimits = PLAN_LIMITS[userPlan];
  const canAddDish = dishes.length < planLimits.maxDishes;
  const canAddCategory = categories.filter(c => c.id !== "c0").length < planLimits.maxCategories;

  const addNotification = useCallback((type: AppNotification["type"], title: string, message: string) => {
    const notif: AppNotification = {
      id: genId("n"),
      type,
      title,
      message,
      date: new Date().toISOString(),
      read: false,
    };
    setAppNotifications(prev => [notif, ...prev].slice(0, 50));
  }, [setAppNotifications]);

  const login = useCallback((email: string, password: string) => {
    if (registeredCredentials && email === registeredCredentials.email && password === registeredCredentials.password) {
      setIsLoggedIn(true);
      return true;
    }
    if (email === "demo@carta.app" && password === "demo1234") {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  }, [setIsLoggedIn, registeredCredentials]);

  const logout = useCallback(() => setIsLoggedIn(false), [setIsLoggedIn]);

  const registerUser = useCallback((email: string, password: string, name: string) => {
    setRegisteredCredentials({ email, password });
    setUserEmail(email);
    setUserName(name);
    setIsLoggedIn(true);
  }, [setRegisteredCredentials, setUserEmail, setUserName, setIsLoggedIn]);

  const setUserPlan = useCallback((plan: "free" | "pro" | "business") => {
    setUserPlanState(plan);
  }, [setUserPlanState]);

  const updateRestaurant = useCallback((data: Partial<Restaurant>) => {
    setRestaurant(prev => ({ ...prev, ...data }));
  }, [setRestaurant]);

  const addDish = useCallback((dish: Omit<Dish, "id">) => {
    const newDish: Dish = { ...dish, id: genId("d") };
    setDishes(prev => [...prev, newDish]);
    setCategories(prev => prev.map(c => c.id === dish.categoryId ? { ...c, dishCount: c.dishCount + 1 } : c));
  }, [setDishes, setCategories]);

  const updateDish = useCallback((id: string, data: Partial<Dish>) => {
    setDishes(prev => prev.map(d => d.id === id ? { ...d, ...data } : d));
  }, [setDishes]);

  const deleteDish = useCallback((id: string) => {
    setDishes(prev => {
      const dish = prev.find(d => d.id === id);
      if (dish) {
        setCategories(cats => cats.map(c => c.id === dish.categoryId ? { ...c, dishCount: Math.max(0, c.dishCount - 1) } : c));
      }
      return prev.filter(d => d.id !== id);
    });
  }, [setDishes, setCategories]);

  const duplicateDish = useCallback((id: string) => {
    setDishes(prev => {
      const original = prev.find(d => d.id === id);
      if (!original) return prev;
      const copy: Dish = { ...original, id: genId("d"), name: `${original.name} (copia)`, position: original.position + 1 };
      setCategories(cats => cats.map(c => c.id === original.categoryId ? { ...c, dishCount: c.dishCount + 1 } : c));
      return [...prev, copy];
    });
  }, [setDishes, setCategories]);

  const toggleDishAvailability = useCallback((id: string) => {
    setDishes(prev => prev.map(d => d.id === id ? { ...d, available: !d.available } : d));
  }, [setDishes]);

  const addCategory = useCallback((name: string, icon: string) => {
    const maxPos = Math.max(...categories.map(c => c.position), 0);
    setCategories(prev => [...prev, { id: genId("c"), name, icon, position: maxPos + 1, visible: true, dishCount: 0 }]);
  }, [categories, setCategories]);

  const updateCategory = useCallback((id: string, data: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  }, [setCategories]);

  const deleteCategory = useCallback((id: string) => {
    setDishes(prev => prev.filter(d => d.categoryId !== id));
    setCategories(prev => prev.filter(c => c.id !== id));
  }, [setDishes, setCategories]);

  const updateDailyMenu = useCallback((data: Partial<DailyMenu>) => {
    setDailyMenu(prev => ({ ...prev, ...data }));
  }, [setDailyMenu]);

  const addTable = useCallback((table: Omit<Table, "id">) => {
    setTables(prev => [...prev, { ...table, id: genId("t") }]);
  }, [setTables]);

  const updateTable = useCallback((id: string, data: Partial<Table>) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  }, [setTables]);

  const deleteTable = useCallback((id: string) => {
    setTables(prev => prev.filter(t => t.id !== id));
  }, [setTables]);

  const addReservation = useCallback((reservation: Omit<Reservation, "id" | "createdAt">) => {
    const newRes: Reservation = {
      ...reservation,
      id: genId("res"),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setReservations(prev => [...prev, newRes]);
    addNotification("reservation", "Nueva reserva", `${reservation.name} — ${reservation.guests} pers. el ${reservation.date} a las ${reservation.time}`);
  }, [setReservations, addNotification]);

  const updateReservationStatus = useCallback((id: string, status: Reservation["status"]) => {
    setReservations(prev => {
      const res = prev.find(r => r.id === id);
      if (res) {
        if (status === "cancelled") {
          addNotification("cancellation", "Reserva cancelada", `${res.name} canceló su reserva del ${res.date}`);
        } else if (status === "noshow") {
          addNotification("noshow", "No-show", `${res.name} no se presentó a su reserva del ${res.date}`);
        }
      }
      return prev.map(r => r.id === id ? { ...r, status } : r);
    });
  }, [setReservations, addNotification]);

  // Wine CRUD
  const addWine = useCallback((wine: Omit<Wine, "id">) => {
    setWines(prev => [...prev, { ...wine, id: genId("w") }]);
  }, [setWines]);

  const updateWine = useCallback((id: string, data: Partial<Wine>) => {
    setWines(prev => prev.map(w => w.id === id ? { ...w, ...data } : w));
  }, [setWines]);

  const deleteWine = useCallback((id: string) => {
    setWines(prev => prev.filter(w => w.id !== id));
  }, [setWines]);

  const toggleNotification = useCallback((key: keyof NotificationSettings) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  }, [setNotifications]);

  const markNotificationRead = useCallback((id: string) => {
    setAppNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, [setAppNotifications]);

  const markAllNotificationsRead = useCallback(() => {
    setAppNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, [setAppNotifications]);

  const value: AppState = {
    restaurant, categories, dishes, wines, tables, reservations, dailyMenu,
    isLoggedIn, notifications, appNotifications, userPlan, userEmail, userName,
    planLimits, canAddDish, canAddCategory,
    login, logout, register: registerUser, setUserPlan,
    updateRestaurant,
    addDish, updateDish, deleteDish, duplicateDish, toggleDishAvailability,
    addCategory, updateCategory, deleteCategory,
    updateDailyMenu,
    addTable, updateTable, deleteTable,
    addReservation, updateReservationStatus,
    addWine, updateWine, deleteWine,
    toggleNotification, markNotificationRead, markAllNotificationsRead,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
