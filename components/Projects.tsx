const projects = [
  {
    title: "Flegm",
    subtitle: "Application web TypeScript",
    description:
      "Projet personnel en cours de développement — une application web moderne construite en TypeScript. Preuve concrète de ma capacité à concevoir et développer des produits digitaux de A à Z.",
    tags: ["TypeScript", "Web App", "Projet live"],
    link: "https://flegm.fr",
    linkLabel: "flegm.fr",
    status: "Live",
    statusColor: "bg-green-500/10 text-green-400 border-green-500/20",
    gradient: "from-indigo-500/10 via-purple-500/5 to-transparent",
    icon: "🚀",
  },
  {
    title: "DS Automobiles — Déploiement Global",
    subtitle: "Digital Customer Experience · Stellantis",
    description:
      "Coordination du déploiement d'un site B2C dans plus de 20 pays (FR, UK, ES, DE, IT, HU, AR, TR, JP, KR…). Refonte UX responsive, amélioration des performances, gestion des anomalies en temps réel.",
    tags: ["Adobe Experience Manager", "Salesforce", "Multi-marchés", "UX"],
    link: "https://www.dsautomobiles.fr",
    linkLabel: "dsautomobiles.fr",
    status: "20+ marchés",
    statusColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    gradient: "from-blue-500/10 via-cyan-500/5 to-transparent",
    icon: "🌍",
  },
  {
    title: "Campagnes B2C — La Poste",
    subtitle: "Project Manager · Groupe La Poste",
    description:
      "Conception et pilotage de campagnes commerciales multi-canaux pour les clients grand public. Segmentation Adobe Campaign, analyse de performance, création d'outils de reporting no-code pour les équipes internes.",
    tags: ["Adobe Campaign", "No-code", "Data Analysis", "CRM"],
    link: null,
    linkLabel: null,
    status: "2 ans",
    statusColor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    gradient: "from-yellow-500/10 via-orange-500/5 to-transparent",
    icon: "📊",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <p className="text-accent-light text-sm font-medium uppercase tracking-widest mb-4">
            Projets
          </p>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Ce que j&apos;ai{" "}
            <span className="gradient-text">construit.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.title}
              className={`relative flex flex-col rounded-2xl border border-border bg-surface overflow-hidden group card-hover`}
            >
              {/* Gradient top */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="relative flex flex-col flex-1 p-6">
                {/* Icon + status */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{project.icon}</span>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border ${project.statusColor}`}
                  >
                    {project.status}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold mb-1">{project.title}</h3>
                <p className="text-accent-light text-xs font-medium mb-3">
                  {project.subtitle}
                </p>

                {/* Description */}
                <p className="text-muted text-sm leading-relaxed mb-4 flex-1">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-md border border-border bg-bg/60 text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Link */}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-accent-light hover:text-white transition-colors group/link"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                    <span>{project.linkLabel}</span>
                    <span className="group-hover/link:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
