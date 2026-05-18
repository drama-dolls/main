import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';

// ※本来は pages フォルダを作って別ファイルにしますが、今回はテスト用にここに書きます
const HomePage = () => <div>ここはホーム画面yo。メーターやキャラが表示されます。</div>;
const TodoPage = () => <div>ここはToDo画面です。タスク一覧が表示されます。</div>;
const GachaPage = () => <div>ここはガチャ画面です。演出が入ります。</div>;
const MyPage = () => <div>ここはマイページです。着せ替えをします。</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layoutを「親」にすることで、すべての子画面にヘッダーとメニューが付きます */}
        <Route path="/" element={<Layout />}>
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