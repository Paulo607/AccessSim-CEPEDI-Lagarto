import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "#sobre",         label: "Sobre" },
  { href: "#solucao",       label: "Solução" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#beneficios",    label: "Benefícios" },
  { href: "#cases",         label: "Cases" },
  { href: "#faq",           label: "FAQ" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  function close() {
    setMenuOpen(false);
  }

  return (
    <>
      <header
        role="banner"
        className={[
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled || menuOpen
            ? "bg-navy-950/95 backdrop-blur-md border-b border-white/[0.06] py-3"
            : "py-5",
        ].join(" ")}
      >
        <div className="container-app flex items-center justify-between">

          {/* LOGO */}
          <a
            href="#"
            onClick={close}
            className="font-display font-extrabold text-[24px] text-white tracking-tight relative z-50"
            aria-label="AccessSim — início da página"
          >
            <div className="flex items-center gap-2">
              <img 
                src="/logo-AccessSim.png" 
                alt="Logo AccessSim" 
                className="transition-transform duration-700 hover:rotate-[360deg] active:rotate-[360deg]"
                width={40} />
              <div>
                <span>Access</span>
                <span className="text-brand-400">Sim</span>
              </div>
            </div>
          </a>

          {/* NAV DESKTOP */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="px-3 py-1.5 text-sm font-medium text-slate-400 rounded-lg transition-colors duration-150 hover:text-white hover:bg-white/5"
              >
                {label}
              </a>
            ))}

            <a href="#contato" className="btn-primary ml-4 text-sm py-2">
              Agendar demo
            </a>
          </nav>

          {/* BOTÃO MOBILE */}
          <button
            className="lg:hidden relative z-50 flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-white/5 transition-colors"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={`absolute block w-5 h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? "rotate-45" : "-translate-y-1.5"}`} />
            <span className={`absolute block w-5 h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : "opacity-100"}`} />
            <span className={`absolute block w-5 h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? "-rotate-45" : "translate-y-1.5"}`} />
          </button>
        </div>
      </header>

      {/* MENU MOBILE */}
      <div
        id="mobile-menu"
        className={[
          "lg:hidden fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-navy-950 transition-all duration-300",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <nav>
          <ul className="flex flex-col items-center gap-2">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={close}
                  className="block px-6 py-3 text-2xl font-display font-semibold text-white hover:text-brand-400 transition-colors rounded-xl hover:bg-white/5"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href="#contato"
          onClick={close}
          className="btn-primary mt-2"
        >
          Agendar demo
        </a>
      </div>
    </>
  );
}