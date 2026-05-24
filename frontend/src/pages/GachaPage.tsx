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
          <p>
            {result.costume_name}（{result.rarity}）
          </p>
          <p>残りPT: {result.allowance_pt}</p>
        </div>
      )}
    </div>
  );
}
