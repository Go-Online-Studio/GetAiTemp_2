'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { Film, Menu, X } from 'lucide-react';

const navigationLinks = [
  { href: '/about', label: 'About' },
  { href: '/videos', label: 'Browse' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (mobileMenuOpen) {
      setDrawerMounted(true);
      return;
    }

    if (!drawerMounted) return;

    setDrawerVisible(false);
    const timeout = window.setTimeout(() => setDrawerMounted(false), 300);
    return () => window.clearTimeout(timeout);
  }, [mobileMenuOpen, drawerMounted]);

  useEffect(() => {
    if (!mobileMenuOpen || !drawerMounted) return;

    const frame = window.requestAnimationFrame(() => setDrawerVisible(true));
    return () => window.cancelAnimationFrame(frame);
  }, [mobileMenuOpen, drawerMounted]);

  useEffect(() => {
    if (mobileMenuOpen && drawerMounted) closeButtonRef.current?.focus();
  }, [mobileMenuOpen, drawerMounted]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const menuButton = menuButtonRef.current;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = drawerRef.current?.querySelectorAll('a[href], button:not([disabled])');
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      menuButton?.focus();
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const mobileNavigation = drawerMounted && typeof document !== 'undefined'
    ? createPortal(
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close navigation menu"
            onClick={closeMobileMenu}
            className={`fixed inset-0 z-[60] bg-black/65 backdrop-blur-sm transition-opacity duration-300 sm:hidden ${
              drawerVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />

          <aside
            ref={drawerRef}
            id="mobile-navigation"
            role="dialog"
            aria-label="Mobile navigation"
            aria-modal={mobileMenuOpen ? 'true' : undefined}
            aria-hidden={!mobileMenuOpen}
            inert={!mobileMenuOpen}
            className={`fixed inset-y-0 right-0 z-[70] w-[min(85vw,22rem)] border-l border-white/10 bg-[#111821] shadow-2xl transition-transform duration-300 ease-out sm:hidden ${
              drawerVisible ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex h-full flex-col px-5 pt-5">
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <span className="font-['Space_Grotesk'] text-lg font-bold text-white">Navigate</span>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeMobileMenu}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#C9D1D9] hover:bg-white/5 hover:text-white transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <nav aria-label="Mobile navigation" className="flex flex-col">
                {navigationLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMobileMenu}
                    className="border-b border-white/5 py-4 text-base font-medium text-[#C9D1D9] hover:text-[#66FCF1] transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>
        </>,
        document.body
      )
    : null;

  return (
    <header className="sticky top-0 z-50 w-full glass-nav px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
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

        <nav aria-label="Main navigation" className="hidden sm:flex items-center gap-6 text-sm font-medium">
          {navigationLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[#C9D1D9] hover:text-[#66FCF1] transition-colors whitespace-nowrap"
            >
              {label}
            </Link>
          ))}
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="sm:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#141d28] text-[#C9D1D9] hover:border-[#66FCF1]/50 hover:text-[#66FCF1] transition-colors"
          aria-label="Open navigation menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {mobileNavigation}
    </header>
  );
}
