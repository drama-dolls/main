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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: "12px" }}>
      <h2>ログイン</h2>
      <input
        placeholder="ユーザー名"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: "8px", fontSize: "16px", borderRadius: "8px", border: "2px solid #333" }}
      />
      <input
        placeholder="パスワード"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "8px", fontSize: "16px", borderRadius: "8px", border: "2px solid #333" }}
      />
      <button onClick={handleLogin} style={{ padding: "8px 24px", fontSize: "16px", borderRadius: "8px", border: "2px solid #333", backgroundColor: "#FF9F1C", color: "#FFF", cursor: "pointer", fontWeight: "bold" }}>
        ログイン
      </button>
      <button onClick={handleRegister} style={{ padding: "8px 24px", fontSize: "16px", borderRadius: "8px", border: "2px solid #333", backgroundColor: "#FFF", cursor: "pointer", fontWeight: "bold" }}>
        新規登録
      </button>
    </div>
  );
}
