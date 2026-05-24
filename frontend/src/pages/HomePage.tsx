import { useState, useEffect, useRef } from 'react';

export const HomePage = () => {
  const [userName] = useState("ゲストユーザー");
  const [todoProgress, setTodoProgress] = useState(100); 
  const [points] = useState(120);

  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [streak, setStreak] = useState(0);

  // ✅ 確定キャラ
  const [selectedChar, setSelectedChar] = useState("");
  const [selectedCloth, setSelectedCloth] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("daily") || "{}");

    data[today] = todoProgress;
    localStorage.setItem("daily", JSON.stringify(data));

    const days = Object.keys(data).sort().reverse();

    let count = 0;
    let currentDate = new Date();

    for (let i = 0; i < days.length; i++) {
      const dayStr = currentDate.toISOString().split("T")[0];

      if (data[dayStr] === 100) {
        count++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    setStreak(count);
  }, [todoProgress]);

  // ✅ キャラ取得
  useEffect(() => {
    const saved = localStorage.getItem("characterFinal");
    if (saved) {
      setSelectedChar(saved);
    }
  }, []);

  // ✅ 状態
  const getCharacterStatus = (progress: number) => {
    if (progress >= 81) {
      return { key: 'cho_kenko', statusText: 'ちょうけんこう！' }; 
    } else if (progress >= 61) {
      return { key: 'futsu', statusText: 'ふつう' };             
    } else if (progress >= 41) {
      return { key: 'genki_nai', statusText: 'げんきがない...' };     
    } else if (progress >= 21) {
      return { key: 'yatsureteru', statusText: 'めっちゃやつれてる' }; 
    } else if (progress >= 1) {
      return { key: 'shinikake', statusText: 'しにかけ...' };         
    } else {
      return { key: 'ohaka', statusText: 'おはか...' };           
    }
  };

  const currentStatus = getCharacterStatus(todoProgress);

  // ✅ キャラprefix
  const getPrefix = () => {
      let prefix = "";
      if (selectedChar === "ギャル") prefix = "gal_";
      if (selectedChar === "デフォ") prefix = "sisso_";
       if (selectedChar === "天使ギャル") return "tensi_";
      if (selectedCloth === "天使") {
      return "tensi_";
      }

      return prefix;
  };

  // ✅ 最終動画
  const finalVideoSrc = `/videos/${getPrefix()}${currentStatus.key}.mp4`;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(err => console.log("自動再生ブロックの回避:", err));
    }
  }, [finalVideoSrc]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      gap: '24px',
      position: 'relative',
      background: `
        repeating-linear-gradient(0deg, transparent, transparent 20px, #B3E5FC 20px, #B3E5FC 40px),
        repeating-linear-gradient(90deg, transparent, transparent 20px, #B3E5FC 20px, #B3E5FC 40px),
        #FFFFFF
      `,
      backgroundBlendMode: 'multiply',
      padding: '24px',
      borderRadius: '20px',
      border: '3px solid #333', 
      boxShadow: '4px 4px 0px rgba(0,0,0,0.1)' 
    }}>
      
      {/* 🔥 ストリーク */}
      <div style={{
        position: 'absolute',
        top: '70px',
        right: '70px',
        backgroundColor: '#FFF',
        border: '2px solid #333',
        borderRadius: '12px',
        padding: '6px 14px',
        fontWeight: 'bold',
        fontSize: '13px',
        boxShadow: '2px 2px 0px #333',
        zIndex: 10
      }}>
        🔥 連続達成 {streak}日
      </div>

      {/* 上部 */}
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <div style={{ 
          backgroundColor: '#FFF', 
          border: '2px solid #333', 
          borderRadius: '12px', 
          padding: '6px 16px',
          fontWeight: 'bold',
          fontSize: '14px',
          boxShadow: '2px 2px 0px #333',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>👤</span> {userName}
        </div>
      </div>

      {/* メイン */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        flexWrap: 'wrap',     
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '40px', 
        flexGrow: 1,
        margin: '20px 0'
      }}>
        
        {/* キャラ */}
        <div style={{
          width: '380px',
          height: '380px',
          flexShrink: 0, 
          backgroundColor: '#FFF', 
          borderRadius: '16px', 
          border: '4px solid #333',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',       
          boxShadow: 'inset 4px 4px 0px rgba(0,0,0,0.1), 4px 4px 0px #333',
        }}>
          <video
            ref={videoRef}
            src={finalVideoSrc}
            loop       
            muted      
            playsInline 
            style={{
              width: '100%',  
              height: '100%', 
              objectFit: 'cover' 
            }}
          />
        </div>

        {/* 右UI（完全そのまま） */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '24px', minWidth: '280px' }}>
          
          <div style={{ width: '100%', maxWidth: '280px' }}>
            <div style={{ 
              fontWeight: 'bold', 
              marginBottom: '8px', 
              fontSize: '16px',
              color: '#333',
              textShadow: '1px 1px 0 #FFF, -1px -1px 0 #FFF, 1px -1px 0 #FFF, -1px 1px 0 #FFF'
            }}>
              💖 けんこうメーター <span style={{ color: '#FF9F1C' }}>{todoProgress}%</span>
            </div>
            
            <div style={{
              width: '100%',
              height: '24px',
              backgroundColor: '#FFF',
              border: '3px solid #333',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '2px 2px 0px #333'
            }}>
              <div style={{
                width: `${todoProgress}%`,
                height: '100%',
                backgroundColor: '#FF9F1C'
              }} />
            </div>
          </div>

          <div style={{
            fontSize: '15px', 
            fontWeight: 'bold', 
            color: '#333', 
            backgroundColor: '#FFF',
            border: '2px solid #333',
            borderRadius: '12px',
            padding: '8px 16px',
            boxShadow: '2px 2px 0px #333'
          }}>
            状態: <span style={{ color: '#FF9F1C' }}>{currentStatus.statusText}</span>
          </div>

          <div style={{
            fontSize: '16px', 
            fontWeight: 'bold', 
            color: '#333', 
            backgroundColor: '#FFF',
            border: '2px solid #333',
            borderRadius: '12px',
            padding: '8px 16px',
            boxShadow: '2px 2px 0px #333',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🪙 所持ポイント: <span style={{ color: '#FF9F1C' }}>{points}</span>
          </div>

        </div>

      </div>

      {/* ボタン */}
      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <button onClick={() => setTodoProgress(prev => prev >= 100 ? 100 : prev + 20)}>
          ➕ 健康になる
        </button>

        <button onClick={() => setTodoProgress(prev => prev <= 0 ? 0 : prev - 20)}>
          ➖ やつれる
        </button>
      </div>

    </div>
  );
};