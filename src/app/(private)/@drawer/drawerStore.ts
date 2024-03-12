import { createStore } from "zustand/vanilla";

interface State {
  isOpen: boolean;
}

interface Actions {
  open: (isOpen?: boolean) => void;
}

export type DrawerStore = Actions & State;

export const defaultInitState: State = {
  isOpen: false,
};

export const createDrawerStore = (initState: State = defaultInitState) =>
  createStore<DrawerStore>(set => ({
    ...initState,
    open: (isOpen = true) => set({ isOpen }),
  }));
