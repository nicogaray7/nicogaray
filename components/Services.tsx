const services = [
  {
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: "Site Vitrine",
    tagline: "Votre meilleur commercial, en ligne 24h/24.",
    description:
      "Un site élégant, rapide et optimisé SEO qui présente votre activité et convertit vos visiteurs en clients. Conçu sur-mesure, livré clé en main.",
    features: [
      "Design sur-mesure & responsive",
      "SEO technique optimisé",
      "Performance (Core Web Vitals)",
      "CMS pour gérer votre contenu",
      "Hébergement & domaine inclus",
    ],
    accent: "from-indigo-500 to-purple-600",
    price: "À partir de 800€",
  },
  {
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M12 18h.01" />
      </svg>
    ),
    title: "Application Web",
    tagline: "Un outil digital qui travaille pour vous.",
    description:
      "Du SaaS à la plateforme interne en passant par les marketplaces — je pilote votre projet applicatif de la conception à la mise en production.",
    features: [
      "Cadrage & spécifications",
      "Architecture technique",
      "Développement itératif",
      "Tests & recette",
      "Déploiement & maintenance",
    ],
    accent: "from-purple-500 to-pink-600",
    price: "Sur devis",
  },
  {
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Consulting Digital",
    tagline: "La bonne stratégie, au bon moment.",
    description:
      "Audit de votre présence digitale, définition de roadmap, choix d'outils, formation de vos équipes. Je m'appuie sur 5 ans de missions en grand groupe pour vous faire gagner du temps.",
    features: [
      "Audit digital complet",
      "Stratégie & roadmap",
      "Sélection & implémentation d'outils",
      "Formation équipes",
      "Accompagnement continu",
    ],
    accent: "from-cyan-500 to-blue-600",
    price: "À partir de 500€/j",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 md:py-32 bg-surface/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-accent-light text-sm font-medium uppercase tracking-widest mb-4">
              Services
            </p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Ce que je{" "}
              <span className="gradient-text">peux faire pour vous.</span>
            </h2>
          </div>
          <a
            href="#contact"
            className="px-5 py-2.5 border border-border hover:border-accent/50 text-sm font-medium rounded-lg transition-all hover:bg-accent/5"
          >
            Discutons de votre projet →
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="flex flex-col rounded-2xl border border-border bg-surface group card-hover overflow-hidden"
            >
              {/* Top accent line */}
              <div className={`h-[2px] bg-gradient-to-r ${service.accent}`} />

              <div className="flex flex-col flex-1 p-7">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.accent} flex items-center justify-center text-white mb-5 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300`}
                >
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-1">{service.title}</h3>
                <p className="text-accent-light text-sm font-medium mb-3">
                  {service.tagline}
                </p>

                {/* Description */}
                <p className="text-muted text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2.5 mb-6 flex-1">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <svg
                        className="w-4 h-4 text-accent flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-300">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* Price + CTA */}
                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-sm text-muted">{service.price}</span>
                  <a
                    href="#contact"
                    className="text-sm text-accent-light hover:text-white font-medium transition-colors"
                  >
                    En savoir plus →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-12 p-6 rounded-2xl border border-border bg-surface/50 text-center">
          <p className="text-muted text-sm">
            Tous mes projets incluent une{" "}
            <span className="text-white font-medium">
              première consultation gratuite
            </span>{" "}
            pour définir ensemble vos besoins.
            <a
              href="#contact"
              className="text-accent-light hover:text-white ml-1 transition-colors"
            >
              Réserver un appel →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
