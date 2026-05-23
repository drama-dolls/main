import { useState } from 'react';

export const MyPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [selectedChar, setSelectedChar] = useState('うさぎ');

  // ★追加：キャラクターの情報（アイコンの絵文字と、右側に表示する画像用の背景色）
  // ※ 後で本物の画像にする場合は、ここに img: '/images/rabbit.png' のように追加して使います
  const characters: Record<string, { emoji: string; color: string }> = {
    'うさぎ': { emoji: '🐰', color: '#FFB6C1' }, // ピンク
    'くま': { emoji: '🐻', color: '#FFDAB9' }, // オレンジ系
    'ねこ': { emoji: '🐱', color: '#E6E6FA' }, // 薄い紫
  };

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

      {/* 2x2のグリッドレイアウト */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gridTemplateRows: '1fr 1fr',    
        gap: '16px', 
        flexGrow: 1                     
      }}>
        
        {/* 1. ログインエリア（左上） */}
        <div style={cardStyle}>
          <h3 style={{ margin: 0, fontSize: '14px', color: '#666', textAlign: 'center' }}>アカウント</h3>
          {isLoggedIn ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>アッキー 様</span>
              <button 
                onClick={() => setIsLoggedIn(false)}
                style={{ padding: '6px 12px', borderRadius: '12px', border: '2px solid #333', backgroundColor: '#e0e0e0', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
              >
                ログアウト
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#666', textAlign: 'center' }}>データを保存！</p>
              <button 
                onClick={() => setIsLoggedIn(true)}
                style={{ padding: '8px 12px', borderRadius: '12px', border: '2px solid #333', backgroundColor: '#FF9F1C', color: '#FFF', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', boxShadow: '2px 2px 0px #333' }}
              >
                ログイン / 登録
              </button>
            </div>
          )}
        </div>

        {/* 2. ★変更：キャラ選択エリア（右上） */}
        <div style={{...cardStyle, justifyContent: 'flex-start'}}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
            
            {/* 【左側】文字と選択アイコン */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: '14px', color: '#666' }}>キャラクター選択</h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {Object.keys(characters).map((char) => (
                  <button
                    key={char}
                    onClick={() => setSelectedChar(char)}
                    style={{
                      padding: '0',
                      borderRadius: '50%',
                      width: '42px',
                      height: '42px',
                      border: selectedChar === char ? '3px solid #FF9F1C' : '2px solid #ccc',
                      backgroundColor: selectedChar === char ? '#FFF5EE' : '#FFF',
                      cursor: 'pointer',
                      fontSize: '20px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      boxShadow: selectedChar === char ? '2px 2px 0px #333' : 'none',
                      transition: '0.2s',
                      transform: selectedChar === char ? 'scale(1.1)' : 'scale(1)' // 選ばれているものは少し大きく
                    }}
                  >
                    {characters[char].emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* 【右側】四角いキャラクター画像 */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '12px',
              border: '3px solid #333',
              backgroundColor: characters[selectedChar].color,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '40px',
              boxShadow: 'inset 2px 2px 0px rgba(255,255,255,0.5), 2px 2px 0px #333',
              flexShrink: 0,
              marginLeft: '8px'
            }}>
              {/* ★本物の画像を使いたい場合は、ここの絵文字を消して <img src="..." /> を入れます */}
              {characters[selectedChar].emoji}
            </div>
            
          </div>
        </div>

        {/* 3. 実績確認エリア（左下） */}
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

        {/* 4. 通知設定エリア（右下） */}
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