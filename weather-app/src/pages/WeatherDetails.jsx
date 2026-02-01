import { useEffect, useReducer, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../store';
import { getWeather } from '../weatherService';
import { Star, Wind, Cloud, Droplets, ArrowLeft } from 'lucide-react';

const weatherReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START': return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS': return { ...state, loading: false, data: action.payload };
    case 'FETCH_ERROR': return { ...state, loading: false, error: action.payload };
    default: return state;
  }
};

const WeatherDetails = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();
  const { unit, favorites } = useSelector(state => state.weather);
  const isFavorite = favorites.includes(cityName);

  const [state, dispatch] = useReducer(weatherReducer, {
    loading: true,
    data: null,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_START' });
      try {
        const result = await getWeather(cityName, unit);
        dispatch({ type: 'FETCH_SUCCESS', payload: result });
      } catch (err) {
        dispatch({ type: 'FETCH_ERROR', payload: 'Nie znaleziono miejscowości lub błąd API' });
      }
    };
    fetchData();
  }, [cityName, unit]);

  const dailyForecast = useMemo(() => {
    if (!state.data) return [];
    return state.data.forecast.list.filter((_, index) => index % 8 === 0);
  }, [state.data]);

  const handleFavoriteClick = useCallback(() => {
    reduxDispatch(toggleFavorite(cityName));
  }, [reduxDispatch, cityName]);

  if (state.loading) return <div style={{ padding: '20px' }}>Ładowanie danych</div>;
  if (state.error) return <div style={{ padding: '20px' }}>{state.error} <button onClick={() => navigate('/')}>Powrót</button></div>;

  const { current } = state.data;

  return (
    <div className="details-container">
      <button onClick={() => navigate('/')} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', background: '#eee', color: '#333', border: 'none', padding: '8px 15px', borderRadius: '5px' }}>
        <ArrowLeft size={16} /> Powrót
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>{current.name}</h1>
        <button 
          onClick={handleFavoriteClick} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: isFavorite ? '#f1c40f' : '#bdc3c7' }}
        >
          <Star fill={isFavorite ? '#f1c40f' : 'none'} size={40} />
        </button>
      </div>

      <div style={{ background: '#ffffff', padding: '30px', borderRadius: '15px', marginTop: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid #eee' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h2 style={{ fontSize: '3.5rem', margin: 0, color: '#2c3e50' }}>
                {Math.round(current.main.temp)}°{unit === 'metric' ? 'C' : unit === 'imperial' ? 'F' : 'K'}
            </h2>
            <div style={{ textAlign: 'center' }}>
                <img 
                    src={`http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`} 
                    alt="pogoda" 
                    style={{ background: '#3498db', borderRadius: '50%', width: '80px' }}
                />
                <p style={{ margin: 0, textTransform: 'capitalize', fontWeight: 'bold', color: '#7f8c8d' }}>
                    {current.weather[0].description}
                </p>
            </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
          
          <div style={{ padding: '15px', border: '1px solid #f0f0f0', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#3498db', marginBottom: '8px' }}>
                <Wind size={24} /> <strong>Wiatr</strong>
            </div>
            <p style={{ margin: '3px 0', color: '#333' }}>Prędkość: {current.wind.speed} m/s</p>
            <p style={{ margin: '3px 0', color: '#333' }}>Kierunek: {current.wind.deg}°</p>
          </div>

          <div style={{ padding: '15px', border: '1px solid #f0f0f0', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#3498db', marginBottom: '8px' }}>
                <Droplets size={24} /> <strong>Opady i Wilgoć</strong>
            </div>
            <p style={{ margin: '3px 0', color: '#333' }}>Ilość (1h): {current.rain ? `${current.rain['1h']} mm` : '0 mm'}</p>
            <p style={{ margin: '3px 0', color: '#333' }}>Wilgotność: {current.main.humidity}%</p>
          </div>

          <div style={{ padding: '15px', border: '1px solid #f0f0f0', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#3498db', marginBottom: '8px' }}>
                <Cloud size={24} /> <strong>Warunki</strong>
            </div>
            <p style={{ margin: '3px 0', color: '#333' }}>Zachmurzenie: {current.clouds.all}%</p>
            <p style={{ margin: '3px 0', color: '#333' }}>Ciśnienie: {current.main.pressure} hPa</p>
          </div>

        </div>
      </div>

      <h3 style={{ marginTop: '40px', color: '#2c3e50', borderBottom: '2px solid #3498db', display: 'inline-block', paddingBottom: '5px' }}>
        Prognoza na 5 dni
      </h3>
      <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', padding: '10px 0' }}>
        {dailyForecast.map((day) => (
          <div key={day.dt} style={{ minWidth: '110px', background: 'white', padding: '15px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#34495e' }}>
                {new Date(day.dt * 1000).toLocaleDateString('pl-PL', { weekday: 'short' })}
            </p>
            <img src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt="prognoza" />
            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#2c3e50' }}>
                {Math.round(day.main.temp)}°
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDetails;