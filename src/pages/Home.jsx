import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import './home.css';

export default function Home() {
  return (
    <>
      <div className="page home">
        <h1 className="title">Tic-Tac-Toe</h1>

        <div className="menu">
          <Link to="/play" className="neon-btn menu-btn">
            Offline · vs Computer
          </Link>
          <Link to="/online" className="neon-btn menu-btn">
            Online · Play a Friend
          </Link>
          <Link to="/how-to-play" className="neon-btn ghost menu-btn">
            How to Play
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
