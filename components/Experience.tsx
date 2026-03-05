const experiences = [
  {
    period: "Sept 2022 — Oct 2024",
    role: "Digital & IT Consultant",
    company: "Keyrus × Stellantis (DS Automobiles)",
    type: "Mission",
    description:
      "Mission longue durée chez DS Automobiles (Stellantis) : pilotage des évolutions techniques du site B2C, collaboration UX, et déploiement d'une nouvelle plateforme dans plus de 20 marchés internationaux (FR, UK, ES, DE, IT, JP, KR…).",
    highlights: [
      "Déploiement multi-marchés (20+ pays)",
      "Réduction du taux de rebond via UX responsive",
      "Hausse du trafic web mesurée",
      "Gestion du backlog & User Stories",
    ],
    stack: ["Salesforce", "Adobe Experience Manager", "ServiceNow", "WordPress", "Jira"],
    color: "from-blue-500/20 to-indigo-500/20",
    accentColor: "border-blue-500/30",
  },
  {
    period: "Sept 2020 — Sept 2022",
    role: "Project Manager B2C",
    company: "Groupe La Poste",
    type: "CDI",
    description:
      "Chef de projet digital au sein de la branche Consommateurs & Digital. Conception et pilotage de campagnes commerciales B2C, analyse de la performance, et déploiement d'outils no-code pour la diffusion interne des insights.",
    highlights: [
      "Conception de campagnes multi-canaux",
      "Segmentation & routage sur Adobe Campaign",
      "Analyse de performance quantitative & qualitative",
      "Création de briefs agences et UAT",
    ],
    stack: ["Adobe Campaign", "Figma", "Trello", "No-code tools"],
    color: "from-yellow-500/15 to-orange-500/15",
    accentColor: "border-yellow-500/30",
  },
  {
    period: "Fév 2020 — Août 2020",
    role: "Assistant Digital Project Manager",
    company: "Havas Digital Factory",
    type: "Stage",
    description:
      "Au sein de l'agence digitale du Groupe Havas, participation à toutes les phases de projets web et app pour de grands comptes : cadrage, production, recette et mise en ligne.",
    highlights: [
      "Scoping & estimation",
      "Coordination créatif / technique",
      "Suivi de production",
      "Contrôle qualité et livraison",
    ],
    stack: ["Gestion de projet", "Recette fonctionnelle", "Coordination agence"],
    color: "from-purple-500/15 to-pink-500/15",
    accentColor: "border-purple-500/30",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 md:py-32 bg-surface/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <p className="text-accent-light text-sm font-medium uppercase tracking-widest mb-4">
            Expérience
          </p>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Des missions à{" "}
            <span className="gradient-text">fort impact.</span>
          </h2>
        </div>

        <div className="space-y-6">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className={`relative rounded-2xl border ${exp.accentColor} bg-surface overflow-hidden group card-hover`}
            >
              {/* Gradient bg */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${exp.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="relative p-8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent-light border border-accent/20">
                        {exp.type}
                      </span>
                      <span className="text-sm text-muted">{exp.period}</span>
                    </div>
                    <h3 className="text-xl font-bold">{exp.role}</h3>
                    <p className="text-accent-light font-medium">{exp.company}</p>
                  </div>
                </div>

                <p className="text-muted leading-relaxed mb-6">{exp.description}</p>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Highlights */}
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted font-medium mb-3">
                      Points clés
                    </p>
                    <ul className="space-y-2">
                      {exp.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-2 text-sm text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stack */}
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted font-medium mb-3">
                      Outils & Tech
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {exp.stack.map((s) => (
                        <span
                          key={s}
                          className="text-xs px-3 py-1 rounded-md border border-border bg-bg text-muted"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
