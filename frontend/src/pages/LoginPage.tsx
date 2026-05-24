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
