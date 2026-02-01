import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const INITIAL_CITIES = ['Warszawa', 'Kraków', 'Wrocław', 'Gdańsk', 'Poznań'];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/city/${searchTerm.trim()}`);
    }
  }, [searchTerm, navigate]);

  const filteredCities = useMemo(() => {
    return INITIAL_CITIES.filter(city => 
      city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div>
      <h1>Prognoza Pogody</h1>
      <form onSubmit={handleSearch} style={{ marginBottom: '2rem', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Szukaj"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '250px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          <Search size={18} />
        </button>
      </form>

      <h3>Miasta:</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
        {filteredCities.map((city) => (
          <div 
            key={city} 
            onClick={() => navigate(`/city/${city}`)}
            style={{ 
              padding: '20px', 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              cursor: 'pointer',
              textAlign: 'center',
              background: '#f9f9f9'
            }}
          >
            {city}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;