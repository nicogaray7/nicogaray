"use client";

import { useState, useEffect } from "react";

const links = [
  { label: "À propos", href: "#about" },
  { label: "Expérience", href: "#experience" },
  { label: "Projets", href: "#projects" },
  { label: "Services", href: "#services" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/90 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="font-bold text-lg tracking-tight hover:text-accent-light transition-colors"
        >
          <span className="gradient-text">NG</span>
          <span className="text-white ml-1 text-sm font-medium opacity-60">
            · Nico Garay
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="#contact"
            className="px-4 py-2 text-sm font-medium bg-accent hover:bg-accent-light text-white rounded-lg transition-colors"
          >
            Démarrer un projet
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-muted hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {menuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface border-b border-border px-6 pb-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-3 text-muted hover:text-white transition-colors border-b border-border last:border-0"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="mt-4 block w-full text-center px-4 py-2.5 text-sm font-medium bg-accent hover:bg-accent-light text-white rounded-lg transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Démarrer un projet
          </a>
        </div>
      )}
    </nav>
  );
}
