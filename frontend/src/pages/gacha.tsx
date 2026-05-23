import { useRef, useState } from 'react';

const GachaPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // 表示・テスト用のポイント（30未満にするとポイント不足モードになります）
  const [points] = useState(120); 

  const handlePlayGacha = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0; // 先頭にリセット
      videoRef.current.play();          // 再生
    }
  };

  return (
    <div style={{ 
      // --- 既存のスタイル ---
      textAlign: 'center', 
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: '"DotGothic16", monospace', // ドット絵風フォント

      // --- ★追加：画面全体に広げる ---
      height: '100%', 
      width: '100%',
      boxSizing: 'border-box' as const, // パディングを含める

      // --- ★追加：レンガ背景 (public/images/brick_background.png) ---
      backgroundImage: 'url("/photo/brick_background.png")', // 画像を読み込む
      backgroundRepeat: 'repeat', // レンガ模様を敷き詰める
      backgroundSize: 'auto',   // レンガの大きさ (自動)
      backgroundPosition: 'center', // 中央合わせ
      backgroundAttachment: 'fixed' as const, // 画面中央に固定 (画面が縦に長い場合に効果的)
    }}>
      {/* Google Fontsからドット絵フォント（DotGothic16）を読み込む設定 (既存) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DotGothic16&display=swap');
      `}</style>

      {/* 画面タイトル (既存) */}
      <h2 style={{ 
        color: '#333', 
        fontSize: '36px', 
        marginTop: 0,
        marginBottom: '32px',
        fontWeight: 'bold',
        letterSpacing: '2px'
      }}>
        🎰 ガチャ
      </h2>
      
      {/* メインレイアウト（左右2分割） (既存) */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        flexWrap: 'wrap',
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '40px', 
        width: '100%',
        maxWidth: '900px', 
      }}>
        
        {/* 【左側】動画表示エリア (既存) */}
        <div style={{ 
          width: '380px', 
          height: '380px', 
          flexShrink: 0, 
          border: '4px solid #333', 
          borderRadius: '16px', 
          overflow: 'hidden',
          backgroundColor: '#FFF', 
          boxShadow: '4px 4px 0px rgba(0,0,0,0.1)'
        }}>
          <video
            ref= {videoRef}
            src="/videos/gacha.mp4"
            muted
            style= {{ width: '100%', height: '100%', objectFit: 'cover' }}
            onEnded= {(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0; 
            }}
          />
        </div>

        {/* 【右側】所持ポイント ＆ ボタン エリア（縦並び） (既存) */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-start', 
          gap: '28px', 
          minWidth: '320px'
        }}>
          
          {/* ① 所持ポイント表示ラベル (既存) */}
          <div style={{ 
            fontSize: '23px', 
            fontWeight: 'bold', 
            color: '#333',
            backgroundColor: '#FFF', 
            border: '2px solid #333', 
            borderRadius: '12px', 
            padding: '16px 24px', 
            boxShadow: '2px 2px 0px #333',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}>
            <span>🪙</span> 所持ポイント: 
            <span style={{ color: points < 30 ? '#FF0000' : '#FF9F1C', fontSize: '27px', fontWeight: 'bold' }}>
              {points} PT
            </span>
            {points < 30 && (
              <span style={{ color: '#FF0000', fontSize: '18px', marginLeft: '6px' }}>（不足）</span>
            )}
          </div>

          {/* ② ガチャを引くボタン (既存) */}
          <button 
            onClick= {handlePlayGacha}
            style= {{ 
              padding: '12px 24px', fontSize: '18px', fontWeight: 'bold',
              backgroundColor: '#FF9F1C', border: '3px solid #333', 
              borderRadius: '12px', cursor: 'pointer', boxShadow: '4px 4px 0px #333'
            }}
          >
            🎰 ガチャを引く！
          </button>
        </div>

      </div>

    </div>
  );
};

export default GachaPage;