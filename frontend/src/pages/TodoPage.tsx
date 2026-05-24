import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function TodoPage() {
  const [data, setData] = useState<any>(null);
  const [title, setTitle] = useState("");

  const load = () => api.getTasks().then(setData);

  useEffect(() => {
    load();
  }, []);

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
      <p>
        進捗: {data.progress.done} / {data.progress.total}
      </p>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タスクを追加"
      />
      <button onClick={handleAdd}>追加</button>

      {data.tasks.map((task: any) => (
        <div key={task.id}>
          <input
            type="checkbox"
            checked={task.is_done}
            onChange={() => handleToggle(task.id, task.is_done)}
          />
          <span>{task.title}</span>
          <button onClick={() => handleDelete(task.id)}>削除</button>
        </div>
      ))}
    </div>
  );
}
