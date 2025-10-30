import React from 'react';

const COVER_URL = (cover_i, size = 'M') =>
  cover_i ? `https://covers.openlibrary.org/b/id/${cover_i}-${size}.jpg` : null;

export default function BookCard({ book, isFav, onToggleFavorite }) {
  const title = book.title || 'No title';
  const authors = book.author_name || [];
  const cover = COVER_URL(book.cover_i);
  const key = book.key || book.cover_edition_key || book.title; // unique-ish

  return (
    <div className="bg-white/90 rounded-lg p-4 shadow-md flex flex-col">
      <div className="h-48 flex items-center justify-center mb-3">
        {cover ? (
          <img src={cover} alt={`${title} cover`} className="h-full object-contain" />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500">No cover</div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-slate-600">{authors.join(', ')}</p>
        <p className="text-xs text-slate-500 mt-2">First published: {book.first_publish_year || '—'}</p>
      </div>
      <div className="mt-3 flex gap-2">
        <a
          className="text-sm underline"
          href={`https://openlibrary.org${book.key}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open
        </a>
        <button
          onClick={() => onToggleFavorite(book)}
          className={`ml-auto px-3 py-1 rounded ${isFav ? 'bg-red-500 text-white' : 'bg-indigo-600 text-white'}`}
        >
          {isFav ? 'Unsave' : 'Save'}
        </button>
      </div>
    </div>
  );
}
