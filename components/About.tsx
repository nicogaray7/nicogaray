const skills = [
  "Project Management",
  "Digital Strategy",
  "UX / CX",
  "Web Development",
  "Salesforce",
  "Adobe Experience Manager",
  "Adobe Campaign",
  "Figma",
  "Jira / Agile",
  "WordPress",
  "Data Analysis",
  "No-code / Low-code",
];

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left: text */}
          <div>
            <p className="text-accent-light text-sm font-medium uppercase tracking-widest mb-4">
              À propos
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Consultant digital
              <br />
              <span className="gradient-text">devenu créateur.</span>
            </h2>
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                Après plus de 5 ans à piloter des projets digitaux pour de
                grandes entreprises — Stellantis, Groupe La Poste, Havas —
                j&apos;ai décidé de mettre cette expertise au service de
                structures qui ont besoin d&apos;un partenaire fiable, pas
                juste d&apos;un prestataire.
              </p>
              <p>
                Je sais ce qui fait qu&apos;un projet délivre vraiment : une
                vision claire, une exécution rigoureuse, et une communication
                sans friction. C&apos;est exactement ce que j&apos;apporte à
                chaque mission.
              </p>
              <p>
                Basé en France, je travaille en remote et accompagne mes
                clients de la définition du besoin jusqu&apos;au lancement —
                et au-delà.
              </p>
            </div>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/nicogaray"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 text-accent-light hover:text-white transition-colors group"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span className="text-sm font-medium">
                Voir mon profil LinkedIn
              </span>
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </a>
          </div>

          {/* Right: skills */}
          <div>
            <p className="text-sm text-muted uppercase tracking-widest font-medium mb-6">
              Compétences clés
            </p>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 text-sm border border-border bg-surface rounded-lg text-slate-300 hover:border-accent/50 hover:text-white hover:bg-accent/5 transition-all duration-200 cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Values */}
            <div className="mt-10 space-y-4">
              {[
                {
                  icon: "⚡",
                  title: "Réactivité",
                  desc: "Un interlocuteur unique, disponible et direct.",
                },
                {
                  icon: "🎯",
                  title: "Orienté résultat",
                  desc: "Chaque décision vise un impact concret et mesurable.",
                },
                {
                  icon: "🔧",
                  title: "Bout en bout",
                  desc: "Du brief au déploiement, je reste présent.",
                },
              ].map((val) => (
                <div
                  key={val.title}
                  className="flex gap-4 p-4 rounded-xl border border-border bg-surface/50"
                >
                  <span className="text-xl">{val.icon}</span>
                  <div>
                    <div className="font-semibold text-sm mb-0.5">
                      {val.title}
                    </div>
                    <div className="text-muted text-sm">{val.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
