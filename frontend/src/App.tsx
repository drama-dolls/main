import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import TodoPage from "./pages/to-do";
import { MyPage } from './pages/MyPage'; // ★本物のマイページを読み込む

// ダミーのガチャ画面（マイページは削除しました）
const GachaPage = () => <div>ここはガチャ画面です。演出が入ります。</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="todo" element={<TodoPage />} />
          <Route path="gacha" element={<GachaPage />} />
          {/* ★ここで本物のMyPageを表示します */}
          <Route path="mypage" element={<MyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;