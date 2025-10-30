import axios from 'axios';

const BACKEND = "https://book-finder-using-mern.vercel.app/";

export const searchBooks = async (title, page = 1, limit = 20) => {
  const resp = await axios.get(`${BACKEND}/api/search`, { params: { title, page, limit } });
  return resp.data;
};

export const getFavorites = async () => {
  const resp = await axios.get(`${BACKEND}/api/favorites`);
  return resp.data;
};

export const addFavorite = async (fav) => {
  const resp = await axios.post(`${BACKEND}/api/favorites`, fav);
  return resp.data;
};

export const deleteFavorite = async (olKey) => {
  const resp = await axios.delete(`${BACKEND}/api/favorites/${encodeURIComponent(olKey)}`);
  return resp.data;
};
