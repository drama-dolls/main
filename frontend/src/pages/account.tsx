import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AccountPage() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name) {
      alert("名前を入力してね！");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name
        })
      });

      const data = await res.json();

      // ✅ ローカルにも保存（UI用）
      localStorage.setItem("isLoggedIn", "true");

      alert("登録成功！");
      navigate("/mypage");

    } catch (err) {
      alert("登録失敗（APIエラー）");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", height: "100%", justifyContent: "center" }}>
      <h2>アカウント登録</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="名前を入力"
      />

      <button onClick={handleRegister}>
        登録する
      </button>
    </div>
  );
}