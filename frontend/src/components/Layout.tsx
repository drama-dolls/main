import { Outlet, Link } from 'react-router-dom'; // ★右端のボタン用に Link を追加
import { TopNav } from './TopNav';

export const Layout = () => {
  return (
    <div style={{ 
      backgroundColor: '#FFF5EE', // 温かいアイボリー
      minHeight: '100vh',
      color: '#333',
      fontFamily: '"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", sans-serif'
    }}>
      {/* 1. 一番上のアプリ名ヘッダー（横並び・左右両端の配置に変更） */}
      <header style={{ 
        backgroundColor: '#FF9F1C', // ソフトオレンジ
        padding: '12px 20px',       // 上下を少しスリムにして、左右に少し余白を作りました
        display: 'flex',            // ★中身を横並びにする魔法の指示
        justifyContent: 'space-between', // ★左端と右端に綺麗に分ける指示
        alignItems: 'center',       // ★上下の真ん中に高さを揃える指示
        borderBottom: '4px solid #333', // 太い枠線
      }}>
        {/* 【左端】アプリ名 */}
        <h2 style={{ 
          margin: 0, 
          color: '#FFF', 
          fontSize: '20px', // 左右並びで見やすくなるよう少し小さめに調整
          fontWeight: 'bold',
          textShadow: '2px 2px 0px #333' // 文字の影
        }}>
          👾 drama doll
        </h2>

        {/* 【右端】アカウントページアカウント登録画面に飛ぶボタン */}
        <Link to="/account" style={{
          textDecoration: 'none',
          color: '#333',
          backgroundColor: '#FFFFFF',   // ボタンの背景は白
          padding: '6px 14px',         // ボタンの内側の余白
          borderRadius: '14px',         // 丸っこいカプセル型
          border: '2px solid #333',     // くっきりした太い輪郭
          boxShadow: '2px 2px 0px #333',// 押しやすそうな立体感のある影
          fontWeight: 'bold',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          transition: '0.1s'
        }}
        // ボタンを押した時に少し沈む可愛い演出
        onMouseDown={(e) => e.currentTarget.style.transform = 'translate(1px, 1px)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'translate(0px, 0px)'}
        >
          👤 アカウント
        </Link>
      </header>

      {/* 2. アプリ名のすぐ下のメニューバー */}
      <TopNav />

      {/* 3. 各画面の中身 */}
      <main style={{ padding: '20px' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',   
          border: '3px solid #333', 
          padding: '24px',
          minHeight: '350px',
          boxShadow: '4px 4px 0px #333' 
        }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};