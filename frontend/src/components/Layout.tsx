import { Outlet } from 'react-router-dom';
import { TopNav } from './TopNav';

export const Layout = () => {
  return (
    <div style={{ 
      backgroundColor: '#FFF5EE', // 【ベースカラー】温かいアイボリー
      minHeight: '100vh',
      color: '#333',
      fontFamily: '"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", sans-serif'
    }}>
      {/* 1. 一番上のアプリ名ヘッダー */}
      <header style={{ 
        backgroundColor: '#FF9F1C', // 【メインカラー】ソフトオレンジ
        padding: '16px', 
        textAlign: 'center',
        borderBottom: '4px solid #333', // おもちゃ感を出す太い枠線
      }}>
        <h2 style={{ 
          margin: 0, 
          color: '#FFF', 
          fontSize: '24px', 
          fontWeight: 'bold',
          textShadow: '2px 2px 0px #333' // 文字にもポップな影をつけます
        }}>
          👾 てづくり育成アプリ(仮)
        </h2>
      </header>

      {/* 2. アプリ名のすぐ下のメニューバー */}
      <TopNav />

      {/* 3. 各画面の中身（たまごっちの画面風のボックス） */}
      <main style={{ padding: '20px' }}>
        <div style={{
          backgroundColor: '#CSS', // ボックス内は白
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',   // たまごっち風のぷっくりした丸み
          border: '3px solid #333', // 太い枠線
          padding: '24px',
          minHeight: '350px',
          boxShadow: '4px 4px 0px #333' // クレヨンで描いたようなズレた影
        }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};