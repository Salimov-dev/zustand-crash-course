import "./App.css";
import Icons from "./components/icons";
import ValueContainer from "./components/value-container";
import ButtonsContainer from "./components/buttons-container";
import {
  completeTodo,
  deleteTodo,
  fetchTodos,
  useIsLoading,
  useTodos
} from "./store/use-todos-store";

function App() {
  const todos = useTodos();
  const isLoading = useIsLoading();

  return (
    <>
      <Icons />
      <ValueContainer />
      <ButtonsContainer />

      <button onClick={fetchTodos}>Загрузить todos</button>

      <div className="todos">
        <h1>Todo List</h1>

        {!isLoading ? (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className={todo.completed ? "completed" : ""}>
                <span
                  className={`todo-text ${
                    todo.completed ? "completed-text" : ""
                  }`}
                >
                  {todo.todo}
                </span>
                <div className="actions">
                  <button onClick={() => completeTodo(todo.id)}>
                    {todo.completed ? "✅" : "☑️"}
                  </button>
                  <button onClick={() => deleteTodo(todo.id)}>❌</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          "Загрузка..."
        )}
      </div>
    </>
  );
}

export default App;
