import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage'; // ★追加：新しく作ったホーム画面のファイルを読み込む！
import TodoPage from "./pages/to-do";

// ※HomePageの仮コード（ここはホーム画面yo...）は消去しました！
const TodoPage = () => <div>ここはToDo画面です。タスク一覧が表示されます。</div>;
const GachaPage = () => <div>ここはガチャ画面です。演出が入ります。</div>;
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
          <Route path="mypage" element={<MyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;