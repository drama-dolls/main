import { useState, useEffect, useRef } from 'react';

export const HomePage = () => {
  const [userName, setUserName] = useState("ゲストユーザー");
  const [todoProgress, setTodoProgress] = useState(100); 
  const [points, setPoints] = useState(120);

  // 動画要素をコントロールするための目印（Ref）
  const videoRef = useRef<HTMLVideoElement>(null);

  // メーターの数値に応じて「流す動画のファイルパス」を切り替える関数
  const getCharacterStatus = (progress: number) => {
    if (progress >= 81) {
      return { videoSrc: '/videos/cho_kenko.mp4', statusText: 'ちょうけんこう！' }; 
    } else if (progress >= 61) {
      // ★前回のタイポ修正済み：/videos/video_project_3.mp4 にファイル名を想定
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

  // メーターが切り替わったときに、動画を確実に最初から自動再生させるための処理
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load(); // 新しい動画ファイルを読み込み直す
      // ブラウザによってはload()だけで再生されないことがあるためplay()も呼ぶ
      videoRef.current.play().catch(err => console.log("自動再生ブロックの回避:", err));
    }
  }, [currentStatus.videoSrc]); // 動画のパスが変わった瞬間に実行される

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          <span>🪙</span> おこづかい: <span style={{ color: '#FF9F1C', fontSize: '16px', fontWeight: 'bold' }}>{points}</span> PT
        </div>
      </div>

      {/* 2. 中央のレイアウトエリア */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '20px',
        marginTop: '10px'
      }}>
        
        {/* 【上】健康メーター */}
        <div style={{ width: '100%', maxWidth: '280px', textAlign: 'center' }}>
          <div style={{ 
            fontWeight: 'bold', 
            marginBottom: '8px', 
            fontSize: '15px',
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

        {/* キャラクターの状態テキスト */}
        <div style={{ 
          fontSize: '14px', 
          fontWeight: 'bold', 
          color: '#333', 
          marginTop: '15px', 
          marginBottom: '-10px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '4px 12px',
          borderRadius: '12px',
          border: '2px solid #333'
        }}>
          {currentStatus.statusText}
        </div>

        {/* 【下】★変更：丸(50%)から、おもちゃ風の角丸正方形に変更 */}
        <div style={{
          width: '380px',
          height: '380px',
          backgroundColor: '#FFF', // 動画が綺麗に見えるように液晶の背景は白に固定
          borderRadius: '12px',      // ★ここを変更！丸(50%)から角丸(12px)へ
          border: '4px solid #333',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',       // 枠からはみ出た動画をカットする
          boxShadow: 'inset 4px 4px 0px rgba(0,0,0,0.1), 4px 4px 0px #333',
        }}>
          <video
            ref={videoRef}
            src={currentStatus.videoSrc}
            loop       // ループ再生
            muted      // 音声をミュート（自動再生に必須）
            playsInline // スマホの全画面起動を防止
            style={{
              width: '100%',  // 正方形の枠幅いっぱい
              height: '100%', // 正方形の枠高さいっぱい
              objectFit: 'cover' // ★ここが重要！動画を正方形の枠いっぱいに綺麗に広げる
            }}
          />
        </div>

      </div>

      {/* 開発用のテストボタン */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
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