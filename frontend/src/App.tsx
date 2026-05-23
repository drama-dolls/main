import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage'; // ★追加：新しく作ったホーム画面のファイルを読み込む！

// ▼ 変更後（5行目〜12行目あたりをこれに置き換えます）
import TodoPage from "./pages/to-do";

import GachaPage from "./pages/gacha";
import GachaRollPage from "./pages/gacha-roll";
const MyPage = () => <div>ここはマイページです。着せ替えをします。</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layoutを「親」にすることで、すべての子画面にヘッダーとメニューが付きます */}
        <Route path="/" element={<Layout />}>
          {/* ★ここで、読み込んだ本物のHomePageを表示します */}
          <Route index element={<HomePage />} />
          <Route path="todo" element={<TodoPage />} />
          <Route path="gacha" element={<GachaPage />} />
          <Route path="gacha/roll" element={<GachaRollPage />} />
          <Route path="mypage" element={<MyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;