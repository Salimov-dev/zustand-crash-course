import { create, type StateCreator } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface IActions {
  increment: () => void;
  decrement: () => void;
}

interface IInitialState {
  count: number;
  newCount: number;
}

interface ICounterState extends IInitialState, IActions {}

const initialState: IInitialState = {
  count: 0,
  newCount: 5
};

const counterStore: StateCreator<
  ICounterState,
  [["zustand/devtools", never], ["zustand/persist", unknown]]
> = (set) => ({
  ...initialState,
  increment: () =>
    set((state) => ({ count: state.count + 1 }), false, "increment"),
  decrement: () =>
    set((state) => ({ count: state.count - 1 }), false, "decrement")
});

const useCounterStore = create<ICounterState>()(
  devtools(
    persist(counterStore, {
      name: "counter-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ count: state.count })
    })
  )
);

// Селекторы
export const useCount = () => useCounterStore((state) => state.count);
export const incrementCount = () => useCounterStore.getState().increment;
export const decrementCount = () => useCounterStore.getState().decrement;
