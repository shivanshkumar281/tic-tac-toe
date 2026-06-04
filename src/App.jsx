import { HashRouter, Routes, Route } from 'react-router-dom';
import Starfield from './components/Starfield.jsx';
import Home from './pages/Home.jsx';
import OfflineGame from './pages/OfflineGame.jsx';
import OnlineGame from './pages/OnlineGame.jsx';
import HowToPlay from './pages/HowToPlay.jsx';

export default function App() {
  return (
    <HashRouter>
      <Starfield />
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<OfflineGame />} />
          <Route path="/online" element={<OnlineGame />} />
          <Route path="/how-to-play" element={<HowToPlay />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
