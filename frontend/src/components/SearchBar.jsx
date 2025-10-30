import React, { useState } from 'react';

export default function SearchBar({ onSearch, initial = '' }) {
  const [text, setText] = useState(initial);

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSearch(text.trim());
  };

  return (
    <form onSubmit={submit} className="w-full flex gap-2">
      <input
        aria-label="Search books by title"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search books by title (e.g. Pride and Prejudice)"
        className="flex-1 px-4 py-2 rounded-md bg-white/90 dark:bg-slate-800 placeholder-slate-400 text-white"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Search
      </button>
    </form>
  );
}
