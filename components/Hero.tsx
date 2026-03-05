"use client";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[100px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#818CF8 1px, transparent 1px), linear-gradient(90deg, #818CF8 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-accent-light text-sm mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Disponible pour de nouveaux projets
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6 animate-fade-up">
          Du brief au live —
          <br />
          <span className="gradient-text">je pilote, je build,</span>
          <br />
          je délivre.
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted max-w-2xl mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
          Senior Digital & IT Consultant avec +5 ans d&apos;expérience chez Keyrus,
          Stellantis et La Poste. Je crée des sites et des applications qui
          font une vraie différence pour votre business.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 mb-16 animate-fade-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
          <a
            href="#projects"
            className="px-6 py-3 bg-accent hover:bg-accent-light text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-accent/20"
          >
            Voir mes projets
          </a>
          <a
            href="#contact"
            className="px-6 py-3 border border-border hover:border-accent/50 text-white font-medium rounded-lg transition-all duration-200 hover:bg-accent/5"
          >
            Me contacter →
          </a>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-border animate-fade-up"
          style={{ animationDelay: "0.3s", opacity: 0 }}
        >
          {[
            { value: "5+", label: "Ans d'expérience" },
            { value: "20+", label: "Marchés déployés" },
            { value: "3", label: "Grandes entreprises" },
            { value: "∞", label: "Projets à venir" },
          ].map((stat) => (
            <div key={stat.label} className="group">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted animate-bounce">
        <span className="text-xs">Scroll</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}
