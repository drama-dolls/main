import { useEffect, useState } from "react";
import { api } from "../api/client";

export function HomePage() {
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

export default HomePage;
