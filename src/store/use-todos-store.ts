import { create, type StateCreator } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface ITodo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

interface IActions {
  fetchTodos: () => Promise<void>;
  completeTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

interface IInitialState {
  todos: ITodo[];
  isLoading: boolean;
}

interface ITodoState extends IInitialState, IActions {}

const initialState: IInitialState = {
  todos: [],
  isLoading: false
};

const todoStore: StateCreator<
  ITodoState,
  [
    ["zustand/immer", never],
    ["zustand/devtools", never],
    ["zustand/persist", unknown]
  ]
> = (set) => ({
  ...initialState,
  fetchTodos: async () => {
    set({ isLoading: true }, false, "fetchTodos");

    try {
      const response = await fetch("https://dummyjson.com/todos?limit=10");
      const data = await response.json();

      set({ todos: data.todos }, false, "fetchTodos/success");
    } catch (error) {
      console.log("Error fetching todos:", error);

      set({ todos: [] }, false, "fetchTodos/failed");
    } finally {
      set({ isLoading: false }, false, "fetchTodos/finally");
    }
  },
  completeTodo: (id: number) => {
    set(
      (state) => {
        const todo = state.todos.find((todo) => todo.id === id);

        if (todo) {
          todo.completed = !todo.completed;
        }
      },
      false,
      "completeTodo"
    );
  },
  deleteTodo: (id: number) => {
    set(
      (state) => {
        const index = state.todos.findIndex((todo: ITodo) => todo.id === id);

        if (index !== -1) {
          state.todos.splice(index, 1);
        }
      },
      false,
      "deleteTodo"
    );
  }
});

const useTodoStore = create<ITodoState>()(
  immer(
    devtools(
      persist(todoStore, {
        name: "todo-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ todos: state.todos })
      })
    )
  )
);

// Селекторы
export const useTodos = () => useTodoStore((state) => state.todos);
export const useIsLoading = () => useTodoStore((state) => state.isLoading);
export const fetchTodos = () => useTodoStore.getState().fetchTodos();
export const completeTodo = (id: number) =>
  useTodoStore.getState().completeTodo(id);
export const deleteTodo = (id: number) =>
  useTodoStore.getState().deleteTodo(id);
