import { useState, useEffect, useRef } from 'react';

export const HomePage = () => {
  const [userName] = useState("ゲストユーザー");
  const [todoProgress, setTodoProgress] = useState(100); 
  const [points] = useState(120);

  const videoRef = useRef<HTMLVideoElement>(null);

  const getCharacterStatus = (progress: number) => {
    if (progress >= 81) {
      return { videoSrc: '/videos/cho_kenko.mp4', statusText: 'ちょうけんこう！' }; 
    } else if (progress >= 61) {
      return { videoSrc: '/videos/futsu.mp4', statusText: 'ふつう' };             
    } else if (progress >= 41) {
      return { videoSrc: '/videos/genki_nai.mp4', statusText: 'げんきがない...' };     
    } else if (progress >= 21) {
      return { videoSrc: '/videos/yatsure.mp4', statusText: 'めっちゃやつれてる' }; 
    } else if (progress >= 1) {
      return { videoSrc: '/videos/shinikake.mp4', statusText: 'しにかけ...' };         
    } else {
      return { videoSrc: '/videos/ohaka.mp4', statusText: 'おはか...' };           
    }
  };

  const currentStatus = getCharacterStatus(todoProgress);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(err => console.log("自動再生ブロックの回避:", err));
    }
  }, [currentStatus.videoSrc]);

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
      
      {/* 1. 上部情報バー */}
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

      {/* 2. メインレイアウトエリア */}
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
        
        {/* 【左側】キャラクターエリア */}
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
            src={currentStatus.videoSrc}
            loop       
            playsInline 
            style={{
              width: '100%',  
              height: '100%', 
              objectFit: 'cover' 
            }}
          />
        </div>

        {/* 【右側】メーター・ポイントエリア（★並び順を入れ替えました） */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '24px', minWidth: '280px' }}>
          
          {/* ① 健康メーター（一番上に移動） */}
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
                backgroundColor: '#FF9F1C',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </div>
          </div>

          {/* ② 状態テキスト（二番目に移動） */}
          <div style={{ 
            fontSize: '15px', 
            fontWeight: 'bold', 
            color: '#333', 
            // ★変更：白いラベル風に変更
            backgroundColor: '#FFF',
            border: '2px solid #333',
            borderRadius: '12px',
            padding: '8px 16px',
            boxShadow: '2px 2px 0px #333'
          }}>
            状態: <span style={{ color: '#FF9F1C' }}>{currentStatus.statusText}</span>
          </div>
          {/* ③ 所持ポイント */}
          <div style={{ 
            fontSize: '16px', 
            fontWeight: 'bold', 
            color: '#333', 
            // ★変更：白いラベル風に変更
            backgroundColor: '#FFF',
            border: '2px solid #333',
            borderRadius: '12px',
            padding: '8px 16px',
            boxShadow: '2px 2px 0px #333',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🪙</span> 所持ポイント: <span style={{ color: '#FF9F1C', fontSize: '18px', fontWeight: 'bold' }}>{points}</span> PT
          </div>
        </div>

      </div>

      {/* 3. 開発用ボタン */}
      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <button 
          onClick={() => setTodoProgress(prev => prev >= 100 ? 100 : prev + 20)}
          style={{ padding: '8px 16px', borderRadius: '12px', border: '2px solid #333', backgroundColor: '#FFF', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
        >
          ➕ 健康になる
        </button>
        <button 
          onClick={() => setTodoProgress(prev => prev <= 0 ? 0 : prev - 20)}
          style={{ padding: '8px 16px', borderRadius: '12px', border: '2px solid #333', backgroundColor: '#FFF', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
        >
          ➖ やつれる
        </button>
      </div>

    </div>
  );
};