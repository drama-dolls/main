# フロントエンド実装ガイド

## 作成・変更が必要なファイル一覧

```
frontend/src/
├── api/
│   └── client.ts       ← 新規作成
├── pages/
│   ├── LoginPage.tsx   ← 新規作成
│   ├── HomePage.tsx    ← 新規作成
│   ├── TodoPage.tsx    ← 新規作成
│   ├── GachaPage.tsx   ← 新規作成
│   └── MyPage.tsx      ← 新規作成
└── App.tsx             ← 変更
```

---

## src/api/client.ts

```typescript
const BASE_URL = "http://localhost:8000";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const api = {
  register: (username: string, password: string) =>
    fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, password }),
    }).then((r) => r.json()),

  login: (username: string, password: string) =>
    fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, password }),
    }).then((r) => r.json()),

  getSummary: () =>
    fetch(`${BASE_URL}/summary`, { headers: authHeaders() }).then((r) => r.json()),

  getTasks: () =>
    fetch(`${BASE_URL}/tasks`, { headers: authHeaders() }).then((r) => r.json()),

  createTask: (title: string, is_routine: boolean) =>
    fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ title, is_routine }),
    }).then((r) => r.json()),

  updateTask: (id: number, is_done: boolean) =>
    fetch(`${BASE_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ is_done }),
    }).then((r) => r.json()),

  deleteTask: (id: number) =>
    fetch(`${BASE_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then((r) => r.json()),

  pullGacha: () =>
    fetch(`${BASE_URL}/gacha/pull`, {
      method: "POST",
      headers: authHeaders(),
    }).then((r) => r.json()),

  getMyCostumes: () =>
    fetch(`${BASE_URL}/gacha/costumes`, { headers: authHeaders() }).then((r) => r.json()),

  getMyCharacters: () =>
    fetch(`${BASE_URL}/users/me/characters`, { headers: authHeaders() }).then((r) => r.json()),

  updateSelection: (character_id: number, costume_id?: number) =>
    fetch(`${BASE_URL}/users/me/selection`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ character_id, costume_id }),
    }).then((r) => r.json()),
};
```

---

## src/pages/LoginPage.tsx

```tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const data = await api.login(username, password);
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      navigate("/");
    } else {
      alert("ログイン失敗");
    }
  };

  const handleRegister = async () => {
    await api.register(username, password);
    await handleLogin();
  };

  return (
    <div>
      <input placeholder="ユーザー名" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="パスワード" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>ログイン</button>
      <button onClick={handleRegister}>新規登録</button>
    </div>
  );
}
```

---

## src/pages/HomePage.tsx

```tsx
import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function HomePage() {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    api.getSummary().then(setSummary);
  }, []);

  if (!summary) return <div>読み込み中...</div>;

  return (
    <div>
      <p>{summary.user.username}</p>
      <p>おこづかいPT: {summary.user.allowance_pt}</p>
      <p>けんこうメーター: {summary.user.health_meter}%</p>
      <p>タスク: {summary.progress.done} / {summary.progress.total}</p>

      {summary.selection.video_url ? (
        <video src={summary.selection.video_url} autoPlay loop muted />
      ) : (
        <p>キャラクターを選択してください</p>
      )}
    </div>
  );
}
```

---

## src/pages/TodoPage.tsx

```tsx
import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function TodoPage() {
  const [data, setData] = useState<any>(null);
  const [title, setTitle] = useState("");

  const load = () => api.getTasks().then(setData);

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!title) return;
    await api.createTask(title, false);
    setTitle("");
    load();
  };

  const handleToggle = async (id: number, is_done: boolean) => {
    await api.updateTask(id, !is_done);
    load();
  };

  const handleDelete = async (id: number) => {
    await api.deleteTask(id);
    load();
  };

  if (!data) return <div>読み込み中...</div>;

  return (
    <div>
      <p>進捗: {data.progress.done} / {data.progress.total}</p>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="タスクを追加" />
      <button onClick={handleAdd}>追加</button>

      {data.tasks.map((task: any) => (
        <div key={task.id}>
          <input type="checkbox" checked={task.is_done} onChange={() => handleToggle(task.id, task.is_done)} />
          <span>{task.title}</span>
          <button onClick={() => handleDelete(task.id)}>削除</button>
        </div>
      ))}
    </div>
  );
}
```

---

## src/pages/GachaPage.tsx

```tsx
import { useState } from "react";
import { api } from "../api/client";

export default function GachaPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleGacha = async () => {
    const data = await api.pullGacha();
    if (data.detail) {
      setError(data.detail);
    } else {
      setResult(data);
      setError("");
    }
  };

  return (
    <div>
      <button onClick={handleGacha}>ガチャを引く（30PT）</button>
      {error && <p>{error}</p>}
      {result && (
        <div>
          <p>{result.costume_name}（{result.rarity}）</p>
          <p>残りPT: {result.allowance_pt}</p>
        </div>
      )}
    </div>
  );
}
```

---

## src/pages/MyPage.tsx

```tsx
import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function MyPage() {
  const [characters, setCharacters] = useState<any[]>([]);

  useEffect(() => {
    api.getMyCharacters().then(setCharacters);
  }, []);

  const handleSelect = async (character_id: number) => {
    await api.updateSelection(character_id);
    alert("キャラクターを変更しました");
  };

  return (
    <div>
      <h2>所持キャラクター</h2>
      {characters.map((c) => (
        <div key={c.character_id}>
          <span>{c.name}</span>
          <button onClick={() => handleSelect(c.character_id)}>選択</button>
        </div>
      ))}
    </div>
  );
}
```

---

## src/App.tsx（変更）

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import TodoPage from './pages/TodoPage';
import GachaPage from './pages/GachaPage';
import MyPage from './pages/MyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="todo" element={<TodoPage />} />
          <Route path="gacha" element={<GachaPage />} />
          <Route path="mypage" element={<MyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```
