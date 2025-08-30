import { create } from "zustand";
import { storageSave } from "./storage";
import { newId } from "../utils/ids";

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category?: string;
  available: boolean;
};

export type Table = {
  id: string;
  name: string;
  status: "available" | "booked" | "occupied";
  activeOrderId?: string | null;
};

export type OrderItem = {
  id: string;
  menuItemId: string;
  quantity: number;
};

export type Order = {
  id: string;
  tableId: string;
  items: OrderItem[];
  status: "pending" | "sentToKitchen" | "confirmed" | "completed";
  createdAt: string; // ISO
  completedAt?: string | null;
};

export type DataState = {
  menuItems: MenuItem[];
  tables: Table[];
  orders: Order[];
};

type DataStore = DataState & {
  hydrate: (s: DataState) => void;
  save: () => Promise<void>;
  // Menu
  addMenuItem: (input: Omit<MenuItem, "id">) => Promise<void>;
  updateMenuItem: (
    id: string,
    patch: Partial<Omit<MenuItem, "id">>
  ) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  // Tables
  addTable: (name: string) => Promise<void>;
  deleteTable: (id: string) => Promise<void>;
  bookTable: (tableId: string) => Promise<void>;
  occupyTable: (tableId: string) => Promise<void>;
  releaseTable: (tableId: string) => Promise<void>;
  // Orders
  createOrderForTable: (tableId: string) => Promise<string>; // returns orderId
  addItemToOrder: (
    orderId: string,
    menuItemId: string,
    quantity: number
  ) => Promise<void>;
  updateOrderItemQty: (
    orderId: string,
    orderItemId: string,
    quantity: number
  ) => Promise<void>;
  removeOrderItem: (orderId: string, orderItemId: string) => Promise<void>;
  completeOrder: (orderId: string) => Promise<void>;
};

const KEY_DATA = "@rm/data";

export const useDataStore = create<DataStore>((set, get) => ({
  menuItems: [
    {
      id: newId("m"),
      name: "Burger",
      price: 8.99,
      category: "Main",
      available: true,
    },
    {
      id: newId("m"),
      name: "Pizza",
      price: 12.5,
      category: "Main",
      available: true,
    },
    { id: newId("m"), name: "Coke", price: 2.5, category: "Drinks", available: true },
  ],
  tables: [
    { id: newId("t"), name: "Table 1", status: "available", activeOrderId: null },
    { id: newId("t"), name: "Table 2", status: "available", activeOrderId: null },
    { id: newId("t"), name: "Table 3", status: "available", activeOrderId: null },
  ],
  orders: [],

  hydrate: (s) => set(s),
  save: async () => {
    const { menuItems, tables, orders } = get();
    await storageSave(KEY_DATA, { menuItems, tables, orders });
  },

  // ------------------
  // MENU
  // ------------------
  addMenuItem: async (input) => {
    const newItem: MenuItem = { ...input, id: newId("m") };
    set({ menuItems: [...get().menuItems, newItem] });
    await get().save();
  },

  updateMenuItem: async (id, patch) => {
    set({
      menuItems: get().menuItems.map((m) =>
        m.id === id ? { ...m, ...patch } : m
      ),
    });
    await get().save();
  },

  deleteMenuItem: async (id) => {
    set({ menuItems: get().menuItems.filter((m) => m.id !== id) });
    await get().save();
  },

  // ------------------
  // TABLES
  // ------------------
  addTable: async (name) => {
    const t: Table = {
      id: newId("t"),
      name,
      status: "available",
      activeOrderId: null,
    };
    set({ tables: [...get().tables, t] });
    await get().save();
  },

  deleteTable: async (id) => {
    set({ tables: get().tables.filter((t) => t.id !== id) });
    await get().save();
  },

  bookTable: async (tableId) => {
    set({
      tables: get().tables.map((t) =>
        t.id === tableId ? { ...t, status: "booked" } : t
      ),
    });
    await get().save();
  },

  occupyTable: async (tableId) => {
    set({
      tables: get().tables.map((t) =>
        t.id === tableId ? { ...t, status: "occupied" } : t
      ),
    });
    await get().save();
  },

  releaseTable: async (tableId) => {
    set({
      tables: get().tables.map((t) =>
        t.id === tableId ? { ...t, status: "available", activeOrderId: null } : t
      ),
    });
    await get().save();
  },

  // ------------------
  // ORDERS
  // ------------------
  createOrderForTable: async (tableId) => {
    const order: Order = {
      id: newId("o"),
      tableId,
      items: [],
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    set({ orders: [order, ...get().orders] });
    set({
      tables: get().tables.map((t) =>
        t.id === tableId
          ? { ...t, status: "occupied", activeOrderId: order.id }
          : t
      ),
    });
    await get().save();
    return order.id;
  },

  addItemToOrder: async (orderId, menuItemId, quantity) => {
    set({
      orders: get().orders.map((o) => {
        if (o.id !== orderId) return o;
        const existing = o.items.find((it) => it.menuItemId === menuItemId);
        if (existing) {
          return {
            ...o,
            items: o.items.map((it) =>
              it.id === existing.id
                ? { ...it, quantity: it.quantity + quantity }
                : it
            ),
          };
        }
        const item: OrderItem = { id: newId("oi"), menuItemId, quantity };
        return { ...o, items: [...o.items, item] };
      }),
    });
    await get().save();
  },

  updateOrderItemQty: async (orderId, orderItemId, quantity) => {
    set({
      orders: get().orders.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          items: o.items.map((it) =>
            it.id === orderItemId ? { ...it, quantity } : it
          ),
        };
      }),
    });
    await get().save();
  },

  removeOrderItem: async (orderId, orderItemId) => {
    set({
      orders: get().orders.map((o) => {
        if (o.id !== orderId) return o;
        return { ...o, items: o.items.filter((it) => it.id !== orderItemId) };
      }),
    });
    await get().save();
  },

  completeOrder: async (orderId) => {
    const order = get().orders.find((o) => o.id === orderId);
    if (!order) return;
    set({
      orders: get().orders.map((o) =>
        o.id === orderId
          ? { ...o, status: "completed", completedAt: new Date().toISOString() }
          : o
      ),
    });
    set({
      tables: get().tables.map((t) =>
        t.id === order.tableId
          ? { ...t, status: "available", activeOrderId: null }
          : t
      ),
    });
    await get().save();
  },
}));