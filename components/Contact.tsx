"use client";

import { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, wire to a real API (Resend, Formspree, etc.)
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <p className="text-accent-light text-sm font-medium uppercase tracking-widest mb-4">
              Contact
            </p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Un projet en tête ?
              <br />
              <span className="gradient-text">Parlons-en.</span>
            </h2>
            <p className="text-muted leading-relaxed mb-10">
              Que vous ayez une idée précise ou juste une envie, je suis là
              pour vous aider à la concrétiser. Première consultation
              gratuite, sans engagement.
            </p>

            {/* Contact links */}
            <div className="space-y-4">
              <a
                href="https://www.linkedin.com/in/nicogaray"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-surface hover:border-accent/50 hover:bg-accent/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent-light group-hover:bg-accent/20 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium">LinkedIn</div>
                  <div className="text-muted text-xs">linkedin.com/in/nicogaray</div>
                </div>
                <span className="ml-auto text-muted group-hover:text-white transition-colors">→</span>
              </a>

              <a
                href="https://github.com/nicogaray7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-surface hover:border-accent/50 hover:bg-accent/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent-light group-hover:bg-accent/20 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium">GitHub</div>
                  <div className="text-muted text-xs">github.com/nicogaray7</div>
                </div>
                <span className="ml-auto text-muted group-hover:text-white transition-colors">→</span>
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div className="rounded-2xl border border-border bg-surface p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Message envoyé !</h3>
                <p className="text-muted text-sm">
                  Merci pour votre message. Je vous réponds sous 24h.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="name">
                    Nom complet
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Jean Dupont"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-bg text-white placeholder-muted focus:outline-none focus:border-accent/60 focus:bg-accent/5 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="jean@entreprise.fr"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-bg text-white placeholder-muted focus:outline-none focus:border-accent/60 focus:bg-accent/5 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="subject">
                    Sujet
                  </label>
                  <select
                    id="subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-bg text-white focus:outline-none focus:border-accent/60 focus:bg-accent/5 transition-all text-sm"
                    required
                  >
                    <option value="" disabled>Choisir...</option>
                    <option value="site">Création de site vitrine</option>
                    <option value="app">Développement d&apos;application</option>
                    <option value="consulting">Consulting digital</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    placeholder="Décrivez votre projet en quelques lignes..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-bg text-white placeholder-muted focus:outline-none focus:border-accent/60 focus:bg-accent/5 transition-all text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-accent hover:bg-accent-light text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-accent/20"
                >
                  Envoyer le message →
                </button>
                <p className="text-center text-xs text-muted">
                  Réponse garantie sous 24h ouvrées.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
