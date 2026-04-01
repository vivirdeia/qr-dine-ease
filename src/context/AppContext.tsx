import React, { createContext, useContext, useCallback } from "react";
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
  userPlan: "free" | "pro" | "business";
  userEmail: string;
  userName: string;

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

  // Notifications
  toggleNotification: (key: keyof NotificationSettings) => void;
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
  const [wines] = useLocalStorage<Wine[]>("carta_wines", defaultWines);
  const [tables, setTables] = useLocalStorage<Table[]>("carta_tables", defaultTables);
  const [reservations, setReservations] = useLocalStorage<Reservation[]>("carta_reservations", defaultReservations);
  const [dailyMenu, setDailyMenu] = useLocalStorage<DailyMenu>("carta_dailyMenu", defaultDailyMenu);
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage<boolean>("carta_loggedIn", false);
  const [notifications, setNotifications] = useLocalStorage<NotificationSettings>("carta_notifications", {
    emailOnReservation: true,
    emailOnCancellation: true,
    dailySummary: false,
    noshowAlert: true,
  });

  const login = useCallback((email: string, password: string) => {
    if (email === "demo@carta.app" && password === "demo1234") {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  }, [setIsLoggedIn]);

  const logout = useCallback(() => setIsLoggedIn(false), [setIsLoggedIn]);

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
  }, [setReservations]);

  const updateReservationStatus = useCallback((id: string, status: Reservation["status"]) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }, [setReservations]);

  const toggleNotification = useCallback((key: keyof NotificationSettings) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  }, [setNotifications]);

  const value: AppState = {
    restaurant, categories, dishes, wines, tables, reservations, dailyMenu,
    isLoggedIn, notifications,
    login, logout,
    updateRestaurant,
    addDish, updateDish, deleteDish, duplicateDish, toggleDishAvailability,
    addCategory, updateCategory, deleteCategory,
    updateDailyMenu,
    addTable, updateTable, deleteTable,
    addReservation, updateReservationStatus,
    toggleNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
