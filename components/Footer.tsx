export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-bold gradient-text text-lg">NG</span>
          <span className="text-muted text-sm">
            Nico Garay · Consultant Digital & Créateur Web
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="https://www.linkedin.com/in/nicogaray"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-white transition-colors text-sm"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/nicogaray7"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-white transition-colors text-sm"
          >
            GitHub
          </a>
          <span className="text-muted text-sm">© {year}</span>
        </div>
      </div>
    </footer>
  );
}
