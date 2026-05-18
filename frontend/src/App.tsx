import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage'; // ★新しく作ったファイルを読み込む

// 残りのページはまだ作っていないので、一旦仮のままにしておきます
const TodoPage = () => <div>ここはToDo画面です。タスク一覧が表示されます。</div>;
const GachaPage = () => <div>ここはガチャ画面です。演出が入ります。</div>;
const MyPage = () => <div>ここはマイページです。着せ替えをします。</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} /> {/* ★独立したHomePageがここに入ります */}
          <Route path="todo" element={<TodoPage />} />
          <Route path="gacha" element={<GachaPage />} />
          <Route path="mypage" element={<MyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;