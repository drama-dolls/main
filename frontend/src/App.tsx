import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import TodoPage from "./pages/to-do";
import { MyPage } from './pages/MyPage';
import GachaPage from "./pages/gacha";
import GachaRollPage from "./pages/gacha-roll";
import AccountPage from "./pages/account";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="todo" element={<TodoPage />} />
          <Route path="gacha" element={<GachaPage />} />
          <Route path="gacha/roll" element={<GachaRollPage />} />
          <Route path="account" element={<AccountPage />} />
          {/* ★ここで本物のMyPageを表示します */}
          <Route path="mypage" element={<MyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;