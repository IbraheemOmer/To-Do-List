import { useState } from "react";
import "./App.css";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

const initialTodos: Todo[] = [
  { id: "1", title: "Learn React", completed: true },
  { id: "2", title: "Learn JS", completed: false },
  { id: "3", title: "Learn HTML", completed: false },
];

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  function clearCompleted() {
    setTodos((todos) => todos.filter((todo) => !todo.completed));
  }

  function handleToggleTodoCompleted(id: string) {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });

    setTodos(updatedTodos);
  }

  function handleAddTodo(todo: Todo) {
    setTodos((todos) => [...todos, todo]);
  }

  function deleteTodo(id: string) {
    setTodos((todos) => todos.filter((todo) => todo.id !== id));
  }

  return (
    <div className="content">
      <h1>Todo List</h1>
      <AddForm onAddTodo={handleAddTodo} />
      <TodoList
        todos={todos}
        onClick={deleteTodo}
        onToggleTodo={handleToggleTodoCompleted}
        onClear={clearCompleted}
      />
    </div>
  );
}

function AddForm({ onAddTodo }: { onAddTodo: (todo: Todo) => void }) {
  const [addtodo, setAddTodo] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!addtodo) {
      return;
    }

    const id = crypto.randomUUID();

    const newTodo: Todo = {
      id,
      title: addtodo,
      completed: false,
    };

    onAddTodo(newTodo);

    setAddTodo("");
  }

  return (
    <form className="form" onSubmit={handleSubmit} onClick={handleSubmit}>
      <input
        type="text"
        value={addtodo}
        onChange={(e) => setAddTodo(e.target.value)}
        placeholder="Add Todo"
      />
      <Button>Add</Button>
    </form>
  );
}

function TodoList({
  todos,
  onClick,
  onToggleTodo,
  onClear,
}: {
  todos: Todo[];
  onClick: (id: string) => void;
  onToggleTodo: (id: string) => void;
  onClear: () => void;
}) {
  const [sort, setSort] = useState("All");
  let sortedTodos: Todo[];
  const completedTask = todos.filter((todo) => todo.completed).length;

  if (sort === "Active") {
    sortedTodos = todos.filter((todo) => !todo.completed);
  } else if (sort === "Completed") {
    sortedTodos = todos.filter((todo) => todo.completed);
  } else {
    sortedTodos = todos;
  }

  return (
    <ul className="todo-list">
      {sortedTodos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onClick={onClick}
          onToggleTodo={onToggleTodo}
        />
      ))}
      <div className="footer">
        <p>{completedTask} Tasks Completed</p>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>
        <Button onClick={onClear}>Clear Completed</Button>
      </div>
    </ul>
  );
}

function TodoItem({
  todo,
  onClick,
  onToggleTodo,
}: {
  todo: Todo;
  onClick: (id: string) => void;
  onToggleTodo: (id: string) => void;
}) {
  return (
    <li>
      <div>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggleTodo(todo.id)}
        />
        {todo.title}
      </div>
      <Button onClick={() => onClick(todo.id)}>🗑️</Button>
    </li>
  );
}

function Button({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button type="button" className="button" onClick={onClick}>
      {children}
    </button>
  );
}
