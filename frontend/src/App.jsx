import React, { useEffect } from 'react';
import SearchBar from './components/SearchBar';
import BookCard from './components/BookCard';
import FavoritesPanel from './components/FavoritesPanel';
import { useStore } from './store/useStore';
import * as api from './services/api';

export default function App() {
  const {
    query, results, page, loading, error, favorites,
    setQuery, setResults, setPage, setLoading, setError, setFavorites
  } = useStore();

  // load favorites once
  useEffect(() => {
    (async () => {
      try {
        const favs = await api.getFavorites();
        setFavorites(favs);
      } catch (err) {
        // ignore; backend might not be running
        console.warn('Could not load favorites', err.message);
      }
    })();
  }, []);

  const doSearch = async (q, pageToUse = 1) => {
    try {
      setQuery(q);
      setLoading(true);
      setError(null);
      const data = await api.searchBooks(q, pageToUse, 24);
      setResults(data.docs || []);
      setPage(Number(pageToUse));
    } catch (err) {
      console.error(err);
      setError('Search failed. Check your network or try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (book) => {
    const olKey = book.key || `BOOK-${book.cover_edition_key || book.title}`;
    const existing = favorites.find(f => f.olKey === olKey);
    try {
      if (existing) {
        await api.deleteFavorite(olKey);
        setFavorites(favorites.filter(f => f.olKey !== olKey));
      } else {
        const payload = {
          olKey,
          title: book.title,
          authors: book.author_name || [],
          cover_i: book.cover_i,
          first_publish_year: book.first_publish_year,
          isbn: book.isbn || []
        };
        const created = await api.addFavorite(payload);
        setFavorites([created, ...favorites]);
      }
    } catch (err) {
      console.error('Favorite error', err.message);
      alert(err?.response?.data?.error || 'Failed to update favorites');
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 body-bg text-slate-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        <main className="md:col-span-3 bg-transparent">
          <div className="bg-white/95 rounded-xl p-6 shadow-lg">
            <header className="mb-4">
              <h1 className="text-2xl font-bold">Book Finder</h1>
              <p className="text-sm text-slate-600">Search books from Open Library — save favorites for later.</p>
            </header>

            <SearchBar onSearch={(q) => doSearch(q, 1)} initial={query}/>

            <div className="mt-6">
              {loading && <div className="text-sm text-slate-600">Loading results…</div>}
              {error && <div className="text-sm text-red-600">{error}</div>}
              {!loading && !error && results.length === 0 && (
                <div className="text-sm text-slate-600 mt-4">No results — try another title.</div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {results.map((b) => (
                  <BookCard
                    key={b.key || b.cover_edition_key || b.title}
                    book={b}
                    isFav={favorites.some(f => f.olKey === (b.key || `BOOK-${b.cover_edition_key || b.title}`))}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>

              {results.length > 0 && (
                <div className="flex items-center gap-3 mt-6">
                  <button
                    disabled={page <= 1}
                    onClick={() => doSearch(query, page - 1)}
                    className="px-3 py-1 rounded bg-slate-300 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <div>Page {page}</div>
                  <button
                    onClick={() => doSearch(query, page + 1)}
                    className="px-3 py-1 rounded bg-slate-300"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>

        <aside className="md:col-span-1">
          <FavoritesPanel
            favorites={favorites}
            onRemove={async (olKey) => {
              try {
                await api.deleteFavorite(olKey);
                setFavorites(favorites.filter(f => f.olKey !== olKey));
              } catch (err) { console.error(err); }
            }}
          />
          <div className="mt-4 p-3 text-sm text-slate-200">
            <p>Tip: click Save to persist books to your favorites list.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

