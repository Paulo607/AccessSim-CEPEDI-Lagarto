const YEAR = new Date().getFullYear();

const COLS = [
  {
    title: "Produto",
    links: [
      { href: "#solucao",       label: "Solução"        },
      { href: "#como-funciona", label: "Como funciona"  },
      { href: "#beneficios",    label: "Benefícios"     },
      { href: "#cases",         label: "Cases"          },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "#sobre",   label: "Sobre"   },
      { href: "#faq",     label: "FAQ"     },
      { href: "#contato", label: "Contato" },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="border-t border-white/[0.06] bg-navy-950 pt-16 pb-10"
    >
      <div className="container-app">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Marca */}
          <div className="col-span-2 md:col-span-2">
            <p className="font-display font-extrabold text-2xl text-white mb-3">
              Access<span className="text-brand-400">Sim</span>
            </p>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Acessibilidade que transforma espaços urbanos e arquitetônicos.
              Diagnósticos técnicos precisos, planos de ação concretos.
            </p>
          </div>

          {/* Colunas de links */}
          {COLS.map((col) => (
            <div key={col.title}>
              <p className="font-display font-semibold text-xs text-slate-400 uppercase tracking-widest mb-4">
                {col.title}
              </p>
              <nav aria-label={`Links de ${col.title}`}>
                <ul className="space-y-2.5">
                  {col.links.map(({ href, label }) => (
                    <li key={href}>
                      <a
                        href={href}
                        className="text-sm text-slate-400 hover:text-white transition-colors duration-150"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          ))}
        </div>

        {/* Rodapé inferior */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {YEAR} AccessSim. Todos os direitos reservados.</p>
          <p>Comprometidos com a LGPD e com a inclusão.</p>
        </div>
      </div>
    </footer>
  );
}
