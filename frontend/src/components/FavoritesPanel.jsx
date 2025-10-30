import React from 'react';

export default function FavoritesPanel({ favorites, onRemove }) {
  return (
    <div className="p-3 bg-white/80 rounded-lg shadow-sm">
      <h4 className="font-semibold mb-2">Favorites ({favorites.length})</h4>
      {favorites.length === 0 ? (
        <p className="text-sm text-slate-600">No favorites yet — save books you like.</p>
      ) : (
        <ul className="space-y-2 max-h-64 overflow-auto">
          {favorites.map((f) => (
            <li key={f.olKey} className="flex items-center justify-between">
              <div className="text-sm">
                <div className="font-medium">{f.title}</div>
                <div className="text-xs text-slate-600">{(f.authors || []).join(', ')}</div>
              </div>
              <button onClick={() => onRemove(f.olKey)} className="text-red-600 text-sm">
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
