import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export const MyPage = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const [notifications, setNotifications] = useState(true);
  const [selectedChar, setSelectedChar] = useState('うさぎ');

  // ✅ APIからユーザー取得（UI変更なし・ロジックのみ追加）
  useEffect(() => {
    const fetchUser = async () => {
      const savedLogin = localStorage.getItem("isLoggedIn");

      if (savedLogin === "true") {
        setIsLoggedIn(true);

        try {
          const res = await fetch("http://localhost:8000/users/1");
          const data = await res.json();

          setUserName(data.name);
        } catch (err) {
          console.log("ユーザー取得エラー");
        }
      }
    };

    fetchUser();

    // ✅ 戻ってきたとき更新
    window.addEventListener("focus", fetchUser);

    return () => {
      window.removeEventListener("focus", fetchUser);
    };
  }, []);

  const cardStyle = {
    backgroundColor: '#FFF',
    border: '3px solid #333',
    borderRadius: '16px',
    padding: '16px', 
    boxShadow: '4px 4px 0px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    gap: '12px',
    height: '100%', 
    boxSizing: 'border-box' as const
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
      
      {/* ページタイトル */}
      <h2 style={{ 
        textAlign: 'center', 
        color: '#333', 
        borderBottom: '4px dashed #FF9F1C', 
        paddingBottom: '8px',
        margin: 0,
        fontSize: '20px'
      }}>
        👤 マイページ
      </h2>

      {/* グリッド */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '16px', 
        flexGrow: 1
      }}>
        
        {/* 1. ログインエリア */}
        <div style={cardStyle}>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#666', textAlign: 'center' }}>アカウント</h3>

          {isLoggedIn ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                {userName} 様
              </span>

              <button 
                onClick={() => {
                  localStorage.removeItem("isLoggedIn");
                  setIsLoggedIn(false);
                  setUserName("");
                }}
                style={{ padding: '6px 12px', borderRadius: '12px', border: '2px solid #333', backgroundColor: '#e0e0e0', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
              >
                ログアウト
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#666', textAlign: 'center' }}>
                データを保存！
              </p>

              <button 
                onClick={() => navigate("/account")}
                style={{ padding: '8px 12px', borderRadius: '12px', border: '2px solid #333', backgroundColor: '#FF9F1C', color: '#FFF', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', boxShadow: '2px 2px 0px #333' }}
              >
                ログイン / 登録
              </button>
            </div>
          )}
        </div>

        {/* 2. キャラ選択エリア */}
        <div style={cardStyle}>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#666', textAlign: 'center' }}>パートナー</h3>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {['うさぎ', 'くま', 'ねこ'].map((char) => (
              <button
                key={char}
                onClick={() => setSelectedChar(char)}
                style={{
                  padding: '8px',
                  borderRadius: '50%',
                  width: '44px',
                  height: '44px',
                  border: selectedChar === char ? '3px solid #FF9F1C' : '2px solid #ccc',
                  backgroundColor: selectedChar === char ? '#FFF5EE' : '#FFF',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  boxShadow: selectedChar === char ? '2px 2px 0px #333' : 'none',
                  transition: '0.2s'
                }}
              >
                {char}
              </button>
            ))}
          </div>
          <p style={{ textAlign: 'center', margin: '4px 0 0', fontWeight: 'bold', fontSize: '12px' }}>
            いま: <span style={{ color: '#FF9F1C' }}>{selectedChar}</span>
          </p>
        </div>

        {/* 3. 実績 */}
        <div style={cardStyle}>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#666', textAlign: 'center' }}>実績</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
            <li style={{ padding: '8px', backgroundColor: '#FFF5EE', border: '2px solid #333', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px' }}>
              🌟 初めてのToDoクリア！
            </li>
            <li style={{ padding: '8px', backgroundColor: '#FFF5EE', border: '2px solid #333', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px' }}>
              💻 基本情報技術者の勉強を1時間達成！
            </li>
          </ul>
        </div>

        {/* 4. 通知設定 */}
        <div style={cardStyle}>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#666', textAlign: 'center' }}>通知設定</h3>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '12px', textAlign: 'center' }}>アプリ通知</span>
            <button 
              onClick={() => setNotifications(!notifications)}
              style={{
                padding: '6px 20px',
                borderRadius: '20px',
                border: '2px solid #333',
                backgroundColor: notifications ? '#4CAF50' : '#ccc',
                color: '#FFF',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '2px 2px 0px #333'
              }}
            >
              {notifications ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};