import {create} from 'zustand';

export const useStore = create((set) => ({
  query: '',
  results: [],
  page: 1,
  loading: false,
  error: null,
  favorites: [],
  setQuery: (q) => set({ query: q }),
  setResults: (r) => set({ results: r }),
  setPage: (p) => set({ page: p }),
  setLoading: (b) => set({ loading: b }),
  setError: (e) => set({ error: e }),
  setFavorites: (favs) => set({ favorites: favs })

}));
