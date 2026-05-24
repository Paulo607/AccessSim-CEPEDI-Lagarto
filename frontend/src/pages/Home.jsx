import { useDocumentTitle } from "../hooks/useDocumentTitle";
import SectionHeader        from "../components/SectionHeader";
import Card                 from "../components/Card";
import LeadForm             from "../components/LeadForm";

/* ── Dados reais AccessSim ────────────────────────────────── */

const HOW_STEPS = [
  {
    num: "01",
    title: "Captura do ambiente",
    desc: "Aponte a câmera do smartphone ou tablet para o espaço. A plataforma identifica o ambiente em tempo real via Realidade Aumentada.",
  },
  {
    num: "02",
    title: "Análise por Inteligência Artificial",
    desc: "Nossa IA processa o espaço automaticamente, cruzando cada elemento com os requisitos da NBR 9050.",
  },
  {
    num: "03",
    title: "Identificação de não conformidades",
    desc: "Os pontos problemáticos são sobrepostos ao ambiente físico em tempo real, com marcações visuais precisas.",
  },
  {
    num: "04",
    title: "Relatório e recomendações",
    desc: "A plataforma gera um relatório técnico completo com recomendações automáticas de correção, pronto para uso profissional.",
  },
];

const BENEFITS = [
  {
    icon: "⚡",
    title: "Análise em tempo real",
    desc: "Avaliação de acessibilidade instantânea via RA — sem esperar dias por laudos manuais.",
  },
  {
    icon: "📋",
    title: "Conformidade NBR 9050",
    desc: "Verificação automatizada de cada requisito da norma, reduzindo erros e omissões humanas.",
  },
  {
    icon: "♿",
    title: "Ambientes verdadeiramente inclusivos",
    desc: "Identificamos barreiras que impactam pessoas com deficiência, idosos e mobilidade reduzida.",
  },
  {
    icon: "💰",
    title: "Redução de custos",
    desc: "Evite retrabalhos e atrasos onerosos detectando problemas ainda na fase de projeto.",
  },
  {
    icon: "📊",
    title: "Relatórios automáticos",
    desc: "Laudos técnicos gerados pela plataforma, prontos para apresentar em aprovações e auditorias.",
  },
  {
    icon: "🤝",
    title: "Consultoria especializada",
    desc: "Suporte presencial ou remoto de especialistas em acessibilidade arquitetônica em todo o Brasil.",
  },
];

const TARGETS = [
  {
    emoji: "📐",
    title: "Arquitetos e Engenheiros",
    desc: "Integre a verificação de acessibilidade desde a concepção do projeto, evitando adequações tardias.",
  },
  {
    emoji: "🏗",
    title: "Construtoras",
    desc: "Reduza custos de retrabalho e riscos de embargo validando conformidade antes e durante a obra.",
  },
  {
    emoji: "🏛",
    title: "Órgãos Públicos",
    desc: "Automatize auditorias de espaços públicos e agilize processos de aprovação e fiscalização.",
  },
  {
    emoji: "🏙",
    title: "Smart Cities",
    desc: "Contribua para cidades mais inteligentes, seguras e acessíveis com dados precisos de conformidade urbana.",
  },
];

const FAQ = [
  {
    q: "A AccessSim substitui a consultoria presencial?",
    a: "Não — ela potencializa. A plataforma entrega um diagnóstico preciso em tempo real que orienta e reduz o escopo das visitas técnicas, tornando o processo muito mais eficiente. Oferecemos também suporte de consultoria presencial ou remoto em todo o Brasil.",
  },
  {
    q: "Quais tipos de espaço são suportados?",
    a: "Atendemos edificações comerciais e públicas, calçadas, praças, terminais de transporte, espaços culturais, hospitais, escolas e projetos residenciais multifamiliares. Nossa análise cobre qualquer ambiente que precise estar em conformidade com a NBR 9050.",
  },
  {
    q: "Como a IA identifica as não conformidades?",
    a: "Nossa Inteligência Artificial foi treinada com os requisitos técnicos da NBR 9050 e analisa o ambiente capturado pela câmera do dispositivo, sobrepondo marcações visuais em Realidade Aumentada sobre cada ponto de não conformidade identificado.",
  },
  {
    q: "O relatório gerado é aceito em processos de aprovação?",
    a: "Sim. Os relatórios seguem os padrões técnicos exigidos pelos principais órgãos de aprovação de projetos e podem ser utilizados em auditorias, vistorias e processos de licenciamento de obras.",
  },
  {
    q: "Qual a disponibilidade e forma de contratação?",
    a: "Atendemos remotamente ou presencialmente em todo o Brasil. A precificação é personalizada conforme o escopo do projeto — entre em contato para receber uma proposta adequada às suas necessidades.",
  },
];

/* ── Componente interno: item do FAQ ──────────────────────── */

function FaqItem({ item }) {
  return (
    <details className="border-b border-white/[0.06] py-5 group">
      <summary className="flex justify-between items-center gap-4 cursor-pointer list-none font-display font-semibold text-white text-base select-none">
        {item.q}
        <span className="text-brand-400 text-xl flex-shrink-0 transition-transform duration-200 group-open:rotate-45">
          +
        </span>
      </summary>
      <p className="text-slate-400 mt-4 text-[0.9375rem] leading-relaxed">{item.a}</p>
    </details>
  );
}

/* ── Página principal ─────────────────────────────────────── */

export default function Home() {
  useDocumentTitle(null);

  return (
    <>
      {/* ── HERO ───────────────────────────────────────────── */}
      <section
        id="hero"
        aria-label="Apresentação"
        className="relative min-h-screen flex items-center pt-24 pb-28 overflow-hidden"
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_60%_40%,rgba(249,115,22,0.07),transparent)]"
        />
        <div
          aria-hidden
          className="absolute right-[-10vw] top-[10%] w-[60vw] max-w-[700px] aspect-square rounded-full border-[3px] border-brand-400/15 animate-glow"
        />
        <div
          aria-hidden
          className="absolute right-[-5vw] top-[18%] w-[45vw] max-w-[540px] aspect-square rounded-full border-[3px] border-brand-400/20 animate-glow"
        />

        <div className="container-app relative">
          <div className="max-w-2xl">
            <span className="badge mb-6 inline-block animate-fade-up">
              Acessibilidade arquitetônica com IA + Realidade Aumentada
            </span>

            <h1 className="animate-fade-up-1 font-extrabold text-5xl md:text-6xl leading-[1.1] mb-6">
              Diagnóstico de{" "}
              <span className="bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent">
                acessibilidade
              </span>{" "}
              em horas, não semanas
            </h1>

            <p className="animate-fade-up-2 text-slate-400 text-lg md:text-xl leading-relaxed max-w-xl mb-10">
              A AccessSim usa RA e IA para automatizar a avaliação de acessibilidade
              em projetos arquitetônicos com base na NBR 9050 — em tempo real, direto
              pela câmera do seu dispositivo.
            </p>

            <div className="animate-fade-up-3 flex flex-wrap gap-4">
              <a href="#contato" className="btn-primary text-base px-8 py-3.5">
                Agendar demo gratuita
              </a>
              <a href="#como-funciona" className="btn-secondary">
                Como funciona
              </a>
            </div>

            {/* Estatísticas reais */}
            <div className="flex flex-wrap gap-10 mt-14 pt-10 border-t border-white/[0.07]">
              {[
                ["RA + IA",  "tecnologias integradas na plataforma"],
                ["NBR 9050", "verificação automatizada da norma"   ],
                ["2025",     "fundada em Aracaju, Sergipe"         ],
              ].map(([num, label]) => (
                <div key={num}>
                  <p className="font-display font-extrabold text-3xl md:text-4xl text-brand-400 leading-none">
                    {num}
                  </p>
                  <p className="text-sm text-slate-500 mt-1.5 max-w-[160px]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SOBRE ──────────────────────────────────────────── */}
      <section id="sobre" className="section section-alt" aria-label="Sobre a AccessSim">
        <div className="container-app">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="badge mb-4 inline-block">Nossa missão</span>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                Transformando a forma como espaços são projetados e aprovados
              </h2>
              <div className="divider" />
              <p className="text-slate-400 leading-relaxed mb-4">
                A AccessSim nasceu para transformar a maneira como arquitetos,
                engenheiros, construtoras e órgãos públicos analisam, projetam e
                aprovam espaços — garantindo ambientes seguros, inclusivos e
                acessíveis para todos.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Com foco em inclusão, sustentabilidade e tecnologia aplicada,
                posicionamo-nos como parceira estratégica de empresas e profissionais
                que buscam ir além da obrigação legal, criando projetos que unem
                inteligência, agilidade e acessibilidade.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { n: "2025",      label: "Fundada em Aracaju / SE"      },
                { n: "DINOVE",    label: "Incubada na DINOVE / IFS"      },
                { n: "NBR 9050",  label: "Norma de referência central"   },
                { n: "RA + IA",   label: "Tecnologias integradas"        },
              ].map((s) => (
                <Card key={s.n} className="text-center py-8">
                  <p className="font-display font-extrabold text-2xl text-brand-400">
                    {s.n}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">{s.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SOLUÇÃO ─────────────────────────────────────────── */}
      <section id="solucao" className="section" aria-label="Nossa solução">
        <div className="container-app">
          <SectionHeader
            badge="Produto"
            title={
              <>
                A plataforma Access
                <span className="text-brand-400">Sim</span>
              </>
            }
            subtitle="Uma suíte completa para mapear, simular, diagnosticar e corrigir barreiras de acessibilidade em qualquer tipo de espaço construído."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "📱",
                title: "Realidade Aumentada",
                desc: "Sobreponha informações técnicas ao ambiente físico via câmera de smartphone ou tablet — sem equipamentos especiais.",
              },
              {
                icon: "🤖",
                title: "Inteligência Artificial",
                desc: "Nossa IA identifica pontos de não conformidade em tempo real e gera recomendações automáticas de correção.",
              },
              {
                icon: "📄",
                title: "Relatórios Técnicos",
                desc: "Laudos detalhados com base na NBR 9050, prontos para auditorias, aprovações e processos de licenciamento.",
              },
            ].map((f) => (
              <Card key={f.title} className="text-center">
                <div className="text-4xl mb-4" aria-hidden>
                  {f.icon}
                </div>
                <h3 className="text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ───────────────────────────────────── */}
      <section id="como-funciona" className="section section-alt" aria-label="Como funciona">
        <div className="container-app">
          <SectionHeader
            badge="Processo"
            title={
              <>
                Do diagnóstico ao{" "}
                <span className="text-brand-400">plano de ação</span>
              </>
            }
            subtitle="Quatro etapas estruturadas para entregar resultados precisos e acionáveis."
          />
          <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {HOW_STEPS.map((s) => (
              <div key={s.num} className="flex gap-5">
                <span className="font-display font-extrabold text-5xl text-brand-400 leading-none flex-shrink-0 w-14">
                  {s.num}
                </span>
                <div>
                  <h3 className="text-lg mb-2">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFÍCIOS ──────────────────────────────────────── */}
      <section id="beneficios" className="section" aria-label="Benefícios">
        <div className="container-app">
          <SectionHeader
            badge="Por que a AccessSim?"
            title={
              <>
                Resultados que{" "}
                <span className="text-brand-400">falam por si</span>
              </>
            }
            subtitle="Diagnósticos precisos, redução de custos e suporte especializado para transformar seus espaços."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b) => (
              <Card key={b.title}>
                <div className="text-3xl mb-3" aria-hidden>
                  {b.icon}
                </div>
                <h3 className="text-brand-300 text-lg mb-2">{b.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{b.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── PÚBLICO-ALVO ────────────────────────────────────── */}
      <section id="publico" className="section section-alt" aria-label="Público-alvo">
        <div className="container-app">
          <SectionHeader
            badge="Quem atendemos"
            title={
              <>
                Feito para quem{" "}
                <span className="text-brand-400">transforma espaços</span>
              </>
            }
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TARGETS.map((t) => (
              <Card key={t.title}>
                <span className="text-4xl mb-4 block" aria-hidden>
                  {t.emoji}
                </span>
                <h3 className="text-lg mb-2">{t.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{t.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA PILOTO ──────────────────────────────────────── */}
      <section className="section" aria-label="Programa piloto">
        <div className="container-app">
          <div className="bg-gradient-to-br from-navy-800 to-navy-700 border border-white/[0.07] rounded-3xl p-10 md:p-16 text-center">
            <span className="badge mb-6 inline-block">Vagas limitadas</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Seja um parceiro do{" "}
              <span className="text-brand-400">piloto</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
              Seleccionamos organizações parceiras para participar da fase piloto da
              AccessSim com condições especiais. Ajude a moldar o futuro da
              acessibilidade arquitetônica no Brasil.
            </p>
            <a href="#contato" className="btn-primary text-base px-9 py-3.5">
              Quero participar do piloto
            </a>
          </div>
        </div>
      </section>

      {/* ── CASES ───────────────────────────────────────────── */}
      <section id="cases" className="section section-alt" aria-label="Cases e portfólio">
        <div className="container-app">
          <SectionHeader
            badge="Cases"
            title={
              <>
                Espaços{" "}
                <span className="text-brand-400">transformados</span>
              </>
            }
            subtitle="Projetos reais avaliados com a plataforma AccessSim."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                tag: "Educação",
                title: "IFS Campus Lagarto (dado fictício)",
                city: "Lagarto / SE",
                result: "Diagnóstico de acessibilidade do campus com base na NBR 9050",
              },
              {
                tag: "Espaço Público",
                title: "Praça central de Aracaju (dado fictício)",
                city: "Aracaju / SE",
                result: "Mapeamento de barreiras e geração de relatório técnico",
              },
              {
                tag: "Construção Civil",
                title: "Edifício comercial em construção (dado fictício)",
                city: "Aracaju / SE",
                result: "Aprovação de projeto com conformidade total à NBR 9050",
              },
            ].map((c) => (
              <article key={c.title} className="card flex flex-col">
                <span className="badge mb-4 self-start">{c.tag}</span>
                <h3 className="text-lg mb-1">{c.title}</h3>
                <p className="text-xs text-slate-500 mb-4">📍 {c.city}</p>
                <div className="mt-auto pt-4 border-t border-white/[0.06] text-brand-300 font-display font-semibold text-sm">
                  ✓ {c.result}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section id="faq" className="section" aria-label="Perguntas frequentes">
        <div className="container-app max-w-2xl mx-auto">
          <SectionHeader 
            badge="FAQ" 
            title={
              <>
                Perguntas{" "}
                <span className="text-brand-400">frequentes</span>
              </>
            }
          />
          <div>
            {FAQ.map((item) => (
              <FaqItem key={item.q} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTATO ─────────────────────────────────────────── */}
      <section
        id="contato"
        className="section section-alt"
        aria-label="Contato e formulário de leads"
      >
        <div className="container-app max-w-3xl mx-auto">
          <SectionHeader
            badge="Contato"
            title={
              <>
                Vamos{" "}
                <span className="text-brand-400">conversar?</span>
              </>
            }
            subtitle="Preencha o formulário e nossa equipe entrará em contato para apresentar a solução ideal para o seu projeto."
          />
          <div className="card p-8 md:p-10">
            <LeadForm />
          </div>
        </div>
      </section>
    </>
  );
}
