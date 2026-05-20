import { useState } from 'react';

export const HomePage = () => {
  const [userName, setUserName] = useState("ゲストユーザー");
  const [todoProgress, setTodoProgress] = useState(100); 

  // ★「ふつう」の時のアイコンを🧸から🙂（顔文字）に修正しました
  const getCharacterStatus = (progress: number) => {
    if (progress >= 81) {
      return { emoji: '🤩', bgColor: '#E0FAEC', statusText: 'ちょうけんこう！' }; 
    } else if (progress >= 61) {
      return { emoji: '🙂', bgColor: '#F5FFFA', statusText: 'ふつう' };             
    } else if (progress >= 41) {
      return { emoji: '😮‍💨', bgColor: '#FFFACD', statusText: 'げんきがない...' };     
    } else if (progress >= 21) {
      return { emoji: '🫠', bgColor: '#E6E6FA', statusText: 'めっちゃやつれてる' }; 
    } else if (progress >= 1) {
      return { emoji: '👻', bgColor: '#DCDCDC', statusText: 'しにかけ...' };         
    } else {
      return { emoji: '🪦', bgColor: '#696969', statusText: 'おはか...' };           
    }
  };

  const currentStatus = getCharacterStatus(todoProgress);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      gap: '24px',
      position: 'relative'
    }}>
      
      {/* 1. 左上のアカウント名表示 */}
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

      {/* 2. 中央のキャラクターとメーターのエリア */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '24px',
        marginTop: '10px'
      }}>
        
        {/* キャラクターの上の状態テキスト */}
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#666', marginBottom: '-16px' }}>
          {currentStatus.statusText}
        </div>

        {/* たまごっちの液晶風キャラクター画面 */}
        <div style={{
          width: '200px',
          height: '200px',
          backgroundColor: currentStatus.bgColor,
          borderRadius: '50%',
          border: '4px solid #333',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '80px',
          boxShadow: 'inset 4px 4px 0px rgba(0,0,0,0.1), 4px 4px 0px #333',
          transition: 'background-color 0.5s'
        }}>
          {currentStatus.emoji}
        </div>

        {/* 3. 健康メーター */}
        <div style={{ width: '100%', maxWidth: '280px', textAlign: 'center' }}>
          <div style={{ 
            fontWeight: 'bold', 
            marginBottom: '8px', 
            fontSize: '15px',
            color: '#333'
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
      </div>

      {/* 開発用のテストボタン */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <button 
          onClick={() => setTodoProgress(prev => prev >= 100 ? 100 : prev + 20)}
          style={{ padding: '8px 16px', borderRadius: '12px', border: '2px solid #ccc', backgroundColor: '#f8f9fa', cursor: 'pointer', fontSize: '12px' }}
        >
          ➕ 健康になる
        </button>
        <button 
          onClick={() => setTodoProgress(prev => prev <= 0 ? 0 : prev - 20)}
          style={{ padding: '8px 16px', borderRadius: '12px', border: '2px solid #ccc', backgroundColor: '#f8f9fa', cursor: 'pointer', fontSize: '12px' }}
        >
          ➖ やつれる
        </button>
      </div>

    </div>
  );
};