import { Routes, Route, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUnit } from './store';
import Home from './pages/Home';
import WeatherDetails from './pages/WeatherDetails';
import Favorites from './pages/Favorites';

function App() {
  const dispatch = useDispatch();
  const unit = useSelector((state) => state.weather.unit);

  return (
    <div className="app-container">
      <nav className="navbar">
        <Link to="/" className="logo">WeatherApp</Link>
        <div className="nav-links">
          <Link to="/favorites" style={{ marginRight: '15px', textDecoration: 'none', color: '#3498db' }}>Ulubione</Link>
          <select value={unit} onChange={(e) => dispatch(setUnit(e.target.value))}>
            <option value="metric">Celsius (°C)</option>
            <option value="imperial">Fahrenheit (°F)</option>
            <option value="standard">Kelvin (K)</option>
          </select>
        </div>
      </nav>

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/city/:cityName" element={<WeatherDetails />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;