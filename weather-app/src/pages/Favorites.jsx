import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const favorites = useSelector(state => state.weather.favorites);
  const navigate = useNavigate();

  return (
    <div>
      <h1>Ulubione Miasta</h1>
      {favorites.length === 0 ? (
        <p>Nie masz ulubionych miast.</p>
      ) : (
        <div className="city-grid">
          {favorites.map(city => (
            <div key={city} onClick={() => navigate(`/city/${city}`)} className="city-card favorite-card">
              {city}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;