import { useState, useEffect, useCallback } from "react";

import {
  Inbox, Download, X, ArrowLeft, AlertTriangle,
  ExternalLink, LogOut, ChevronLeft, ChevronRight,
  Search, SlidersHorizontal, BarChart2, ChevronDown, ChevronUp,
} from "lucide-react";

import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { adminLogin, fetchLeads, downloadCsv, downloadXlsx } from "../hooks/useApi";
import { cn } from "../utils/cn";

/* ── Links de navegação do painel admin ────────────────────── */
const ADMIN_NAV_LINKS = [
  { href: "#leads",    label: "Leads"    },
  { href: "#graficos", label: "Gráficos" },
  { href: "#filtros",  label: "Filtros"  },
];

/* ── Login ─────────────────────────────────────────────────── */
function AdminLogin({ onLogin }) {
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [busy,  setBusy]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true); setError("");
    try {
      const data = await adminLogin(creds.username, creds.password);
      onLogin(data.token, data.username);
    } catch (err) {
      setError(err?.erro || "Falha ao conectar com o servidor.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="font-display font-extrabold text-4xl text-white text-center mb-2">
          Access<span className="text-brand-400">Sim</span>
        </p>
        <p className="text-slate-500 text-base text-center mb-8">Painel administrativo</p>
        <div className="card p-8">
          <form onSubmit={handleSubmit} noValidate aria-label="Login admin">
            <div className="mb-4">
              <label htmlFor="a-user" className="form-label">Usuário</label>
              <input id="a-user" type="text" className="form-input"
                value={creds.username}
                onChange={(e) => setCreds((c) => ({ ...c, username: e.target.value }))}
                autoComplete="username" required aria-required="true" />
            </div>
            <div className="mb-6">
              <label htmlFor="a-pass" className="form-label">Senha</label>
              <input id="a-pass" type="password" className="form-input"
                value={creds.password}
                onChange={(e) => setCreds((c) => ({ ...c, password: e.target.value }))}
                autoComplete="current-password" required aria-required="true" />
            </div>
            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm" role="alert">
                <AlertTriangle size={16} aria-hidden="true" /> {error}
              </div>
            )}
            <button type="submit" className="btn-primary w-full justify-center" disabled={busy} aria-busy={busy}>
              {busy ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </div>
        <p className="text-center mt-6 text-xs text-slate-500">
          <a href="/" className="text-brand-400 hover:text-brand-300 inline-flex items-center gap-1">
            <ArrowLeft size={12} aria-hidden="true" /> Voltar ao site
          </a>
        </p>
      </div>
    </div>
  );
}

/* ── Helpers visuais ───────────────────────────────────────── */
const INTEREST_STYLES = {
  demo:       { label: "Demo",     color: "text-orange-400 bg-orange-400/10 border-orange-400/30" },
  piloto:     { label: "Piloto",   color: "text-blue-400   bg-blue-400/10   border-blue-400/30"   },
  parceria:   { label: "Parceria", color: "text-green-400  bg-green-400/10  border-green-400/30"  },
  informacao: { label: "Info",     color: "text-slate-400  bg-slate-400/10  border-slate-400/30"  },
};

const SEGMENT_LABEL = {
  prefeitura: "Prefeitura", construtora: "Construtora",
  arquitetura: "Arquitetura", academia: "Academia", outro: "Outro",
};
const INTEREST_LABEL = {
  demo: "Demo", piloto: "Piloto", parceria: "Parceria", informacao: "Informação",
};

function InterestBadge({ value }) {
  const s = INTEREST_STYLES[value] ?? INTEREST_STYLES.informacao;
  return (
    <span className={cn("inline-flex px-2 py-0.5 rounded-full text-xs font-display font-semibold border", s.color)}>
      {s.label}
    </span>
  );
}

function StatCard({ label, value, color = "text-brand-400" }) {
  return (
    <div className="card p-5 text-center">
      <p className={cn("font-display font-extrabold text-3xl leading-none", color)}>{value}</p>
      <p className="text-xs text-slate-500 mt-2">{label}</p>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-t border-white/[0.04]">
      {[140, 200, 160, 80, 100, 90].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-3.5 rounded animate-pulse bg-white/[0.06]" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-400/10 border border-brand-400/30 text-brand-300">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 text-brand-400 hover:text-white transition-colors"
        aria-label={`Remover filtro ${label}`}
      >
        <X size={11} aria-hidden="true" />
      </button>
    </span>
  );
}

/* ── Gráficos ──────────────────────────────────────────────── */
const INTEREST_CHART_COLORS = {
  Demo: "#fb923c", Piloto: "#60a5fa", Parceria: "#4ade80", Info: "#94a3b8",
};
const SEGMENT_PALETTE = ["#818cf8", "#34d399", "#f472b6", "#facc15", "#94a3b8"];
const SEG_LABELS = {
  prefeitura: "Prefeitura", construtora: "Construtora",
  arquitetura: "Arquitetura", academia: "Academia", outro: "Outro",
};

/* ── Dashboard ─────────────────────────────────────────────── */
function AdminDashboard({ token, username, onLogout }) {
  const [leads,           setLeads]        = useState([]);
  const [total,           setTotal]        = useState(0);
  const [stats,           setStats]        = useState({});
  const [segmentStats,    setSegmentStats] = useState([]);
  const [loading,         setLoading]      = useState(true);
  const [error,           setError]        = useState("");

  const [search,         setSearch]         = useState("");
  const [filterSegment,  setFilterSegment]  = useState("");
  const [filterInterest, setFilterInterest] = useState("");
  const [filterCity,     setFilterCity]     = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [showCharts,  setShowCharts]  = useState(true);

  const [downloading,     setDownloading]     = useState(false);
  const [downloadingXlsx, setDownloadingXlsx] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  /* ── Navbar state (igual ao Header do Home) ─────────────── */
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

  /* ── Dados ──────────────────────────────────────────────── */
  const buildParams = useCallback(() => ({
    search, segment: filterSegment, interest: filterInterest, city: filterCity,
  }), [search, filterSegment, filterInterest, filterCity]);

  const load = useCallback(async (params = {}) => {
    setLoading(true); setError("");
    try {
      const data = await fetchLeads(token, params);
      setLeads(data.leads);
      setTotal(data.total);
      const counts = { demo: 0, piloto: 0, parceria: 0, informacao: 0 };
      data.leads.forEach((l) => { if (l.interest in counts) counts[l.interest]++; });
      setStats(counts);
      const segMap = {};
      data.leads.forEach((l) => { if (l.segment) segMap[l.segment] = (segMap[l.segment] || 0) + 1; });
      setSegmentStats(Object.entries(segMap).map(([k, v]) => ({ name: SEG_LABELS[k] || k, value: v })));
    } catch (err) {
      setError(err?.erro || "Falha ao carregar leads.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  async function handleExport() {
    setDownloading(true);
    try { await downloadCsv(token, buildParams()); }
    catch { alert("Falha ao exportar CSV."); }
    finally { setDownloading(false); }
  }

  async function handleExportXlsx() {
    setDownloadingXlsx(true);
    try { await downloadXlsx(token, buildParams()); }
    catch { alert("Falha ao exportar XLSX."); }
    finally { setDownloadingXlsx(false); }
  }

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    load(buildParams());
  }

  function handleClearAll() {
    setSearch(""); setFilterSegment(""); setFilterInterest(""); setFilterCity("");
    setPage(1);
    load({});
  }

  const activeChips = [
    search         && { key: "search",   label: `"${search}"`,                  clear: () => { setSearch("");         load({ ...buildParams(), search:   "" }); } },
    filterSegment  && { key: "segment",  label: SEGMENT_LABEL[filterSegment],    clear: () => { setFilterSegment("");  load({ ...buildParams(), segment:  "" }); } },
    filterInterest && { key: "interest", label: INTEREST_LABEL[filterInterest],  clear: () => { setFilterInterest(""); load({ ...buildParams(), interest: "" }); } },
    filterCity     && { key: "city",     label: `Cidade: ${filterCity}`,         clear: () => { setFilterCity("");     load({ ...buildParams(), city:     "" }); } },
  ].filter(Boolean);

  const hasActiveFilters = activeChips.length > 0;
  const advancedCount = [filterSegment, filterInterest, filterCity].filter(Boolean).length;

  const totalPages = Math.ceil(leads.length / PER_PAGE);
  const paginated  = leads.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const interestChartData = [
    { name: "Demo",     value: stats.demo       || 0 },
    { name: "Piloto",   value: stats.piloto     || 0 },
    { name: "Parceria", value: stats.parceria   || 0 },
    { name: "Info",     value: stats.informacao || 0 },
  ].filter((d) => d.value > 0);

  return (
    <div className="min-h-screen bg-navy-950 pb-20">

      {/* ── Header (igual ao Home) ──────────────────────────── */}
      <>
        <header
          role="banner"
          className={[
            "fixed top-0 inset-x-0 z-50 transition-all duration-300",
            scrolled || menuOpen
              ? "bg-navy-950/95 backdrop-blur-md border-b border-white/[0.06] py-3"
              : "bg-navy-950/95 backdrop-blur-md border-b border-white/[0.06] py-5",
          ].join(" ")}
        >
          <div className="container-app flex items-center justify-between">

            {/* LOGO */}
            <a
              href="/"
              className="font-display font-extrabold text-[24px] text-white tracking-tight relative z-50"
              aria-label="AccessSim — página inicial"
            >
              <div className="flex items-center gap-2">
                <img
                  src="/logo-AccessSim.png"
                  alt="Logo AccessSim"
                  className="transition-transform duration-700 hover:rotate-[360deg] active:rotate-[360deg]"
                  width={40}
                />
                <div>
                  <span>Access</span>
                  <span className="text-brand-400">Sim</span>
                </div>
              </div>
            </a>

            {/* NAV DESKTOP */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Navegação admin">
              {ADMIN_NAV_LINKS.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="px-3 py-1.5 text-sm font-medium text-slate-400 rounded-lg transition-colors duration-150 hover:text-white hover:bg-white/5"
                >
                  {label}
                </a>
              ))}
            </nav>

            {/* AÇÕES DIREITA + BOTÃO MOBILE */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-400 hidden sm:block">
                Olá, <strong className="text-white">{username}</strong>
              </span>
              <a
                href="/"
                className="btn-ghost py-1.5 px-3 text-xs hidden lg:inline-flex items-center gap-1"
              >
                Site <ExternalLink size={12} aria-hidden="true" />
              </a>
              <button
                className="btn-ghost py-1.5 px-3 text-xs hidden lg:inline-flex items-center gap-1.5"
                onClick={onLogout}
              >
                <LogOut size={12} aria-hidden="true" /> Sair
              </button>

              {/* Botão hambúrguer — mobile */}
              <button
                className="lg:hidden relative z-50 flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-white/5 transition-colors"
                aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={menuOpen}
                aria-controls="admin-mobile-menu"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <span className={`absolute block w-5 h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? "rotate-45" : "-translate-y-1.5"}`} />
                <span className={`absolute block w-5 h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : "opacity-100"}`} />
                <span className={`absolute block w-5 h-0.5 bg-white rounded transition-all duration-300 ${menuOpen ? "-rotate-45" : "translate-y-1.5"}`} />
              </button>
            </div>
          </div>
        </header>

        {/* MENU MOBILE */}
        <div
          id="admin-mobile-menu"
          className={[
            "lg:hidden fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-navy-950 transition-all duration-300",
            menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          ].join(" ")}
        >
          <nav aria-label="Navegação admin mobile">
            <ul className="flex flex-col items-center gap-2">
              {ADMIN_NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-6 py-3 text-2xl font-display font-semibold text-white hover:text-brand-400 transition-colors rounded-xl hover:bg-white/5"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <p className="text-sm text-slate-400">
            Olá, <strong className="text-white">{username}</strong>
          </p>
          <div className="flex gap-3">
            <a href="/" className="btn-ghost py-2 px-4 text-sm inline-flex items-center gap-1.5">
              Site <ExternalLink size={13} aria-hidden="true" />
            </a>
            <button
              className="btn-ghost py-2 px-4 text-sm inline-flex items-center gap-1.5"
              onClick={onLogout}
            >
              <LogOut size={13} aria-hidden="true" /> Sair
            </button>
          </div>
        </div>
      </>

      {/* ── Main ────────────────────────────────────────────── */}
      <main id="main-content" tabIndex={-1} className="container-app pt-24">

        {/* ── Cabeçalho ──────────────────────────────────────── */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold mb-1">Leads captados</h1>
            <p className="text-sm text-slate-500">
              {loading ? "Carregando…" : `${total} lead${total !== 1 ? "s" : ""} no banco`}
              {hasActiveFilters && !loading && (
                <span className="ml-2 text-brand-400">(filtrado)</span>
              )}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <button
                className="btn-ghost inline-flex items-center gap-1.5"
                onClick={handleExport}
                disabled={downloading || loading}
                aria-busy={downloading}
              >
                <Download size={14} aria-hidden="true" />
                {downloading ? "Exportando…" : "CSV"}
              </button>
              <button
                className="btn-primary inline-flex items-center gap-1.5"
                onClick={handleExportXlsx}
                disabled={downloadingXlsx || loading}
                aria-busy={downloadingXlsx}
              >
                <Download size={14} aria-hidden="true" />
                {downloadingXlsx ? "Exportando…" : "XLSX"}
              </button>
            </div>
            <p className="text-xs text-slate-600">
              {hasActiveFilters ? "Exportando seleção filtrada" : "Exportando todos os leads"}
            </p>
          </div>
        </div>

        {/* ── Cards de stats ─────────────────────────────────── */}
        <div id="leads" className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8 scroll-mt-24">
          <StatCard label="Total"    value={total}                  />
          <StatCard label="Demo"     value={stats.demo       ?? "—"} color="text-orange-400" />
          <StatCard label="Piloto"   value={stats.piloto     ?? "—"} color="text-blue-400"   />
          <StatCard label="Parceria" value={stats.parceria   ?? "—"} color="text-green-400"  />
          <StatCard label="Info"     value={stats.informacao ?? "—"} color="text-slate-400"  />
        </div>

        {/* ── Gráficos (colapsável) ───────────────────────────── */}
        <div id="graficos" className="mb-8 scroll-mt-24">
          <button
            className="btn-ghost py-1.5 px-3 text-xs inline-flex items-center gap-1.5 mb-4"
            onClick={() => setShowCharts((v) => !v)}
          >
            <BarChart2 size={13} aria-hidden="true" />
            {showCharts ? "Ocultar gráficos" : "Mostrar gráficos"}
            {showCharts
              ? <ChevronUp size={12} aria-hidden="true" />
              : <ChevronDown size={12} aria-hidden="true" />}
          </button>

          {showCharts && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {interestChartData.length > 0 && (
                <div className="card p-5">
                  <p className="text-sm font-semibold text-slate-300 mb-4">Distribuição por interesse</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={interestChartData} cx="50%" cy="50%"
                        innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {interestChartData.map((entry) => (
                          <Cell key={entry.name} fill={INTEREST_CHART_COLORS[entry.name] || "#94a3b8"} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }} itemStyle={{ color: "#e2e8f0" }} />
                      <Legend iconType="circle" iconSize={8} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
              {segmentStats.length > 0 && (
                <div className="card p-5">
                  <p className="text-sm font-semibold text-slate-300 mb-4">Distribuição por segmento</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={segmentStats} layout="vertical" margin={{ left: 10, right: 24 }}>
                      <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" width={90} tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }} itemStyle={{ color: "#e2e8f0" }} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {segmentStats.map((_, i) => (
                          <Cell key={i} fill={SEGMENT_PALETTE[i % SEGMENT_PALETTE.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Busca + filtros ─────────────────────────────────── */}
        <div id="filtros" className="mb-6 space-y-3 scroll-mt-24">

          <form onSubmit={handleSearch} role="search" aria-label="Buscar leads" className="flex flex-col gap-2 sm:flex-row">
            <div className="relative w-full sm:flex-1 sm:max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" aria-hidden="true" />
              <input
                type="search"
                className="form-input pl-8 w-full"
                placeholder="Buscar por nome ou e-mail…"
                aria-label="Buscar por nome ou e-mail"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-ghost inline-flex w-full items-center justify-center gap-1.5 sm:w-auto">
              <Search size={14} aria-hidden="true" /> Buscar
            </button>

            <button
              type="button"
              className={cn(
                "btn-ghost relative inline-flex w-full items-center justify-center gap-1.5 sm:w-auto",
                showFilters && "bg-white/[0.06]"
              )}
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              aria-controls="advanced-filters"
            >
              <SlidersHorizontal size={14} aria-hidden="true" />
              Filtros
              {advancedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-brand-400 text-navy-950 text-[10px] font-bold flex items-center justify-center">
                  {advancedCount}
                </span>
              )}
              {showFilters
                ? <ChevronUp size={12} aria-hidden="true" />
                : <ChevronDown size={12} aria-hidden="true" />}
            </button>
          </form>

          {showFilters && (
            <div
              id="advanced-filters"
              className="card grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <label className="text-xs text-slate-500 font-medium">Segmento</label>
                <select
                  className="form-input w-full"
                  value={filterSegment}
                  onChange={(e) => { setFilterSegment(e.target.value); setPage(1); load({ ...buildParams(), segment: e.target.value }); }}
                  aria-label="Filtrar por segmento"
                >
                  <option value="">Todos</option>
                  <option value="prefeitura">Prefeitura</option>
                  <option value="construtora">Construtora</option>
                  <option value="arquitetura">Arquitetura</option>
                  <option value="academia">Academia</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div className="flex min-w-0 flex-col gap-1">
                <label className="text-xs text-slate-500 font-medium">Interesse</label>
                <select
                  className="form-input w-full"
                  value={filterInterest}
                  onChange={(e) => { setFilterInterest(e.target.value); setPage(1); load({ ...buildParams(), interest: e.target.value }); }}
                  aria-label="Filtrar por interesse"
                >
                  <option value="">Todos</option>
                  <option value="demo">Demo</option>
                  <option value="piloto">Piloto</option>
                  <option value="parceria">Parceria</option>
                  <option value="informacao">Informação</option>
                </select>
              </div>

              <div className="flex min-w-0 flex-col gap-1">
                <label className="text-xs text-slate-500 font-medium">Cidade</label>
                <input
                  type="text"
                  className="form-input w-full"
                  placeholder="Ex: Aracaju"
                  aria-label="Filtrar por cidade"
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); setPage(1); load({ ...buildParams(), city: filterCity }); } }}
                />
              </div>

              {advancedCount > 0 && (
                <button
                  type="button"
                  className="btn-ghost inline-flex w-full items-center justify-center gap-1.5 px-3 py-2 text-sm text-slate-400 sm:col-span-2 lg:col-span-1 lg:w-auto lg:self-end"
                  onClick={() => { setFilterSegment(""); setFilterInterest(""); setFilterCity(""); setPage(1); load({ ...buildParams(), segment: "", interest: "", city: "" }); }}
                >
                  <X size={13} aria-hidden="true" /> Limpar filtros
                </button>
              )}
            </div>
          )}

          {hasActiveFilters && (
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">Ativos:</span>
              {activeChips.map((chip) => (
                <FilterChip key={chip.key} label={chip.label} onRemove={chip.clear} />
              ))}
              {activeChips.length > 1 && (
                <button
                  type="button"
                  className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-2 transition-colors"
                  onClick={handleClearAll}
                >
                  Limpar todos
                </button>
              )}
            </div>
          )}
        </div>

        {/* Erro */}
        {error && (
          <div className="flex items-center justify-between gap-4 p-4 mb-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm" role="alert">
            <span className="inline-flex items-center gap-2">
              <AlertTriangle size={16} aria-hidden="true" /> {error}
            </span>
            <button className="underline text-xs" onClick={() => load()}>Tentar novamente</button>
          </div>
        )}

        {/* Tabela */}
        <div className="rounded-2xl border border-white/[0.07] overflow-hidden overflow-x-auto">
          <table className="w-full text-sm border-collapse" aria-label="Tabela de leads">
            <thead>
              <tr className="bg-navy-800 text-left">
                {["Nome", "E-mail", "Organização", "Interesse", "Cidade", "Data"].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-display font-semibold text-xs text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
              {!loading && paginated.map((lead, i) => (
                <tr key={lead.id} className={cn("border-t border-white/[0.04] transition-colors duration-100 hover:bg-white/[0.03]", i % 2 !== 0 && "bg-white/[0.01]")}>
                  <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{lead.name}</td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${lead.email}`} className="text-brand-300 hover:text-brand-400 text-[0.8125rem]">{lead.email}</a>
                  </td>
                  <td className="px-4 py-3 text-slate-300 max-w-[180px] truncate">
                    {lead.organization || <span className="text-slate-600">—</span>}
                  </td>
                  <td className="px-4 py-3"><InterestBadge value={lead.interest} /></td>
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                    {lead.city || <span className="text-slate-600">—</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                    {new Date(lead.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && leads.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <Inbox size={40} className="mx-auto mb-3 text-slate-600" aria-hidden="true" />
              <p>Nenhum lead encontrado.</p>
              {hasActiveFilters && (
                <button className="btn-ghost mt-4 text-sm py-2 inline-flex items-center gap-1.5" onClick={handleClearAll}>
                  <X size={13} aria-hidden="true" /> Limpar filtros
                </button>
              )}
            </div>
          )}
        </div>

        {/* Paginação */}
        {!loading && totalPages > 1 && (
          <nav aria-label="Paginação" className="flex justify-center items-center gap-3 mt-6">
            <button className="btn-ghost py-2 px-4 text-sm inline-flex items-center gap-1.5" disabled={page === 1} onClick={() => setPage((p) => p - 1)} aria-label="Página anterior">
              <ChevronLeft size={14} aria-hidden="true" /> Anterior
            </button>
            <span className="text-sm text-slate-400">{page} / {totalPages}</span>
            <button className="btn-ghost py-2 px-4 text-sm inline-flex items-center gap-1.5" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} aria-label="Próxima página">
              Próxima <ChevronRight size={14} aria-hidden="true" />
            </button>
          </nav>
        )}
      </main>
    </div>
  );
}

/* ── Orquestrador ──────────────────────────────────────────── */
export default function Admin() {
  useDocumentTitle("Admin");
  const [session, setSession] = useState(() => {
    const token    = sessionStorage.getItem("admin_token");
    const username = sessionStorage.getItem("admin_user");
    return token ? { token, username } : null;
  });
  function handleLogin(token, username) {
    sessionStorage.setItem("admin_token", token);
    sessionStorage.setItem("admin_user", username);
    setSession({ token, username });
  }
  function handleLogout() {
    sessionStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_user");
    setSession(null);
  }
  if (!session) return <AdminLogin onLogin={handleLogin} />;
  return <AdminDashboard token={session.token} username={session.username} onLogout={handleLogout} />;
}