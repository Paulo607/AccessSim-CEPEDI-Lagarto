import { useState, useEffect, useCallback } from "react";
import { useDocumentTitle }  from "../hooks/useDocumentTitle";
import { adminLogin, fetchLeads, downloadCsv } from "../hooks/useApi";
import { cn } from "../utils/cn";

/* ── Tela de login ─────────────────────────────────────────── */
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
        <p className="font-display font-extrabold text-2xl text-white text-center mb-1">
          Access<span className="text-brand-400">Sim</span>
        </p>
        <p className="text-slate-500 text-sm text-center mb-8">Painel administrativo</p>

        <div className="card p-8">
          <form onSubmit={handleSubmit} noValidate aria-label="Login admin">
            <div className="mb-4">
              <label htmlFor="a-user" className="form-label">Usuário</label>
              <input id="a-user" type="text" className="form-input"
                value={creds.username} onChange={(e) => setCreds((c) => ({ ...c, username: e.target.value }))}
                autoComplete="username" required aria-required="true" />
            </div>
            <div className="mb-6">
              <label htmlFor="a-pass" className="form-label">Senha</label>
              <input id="a-pass" type="password" className="form-input"
                value={creds.password} onChange={(e) => setCreds((c) => ({ ...c, password: e.target.value }))}
                autoComplete="current-password" required aria-required="true" />
            </div>
            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm" role="alert">
                ⚠ {error}
              </div>
            )}
            <button type="submit" className="btn-primary w-full justify-center" disabled={busy} aria-busy={busy}>
              {busy ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </div>
        <p className="text-center mt-6 text-xs text-slate-500">
          <a href="/" className="text-brand-400 hover:text-brand-300">← Voltar ao site</a>
        </p>
      </div>
    </div>
  );
}

/* ── Helpers visuais ───────────────────────────────────────── */
const INTEREST_STYLES = {
  demo:       { label: "Demo",      color: "text-orange-400 bg-orange-400/10 border-orange-400/30"  },
  piloto:     { label: "Piloto",    color: "text-blue-400   bg-blue-400/10   border-blue-400/30"    },
  parceria:   { label: "Parceria",  color: "text-green-400  bg-green-400/10  border-green-400/30"   },
  informacao: { label: "Info",      color: "text-slate-400  bg-slate-400/10  border-slate-400/30"   },
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

/* ── Dashboard ─────────────────────────────────────────────── */
function AdminDashboard({ token, username, onLogout }) {
  const [leads,       setLeads]       = useState([]);
  const [total,       setTotal]       = useState(0);
  const [stats,       setStats]       = useState({});
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [search,      setSearch]      = useState("");
  const [downloading, setDownloading] = useState(false);
  const [page,        setPage]        = useState(1);
  const PER_PAGE = 20;

  const load = useCallback(async (params = {}) => {
    setLoading(true); setError("");
    try {
      const data = await fetchLeads(token, params);
      setLeads(data.leads);
      setTotal(data.total);
      // Calcula stats por interesse
      const counts = { demo: 0, piloto: 0, parceria: 0 };
      data.leads.forEach((l) => { if (counts[l.interest] !== undefined) counts[l.interest]++; });
      setStats(counts);
    } catch (err) {
      setError(err?.erro || "Falha ao carregar leads.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  async function handleExport() {
    setDownloading(true);
    try { await downloadCsv(token); }
    catch { alert("Falha ao exportar CSV."); }
    finally { setDownloading(false); }
  }

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
    load({ search });
  }

  function handleClear() {
    setSearch(""); setPage(1); load();
  }

  const totalPages = Math.ceil(leads.length / PER_PAGE);
  const paginated  = leads.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="min-h-screen bg-navy-950 pb-20">

      {/* Topbar */}
      <header className="sticky top-0 z-50 bg-navy-900 border-b border-white/[0.06] py-3">
        <div className="container-app flex items-center justify-between">
          <p className="font-display font-bold text-lg">
            Access<span className="text-brand-400">Sim</span>{" "}
            <span className="text-slate-500 font-normal text-sm">Admin</span>
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400 hidden sm:block">
              Olá, <strong className="text-white">{username}</strong>
            </span>
            <a href="/" className="btn-ghost py-1.5 px-3 text-xs">Site ↗</a>
            <button className="btn-ghost py-1.5 px-3 text-xs" onClick={onLogout}>Sair</button>
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="container-app pt-8">

        {/* Cabeçalho + exportar */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold mb-1">Leads captados</h1>
            <p className="text-sm text-slate-500">
              {loading ? "Carregando…" : `${total} lead${total !== 1 ? "s" : ""} no banco`}
            </p>
          </div>
          <button
            className="btn-primary"
            onClick={handleExport}
            disabled={downloading || loading}
            aria-busy={downloading}
          >
            {downloading ? "Exportando…" : "⬇ Exportar CSV"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total"    value={total}           />
          <StatCard label="Demo"     value={stats.demo    ?? "—"} color="text-orange-400" />
          <StatCard label="Piloto"   value={stats.piloto  ?? "—"} color="text-blue-400"   />
          <StatCard label="Parceria" value={stats.parceria ?? "—"} color="text-green-400"  />
        </div>

        {/* Busca */}
        <form onSubmit={handleSearch} role="search" aria-label="Buscar leads"
          className="flex flex-wrap gap-2 mb-6">
          <input type="search" className="form-input max-w-xs flex-1"
            placeholder="Buscar por nome ou e-mail…" aria-label="Termo de busca"
            value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="submit" className="btn-ghost py-3 px-5 text-sm">Buscar</button>
          {search && (
            <button type="button" className="btn-ghost py-3 px-4 text-sm" onClick={handleClear}>
              ✕ Limpar
            </button>
          )}
        </form>

        {/* Erro */}
        {error && (
          <div className="flex items-center justify-between gap-4 p-4 mb-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm" role="alert">
            <span>⚠ {error}</span>
            <button className="underline text-xs" onClick={() => load()}>Tentar novamente</button>
          </div>
        )}

        {/* Tabela */}
        <div className="rounded-2xl border border-white/[0.07] overflow-hidden overflow-x-auto">
          <table className="w-full text-sm border-collapse" aria-label="Tabela de leads">
            <thead>
              <tr className="bg-navy-800 text-left">
                {["Nome", "E-mail", "Organização", "Interesse", "Cidade", "Data"].map((h) => (
                  <th key={h} scope="col"
                    className="px-4 py-3 font-display font-semibold text-xs text-slate-500 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

              {!loading && paginated.map((lead, i) => (
                <tr key={lead.id}
                  className={cn(
                    "border-t border-white/[0.04] transition-colors duration-100 hover:bg-white/[0.03]",
                    i % 2 !== 0 && "bg-white/[0.01]"
                  )}
                >
                  <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{lead.name}</td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${lead.email}`} className="text-brand-300 hover:text-brand-400 text-[0.8125rem]">
                      {lead.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-slate-300 max-w-[180px] truncate">
                    {lead.organization || <span className="text-slate-600">—</span>}
                  </td>
                  <td className="px-4 py-3"><InterestBadge value={lead.interest} /></td>
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                    {lead.city || <span className="text-slate-600">—</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                    {new Date(lead.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Estado vazio */}
          {!loading && leads.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <p className="text-4xl mb-3">📭</p>
              <p>Nenhum lead encontrado.</p>
              {search && (
                <button className="btn-ghost mt-4 text-sm py-2" onClick={handleClear}>
                  Limpar busca
                </button>
              )}
            </div>
          )}
        </div>

        {/* Paginação */}
        {!loading && totalPages > 1 && (
          <nav aria-label="Paginação" className="flex justify-center items-center gap-3 mt-6">
            <button className="btn-ghost py-2 px-4 text-sm" disabled={page === 1}
              onClick={() => setPage((p) => p - 1)} aria-label="Página anterior">
              ← Anterior
            </button>
            <span className="text-sm text-slate-400">{page} / {totalPages}</span>
            <button className="btn-ghost py-2 px-4 text-sm" disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)} aria-label="Próxima página">
              Próxima →
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
