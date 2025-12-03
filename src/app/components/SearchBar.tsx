// src/components/SearchBar.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

type Props = {
  onOpenChange?: (open: boolean) => void;
};

export default function SearchBar({ onOpenChange }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const iconButtonRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const abortRef = useRef<AbortController | null>(null);

  // coordinates for portal dropdown
  const [coords, setCoords] = useState<{ left: number; top: number; width: number } | null>(null);

  const isDesktop = () => typeof window !== 'undefined' && window.innerWidth >= 768;

  // measure icon and set coords (centered dropdown)
  const measure = (dropdownWidth = 360) => {
    if (!iconButtonRef.current) return null;
    const rect = iconButtonRef.current.getBoundingClientRect();
    let left = rect.left + rect.width / 2 - dropdownWidth / 2;
    const padding = 8;
    const maxLeft = window.innerWidth - dropdownWidth - padding;
    if (left < padding) left = padding;
    if (left > maxLeft) left = maxLeft;
    const top = rect.bottom + 8;
    return { left, top, width: dropdownWidth };
  };

  // open effect: focus and measure
  useEffect(() => {
    if (open) {
      // measure for desktop
      if (isDesktop()) {
        setCoords(measure());
      } else {
        setCoords(null);
      }
      // focus input slightly after open so portal/input exist
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setCoords(null);
    }
    if (typeof onOpenChange === 'function') onOpenChange(open);
  }, [open, onOpenChange]);

  // recompute on resize while open
  useEffect(() => {
    function onResize() {
      if (open && isDesktop()) {
        setCoords(measure());
      } else {
        setCoords(null);
      }
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open]);

  // outside click (for desktop portal we attach a global listener)
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node | null;
      if (!target) return;
      // if desktop and portal open, check against icon and portal nodes
      if (open) {
        // if click is inside the icon, keep open
        if (iconButtonRef.current && iconButtonRef.current.contains(target)) return;
        // portal dropdown element has id 'search-portal'
        const portalEl = document.getElementById('search-portal');
        if (portalEl && portalEl.contains(target)) return;
        // else close
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Escape closes
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Lock body scroll for mobile fixed panel only
  useEffect(() => {
    if (!isDesktop()) {
      if (open) document.body.style.overflow = 'hidden';
      else document.body.style.overflow = '';
      return () => { document.body.style.overflow = ''; };
    }
    return;
  }, [open]);

  // Submit
  function submit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setOpen(false);
  }

  // Debounced suggestions
  useEffect(() => {
    const q = query.trim();
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    if (!open || q.length < 2) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      return;
    }
    setLoadingSuggestions(true);
    const controller = new AbortController();
    abortRef.current = controller;

    const id = setTimeout(async () => {
      try {
        const base = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
        const key = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!base || !key) throw new Error('Missing TMDB env vars');
        const url = `${base}/search/movie?api_key=${key}&query=${encodeURIComponent(q)}&page=1`;
        const res = await fetch(url, { signal: controller.signal });
        const json = await res.json();
        setSuggestions((json.results || []).slice(0, 6));
      } catch (err) {
        if ((err as any).name !== 'AbortError') console.error(err);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
        abortRef.current = null;
      }
    }, 300);

    return () => {
      clearTimeout(id);
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
    };
  }, [query, open]);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') submit();
  }

  // Desktop portal contents
  const portalContent = coords ? (
    <div
      id="search-portal"
      style={{
        position: 'absolute',
        left: `${coords.left}px`,
        top: `${coords.top}px`,
        width: `${coords.width}px`,
        zIndex: 9999,
      }}
    >
      <div className="bg-black/90 rounded-md shadow-xl overflow-hidden">
        <form onSubmit={submit} className="flex items-center px-3 py-2" role="search" aria-label="Site search">
          <button type="button" onClick={() => inputRef.current?.focus()} className="px-2 text-white" aria-hidden>
            <FontAwesomeIcon icon={faSearch} />
          </button>

          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent outline-none text-white px-2 placeholder:text-white/60"
            placeholder="Search movies, TV, people..."
            aria-label="Search query"
            autoComplete="off"
          />

          {query ? (
            <button type="button" onClick={() => { setQuery(''); inputRef.current?.focus(); }} aria-label="Clear search" className="px-2 text-white">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          ) : (
            <button type="button" onClick={() => { setOpen(false); setQuery(''); }} aria-label="Close search" className="px-2 text-white">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </form>

        <div className="mt-1 bg-black/90 rounded-b-md max-h-64 overflow-auto">
          {loadingSuggestions && <div className="p-2 text-sm text-gray-300">Loading...</div>}
          {!loadingSuggestions && query.trim().length >= 2 && suggestions.length === 0 && (
            <div className="p-2 text-sm text-gray-400">No suggestions</div>
          )}
          {!loadingSuggestions && suggestions.map((s) => (
            <button
              key={s.id}
              onClick={() => { router.push(`/movies/${s.id}`); setOpen(false); setQuery(''); setSuggestions([]); }}
              className="w-full text-left p-2 hover:bg-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-16 flex-shrink-0 bg-gray-800 rounded overflow-hidden">
                  {s.poster_path ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`https://image.tmdb.org/t/p/w154${s.poster_path}`} alt={s.title} className="w-full h-full object-cover" />
                  ) : <div className="w-full h-full bg-gray-700" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">{s.title}</div>
                  <div className="text-xs text-gray-400">{s.release_date ? s.release_date.slice(0, 4) : ''}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className="relative inline-flex">
        {/* icon button always in navbar so header layout stable */}
        <button
          ref={iconButtonRef}
          aria-label="Open search"
          onClick={() => setOpen((v) => !v)}
          className="text-white hover:text-[#00C6B1] transition-colors p-1"
        >
          <FontAwesomeIcon icon={faSearch} className="w-5 h-5" />
        </button>
      </div>

      {/* MOBILE: fixed full-width panel under navbar */}
      {open && !isDesktop() && (
        <div className="fixed left-0 right-0 top-16 px-4 z-50">
          <div className="mx-auto w-full">
            <form onSubmit={submit} className="flex items-center bg-black/90 rounded-md px-2 py-2 shadow-lg backdrop-blur-sm" role="search" aria-label="Site search">
              <button type="button" onClick={() => inputRef.current?.focus()} className="px-2 text-white" aria-hidden>
                <FontAwesomeIcon icon={faSearch} />
              </button>

              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                className="w-full bg-transparent outline-none text-white px-2 placeholder:text-white/60"
                placeholder="Search movies, TV, people..."
                aria-label="Search query"
                autoComplete="off"
              />

              {query ? (
                <button type="button" onClick={() => { setQuery(''); inputRef.current?.focus(); }} aria-label="Clear search" className="px-2 text-white">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              ) : (
                <button type="button" onClick={() => { setOpen(false); setQuery(''); }} aria-label="Close search" className="px-2 text-white">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </form>

            <div className="mt-2 bg-black/90 rounded-md max-h-64 overflow-auto shadow-lg">
              {loadingSuggestions && <div className="p-2 text-sm text-gray-300">Loading...</div>}
              {!loadingSuggestions && query.trim().length >= 2 && suggestions.length === 0 && (
                <div className="p-2 text-sm text-gray-400">No suggestions</div>
              )}
              {!loadingSuggestions && suggestions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { router.push(`/movies/${s.id}`); setOpen(false); setQuery(''); setSuggestions([]); }}
                  className="w-full text-left p-2 hover:bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-16 flex-shrink-0 bg-gray-800 rounded overflow-hidden">
                      {s.poster_path ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={`https://image.tmdb.org/t/p/w154${s.poster_path}`} alt={s.title} className="w-full h-full object-cover" />
                      ) : <div className="w-full h-full bg-gray-700" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate">{s.title}</div>
                      <div className="text-xs text-gray-400">{s.release_date ? s.release_date.slice(0, 4) : ''}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP: portal render to body (prevents navbar shifting) */}
      {open && isDesktop() && typeof document !== 'undefined' && ReactDOM.createPortal(portalContent, document.body)}
    </>
  );
}
