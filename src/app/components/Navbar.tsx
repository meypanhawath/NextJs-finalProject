'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell, faUser, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import dynamic from 'next/dynamic';

const SearchBar = dynamic(() => import('./SearchBar'), { ssr: false });

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-3xl font-bold bg-gradient-to-r from-[#00C6B1] to-blue-400 bg-clip-text text-transparent">
              CozyNight
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-[#00C6B1] transition-colors">
              Home
            </Link>
            <Link href="/people" className="text-white hover:text-[#00C6B1] transition-colors">
              People
            </Link>
            <Link href="/tv-shows" className="text-white hover:text-[#00C6B1] transition-colors">
              TV Shows
            </Link>
            <Link href="/movies" className="text-white hover:text-[#00C6B1] transition-colors">
              Movies
            </Link>
            <Link href="/upcoming" className="text-white hover:text-[#00C6B1] transition-colors">
              Upcoming
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-6">
            {/* Search */}
            <div>
              {/* lazy load SearchBar to avoid adding heavy client logic to navbar */}
              <React.Suspense fallback={<button className="text-white hover:text-[#00C6B1] transition-colors"><FontAwesomeIcon icon={faSearch} className="w-5 h-5" /></button>}>
                <SearchBar onOpenChange={(open) => { if (open) setIsMobileMenuOpen(false); }} />
              </React.Suspense>
            </div>

            {/* Bell (plain button) */}
            <button className="text-white hover:text-[#00C6B1] transition-colors">
              <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
            </button>

            {/* User icon links to Activity */}
            <Link href="/account/activity" className="text-white hover:text-[#00C6B1] transition-colors" aria-label="My activity">
              <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 pb-4"
          >
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-white hover:text-[#00C6B1] transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/tv-shows" 
                className="text-white hover:text-[#00C6B1] transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                TV Shows
              </Link>
              <Link 
                href="/people" 
                className="text-white hover:text-[#00C6B1] transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                People
              </Link>
              <Link 
                href="/movies" 
                className="text-white hover:text-[#00C6B1] transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Movies
              </Link>
              <Link 
                href="/upcoming" 
                className="text-white hover:text-[#00C6B1] transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Upcoming
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}