import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useThemeStore } from './store/themeStore';
import Layout from './components/Layout';
import Home from './pages/Home';
import Map from './pages/Map';
import Journey from './pages/Journey';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const { theme } = useThemeStore();

  return (
    <div className={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="map" element={<Map />} />
            <Route path="journey" element={<Journey />} />
            <Route path="chat" element={<Chat />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
