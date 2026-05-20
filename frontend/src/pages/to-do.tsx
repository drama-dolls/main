import { useEffect, useState } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  // ✅ 初回ロード時：localStorageから読み込み
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  // ✅ todosが変わるたびに保存
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // 追加
  const addTodo = () => {
    if (!input.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      text: input,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInput("");
  };

  // チェック切り替え
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  // 削除
  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* ヘッダー */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={() => window.history.back()}>← 戻る</button>
        <h2>ToDoリスト</h2>
        <div style={{ width: "50px" }} /> {/* 位置調整 */}
      </div>

      {/* ✅ 入力フォーム */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="タスクを入力"
          style={{ flex: 1 }}
        />
        <button onClick={addTodo}>追加</button>
      </div>

      {/* ✅ リスト */}
      <div style={{ marginTop: "20px" }}>
        {todos.map((todo) => (
          <div
            key={todo.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span
                style={{
                  marginLeft: "10px",
                  textDecoration: todo.completed
                    ? "line-through"
                    : "none",
                }}
              >
                {todo.text}
              </span>
            </label>

            {/* ✅ 削除ボタン */}
            <button onClick={() => deleteTodo(todo.id)}>削除</button>
          </div>
        ))}
      </div>
    </div>
  );
}
``