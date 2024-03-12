"use client";

import { createContext, type PropsWithChildren, useContext, useRef } from "react";
import { type StoreApi, useStore } from "zustand";

import { createDrawerStore, type DrawerStore } from "./drawerStore";

export const DrawerStoreContext = createContext<StoreApi<DrawerStore> | null>(null);

export const DrawerStoreProvider = ({ children }: PropsWithChildren) => {
  const storeRef = useRef<StoreApi<DrawerStore>>();
  if (!storeRef.current) {
    storeRef.current = createDrawerStore();
  }

  return <DrawerStoreContext.Provider value={storeRef.current}>{children}</DrawerStoreContext.Provider>;
};

export const useDrawerStore = <T,>(selector: (store: DrawerStore) => T): T => {
  const counterStoreContext = useContext(DrawerStoreContext);

  if (!counterStoreContext) {
    throw new Error(`useDrawerStore must be use within DrawerStoreProvider`);
  }

  return useStore(counterStoreContext, selector);
};
