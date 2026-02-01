import { configureStore, createSlice } from '@reduxjs/toolkit';

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    unit: localStorage.getItem('unit') || 'metric',
    favorites: JSON.parse(localStorage.getItem('favorites')) || []
  },
  reducers: {
    setUnit: (state, action) => {
      state.unit = action.payload;
      localStorage.setItem('unit', action.payload);
    },
    toggleFavorite: (state, action) => {
      const city = action.payload;
      state.favorites = state.favorites.includes(city)
        ? state.favorites.filter(f => f !== city)
        : [...state.favorites, city];
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    }
  }
});

export const { setUnit, toggleFavorite } = weatherSlice.actions;
export const store = configureStore({ reducer: { weather: weatherSlice.reducer } });