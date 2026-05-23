import { useEffect, useState } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
  rewarded: boolean;
};

const MAX_DAILY_POINTS = 100;

export default function TodoPage() {
  // ✅ 初期読み込み（画面切替でリセットされない）
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem("points");
    return saved ? Number(saved) : 0;
  });

  const [dailyPoints, setDailyPoints] = useState(() => {
    const saved = localStorage.getItem("dailyPoints");
    return saved ? Number(saved) : 0;
  });

  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  // ✅ 日付リセット
  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("lastDate");

    if (savedDate !== today) {
      setDailyPoints(0);
      localStorage.setItem("lastDate", today);
    }
  }, []);

  // ✅ 自動保存
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("points", String(points));
  }, [points]);

  useEffect(() => {
    localStorage.setItem("dailyPoints", String(dailyPoints));
  }, [dailyPoints]);

  // ✅ エラー自動消滅（3秒）
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // ✅ タスク追加（重複防止）
  const addTodo = () => {
    if (!input.trim()) return;

    const exists = todos.some(
      (todo) =>
        todo.text.trim().toLowerCase() ===
        input.trim().toLowerCase()
    );

    if (exists) {
      setError("同じタスクがあります！");
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      text: input,
      completed: false,
      rewarded: false,
    };

    setTodos((prev) => [...prev, newTodo]);
    setInput("");
    setError("");
  };

  // ✅ チェック（ポイント加算）
  const toggleTodo = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === id) {
          const updated = {
            ...todo,
            completed: !todo.completed,
          };

          if (
            !todo.completed &&
            !todo.rewarded &&
            dailyPoints < MAX_DAILY_POINTS
          ) {
            setPoints((p) => p + 10);
            setDailyPoints((p) =>
              Math.min(p + 10, MAX_DAILY_POINTS)
            );
            updated.rewarded = true;
          }

          return updated;
        }
        return todo;
      })
    );
  };

  // ✅ 削除
  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* ヘッダー */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={() => window.history.back()}>← 戻る</button>
        <h2>ToDoリスト</h2>
        <div style={{ width: "50px" }} />
      </div>

      {/* ✅ エラー表示 */}
      {error && (
        <div
          style={{
            background: "#ffe0e0",
            color: "#d00",
            padding: "10px",
            borderRadius: "10px",
            marginTop: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* ✅ ポイント表示 */}
      <div
        style={{
          marginTop: "10px",
          padding: "12px",
          background: "#f5f5f5",
          borderRadius: "12px",
        }}
      >
        <h3>ポイント: {points}</h3>
        <p>
          今日のポイント: {dailyPoints} / {MAX_DAILY_POINTS}
        </p>

        {/* ✅ ゲージ */}
        <div
          style={{
            height: "10px",
            background: "#ddd",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${(dailyPoints / MAX_DAILY_POINTS) * 100}%`,
              height: "100%",
              background: "green",
            }}
          />
        </div>
      </div>

      {/* ✅ 入力 */}
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

            <button onClick={() => deleteTodo(todo.id)}>
              削除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}