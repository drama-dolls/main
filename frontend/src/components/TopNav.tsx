import { Link } from 'react-router-dom';

export const TopNav = () => {
  // ボタン共通のデザイン設定
  const buttonStyle = {
    textDecoration: 'none', 
    color: '#333', 
    fontWeight: 'bold',
    fontSize: '14px',
    backgroundColor: '#FFF',
    padding: '8px 12px',
    borderRadius: '16px',      // 丸っこいボタン
    border: '2px solid #333',  // くっきりした輪郭
    boxShadow: '2px 2px 0px #333', // 飛び出して見える影
    transition: '0.1s'
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-around', 
      padding: '14px 8px', 
      backgroundColor: '#FFF5EE', // 背景のアイボリーに合わせる
      borderBottom: '3px solid #333',
    }}>
      <Link to="/" style={buttonStyle}>ホーム</Link>
      <Link to="/todo" style={buttonStyle}>ToDo</Link>
      <Link to="/gacha" style={buttonStyle}>ガチャ</Link>
      <Link to="/mypage" style={buttonStyle}>マイページ</Link>
    </nav>
  );
};