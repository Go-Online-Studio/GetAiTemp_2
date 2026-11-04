'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Film, Send, X, ArrowRight, Sparkles } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);

  // Live search debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/videos?search=${encodeURIComponent(searchQuery.trim())}&limit=4`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.videos || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsFocused(false);
    setMobileSearchOpen(false);
    if (searchQuery.trim()) {
      router.push(`/videos?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/videos');
    }
  };

  const handleSelectResult = (slug) => {
    setIsFocused(false);
    setMobileSearchOpen(false);
    router.push(`/v/${slug}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-nav px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        
        {/* Brand Zone (Left) */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#45A29E] to-[#1F2833] flex items-center justify-center border border-[#66FCF1]/30 group-hover:border-[#66FCF1] transition-colors shadow-[0_0_12px_rgba(102,252,241,0.2)]">
            <Film className="w-4 h-4 text-[#66FCF1]" />
          </div>
          <div className="flex flex-col">
            <span className="font-['Space_Grotesk'] font-bold text-lg tracking-tight text-white flex items-center gap-1">
              GetYour<span className="text-[#66FCF1]">AI</span>Prompt
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#8E9BAE] -mt-1 font-mono">
              AI Video Prompts
            </span>
          </div>
        </Link>

        {/* Desktop Search Bar (Center) with Live Dropdown */}
        <div ref={searchContainerRef} className="flex-1 max-w-md hidden sm:block relative">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="w-4 h-4 text-[#8E9BAE] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsFocused(true)}
              onClick={() => setIsFocused(true)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsFocused(false);
              }}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsFocused(true);
              }}
              placeholder="Search cinematic prompts..."
              className="w-full bg-[#1F2833]/80 text-white placeholder-[#8E9BAE] text-sm pl-10 pr-9 py-2 rounded-lg border border-white/10 focus:border-[#66FCF1] focus:bg-[#1F2833] focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E9BAE] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Autocomplete Results Popover */}
          {isFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1F2833] border border-[#66FCF1]/30 rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.8)] overflow-hidden z-[100] backdrop-blur-xl">
              {searchQuery.trim() ? (
                <div>
                  <div className="px-3.5 py-2 text-[11px] font-mono uppercase tracking-wider text-[#8E9BAE] border-b border-white/5 flex items-center justify-between">
                    <span>{isLoading ? 'Searching...' : `Matching Prompts (${searchResults.length})`}</span>
                    <span className="text-[10px] text-[#45A29E]">Press Enter to view all</span>
                  </div>

                  {isLoading ? (
                    <div className="p-5 text-center text-xs text-[#8E9BAE] space-y-2">
                      <div className="w-4 h-4 border-2 border-[#66FCF1] border-t-transparent rounded-full animate-spin mx-auto" />
                      <div className="font-mono text-[11px]">Querying prompt database...</div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
                      {searchResults.map((item) => (
                        <button
                          key={item._id}
                          onClick={() => handleSelectResult(item.slug)}
                          className="w-full px-3.5 py-2.5 flex items-center gap-3 hover:bg-white/5 text-left transition-colors group cursor-pointer"
                        >
                          <div className="w-12 h-8 rounded bg-[#0B0C10] overflow-hidden relative shrink-0 border border-white/10">
                            {item.thumbnailUrl && (
                              <Image
                                src={item.thumbnailUrl}
                                alt={item.title}
                                fill
                                sizes="48px"
                                className="object-cover"
                                referrerPolicy="no-referrer"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-white group-hover:text-[#66FCF1] truncate">
                              {item.title}
                            </div>
                            <div className="text-[10px] text-[#8E9BAE] flex items-center gap-1.5 mt-0.5">
                              <span className="text-[#45A29E] font-medium">{item.category?.name || 'Commercial'}</span>
                              <span>·</span>
                              <span>{item.duration ? `${item.duration}s` : '10s'}</span>
                              <span>·</span>
                              <span className="font-mono">{item.aspectRatio || '16:9'}</span>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#8E9BAE] group-hover:text-[#66FCF1] group-hover:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      ))}
                      <div className="p-2.5 bg-[#0B0C10]/50 border-t border-white/5 text-center">
                        <button
                          onClick={handleSearchSubmit}
                          className="text-xs text-[#66FCF1] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>See full search results for "{searchQuery}"</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-[#8E9BAE]">
                      No prompts found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3.5 space-y-2">
                  <div className="text-[10px] font-mono uppercase text-[#8E9BAE] tracking-wider">
                    Quick Discovery Filters
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Commercial Ads', 'Cinematic 4K', 'Product Macro', 'Drone Aerial', 'Vertical Reel', 'Slow Motion'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setSearchQuery(tag);
                          router.push(`/videos?search=${encodeURIComponent(tag)}`);
                          setIsFocused(false);
                        }}
                        className="text-xs px-2.5 py-1 rounded bg-[#0B0C10] border border-white/10 text-[#C5C6C7] hover:text-[#66FCF1] hover:border-[#66FCF1]/50 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Links Right: About, Browse, Contact, Submit Prompt */}
        <nav className="flex items-center gap-3 sm:gap-6 text-sm font-medium">
          {/* Mobile Search Trigger Button */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="sm:hidden p-2 text-[#C5C6C7] hover:text-white"
            aria-label="Toggle mobile search"
          >
            {mobileSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>

          <Link 
            href="/about" 
            className="text-[#C9D1D9] hover:text-[#66FCF1] transition-colors whitespace-nowrap"
          >
            About
          </Link>
          <Link 
            href="/videos" 
            className="text-[#C9D1D9] hover:text-[#66FCF1] transition-colors whitespace-nowrap"
          >
            Browse
          </Link>
          <Link 
            href="/contact" 
            className="text-[#C9D1D9] hover:text-[#66FCF1] transition-colors whitespace-nowrap"
          >
            Contact
          </Link>
          <Link 
            href="/contact?subject=Prompt%20Submission" 
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-[#45A29E]/20 text-[#66FCF1] border border-[#45A29E]/40 hover:bg-[#45A29E] hover:text-[#0B0C10] hover:border-[#66FCF1] transition-all whitespace-nowrap shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Prompt</span>
          </Link>
        </nav>
      </div>

      {/* Mobile Search Overlay Drawer */}
      {mobileSearchOpen && (
        <div className="sm:hidden mt-3 pt-3 border-t border-white/10">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="w-4 h-4 text-[#8E9BAE] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              autoFocus
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cinematic prompts..."
              className="w-full bg-[#1F2833] text-white placeholder-[#8E9BAE] text-sm pl-10 pr-9 py-2 rounded-lg border border-[#66FCF1]/50 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E9BAE] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>
      )}
    </header>
  );
}
