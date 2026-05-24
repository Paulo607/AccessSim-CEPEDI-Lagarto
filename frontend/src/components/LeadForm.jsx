import { useState } from "react";
import { postLead } from "../hooks/useApi";
import { cn }       from "../utils/cn";

const INITIAL_STATE = {
  name: "", email: "", organization: "", role: "",
  phone: "", city: "", segment: "", interest: "demo",
  message: "", consent: false, source: "site",
};

/** Exibe a primeira mensagem de erro de um campo, se houver */
function FieldError({ errors, field }) {
  const msgs = errors?.[field];
  if (!msgs?.length) return null;
  return (
    <span className="flex items-center gap-1 text-xs text-red-400 mt-1" role="alert" aria-live="polite">
      <span aria-hidden>⚠</span>
      {Array.isArray(msgs) ? msgs[0] : msgs}
    </span>
  );
}

export default function LeadForm({ defaultInterest = "demo" }) {
  const [form,      setForm]      = useState({ ...INITIAL_STATE, interest: defaultInterest });
  const [errors,    setErrors]    = useState({});
  const [status,    setStatus]    = useState("idle"); // idle | loading | success | error
  const [globalMsg, setGlobalMsg] = useState("");

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrors({});
    setGlobalMsg("");
    try {
      const res = await postLead(form);
      setStatus("success");
      setGlobalMsg(res.mensagem);
      setForm({ ...INITIAL_STATE, interest: defaultInterest });
    } catch (err) {
      setStatus("error");
      if (err?.erros) {
        setErrors(err.erros);
        setGlobalMsg("Corrija os campos destacados e tente novamente.");
      } else {
        setGlobalMsg("Falha na conexão. Tente novamente em instantes.");
      }
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-300" role="status">
        <span className="text-xl mt-0.5" aria-hidden>✓</span>
        <div>
          <p className="font-display font-semibold">Mensagem enviada!</p>
          <p className="text-sm mt-1 text-green-400/80">{globalMsg}</p>
        </div>
      </div>
    );
  }

  const busy = status === "loading";

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Formulário de contato AccessSim">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Nome */}
        <div>
          <label htmlFor="f-name" className="form-label">
            Nome completo <span className="text-brand-400" aria-hidden>*</span>
          </label>
          <input id="f-name" type="text"
            className={cn("form-input", errors.name && "form-input-error")}
            placeholder="Alexandre Michael" value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required aria-required="true" autoComplete="name" />
          <FieldError errors={errors} field="name" />
        </div>

        {/* E-mail */}
        <div>
          <label htmlFor="f-email" className="form-label">
            E-mail <span className="text-brand-400" aria-hidden>*</span>
          </label>
          <input id="f-email" type="email"
            className={cn("form-input", errors.email && "form-input-error")}
            placeholder="alexandre@prefeitura.gov.br" value={form.email}
            onChange={(e) => set("email", e.target.value)}
            required aria-required="true" autoComplete="email" />
          <FieldError errors={errors} field="email" />
        </div>

        {/* Organização */}
        <div>
          <label htmlFor="f-org" className="form-label">Organização</label>
          <input id="f-org" type="text" className="form-input"
            placeholder="Prefeitura de Lagarto" value={form.organization}
            onChange={(e) => set("organization", e.target.value)} autoComplete="organization" />
        </div>

        {/* Cargo */}
        <div>
          <label htmlFor="f-role" className="form-label">Cargo / função</label>
          <input id="f-role" type="text" className="form-input"
            placeholder="Coordenadora de Acessibilidade" value={form.role}
            onChange={(e) => set("role", e.target.value)} />
        </div>

        {/* Telefone */}
        <div>
          <label htmlFor="f-phone" className="form-label">Telefone</label>
          <input id="f-phone" type="tel" className="form-input"
            placeholder="+55 79 4002-8922" value={form.phone}
            onChange={(e) => set("phone", e.target.value)} autoComplete="tel" />
        </div>

        {/* Cidade */}
        <div>
          <label htmlFor="f-city" className="form-label">Cidade / Estado</label>
          <input id="f-city" type="text" className="form-input"
            placeholder="Lagarto / SE" value={form.city}
            onChange={(e) => set("city", e.target.value)} autoComplete="address-level2" />
        </div>

        {/* Segmento */}
        <div>
          <label htmlFor="f-segment" className="form-label">Segmento</label>
          <select id="f-segment"
            className="form-input appearance-none cursor-pointer"
            value={form.segment} onChange={(e) => set("segment", e.target.value)}>
            <option value="">Selecione…</option>
            <option value="prefeitura">Prefeitura / Órgão público</option>
            <option value="construtora">Construtora / Incorporadora</option>
            <option value="arquitetura">Arquitetura / Engenharia</option>
            <option value="ong">ONG / Terceiro setor</option>
            <option value="academia">Academia / Pesquisa</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        {/* Interesse */}
        <div>
          <label htmlFor="f-interest" className="form-label">
            Como posso ajudar? <span className="text-brand-400" aria-hidden>*</span>
          </label>
          <select id="f-interest"
            className="form-input appearance-none cursor-pointer"
            value={form.interest} onChange={(e) => set("interest", e.target.value)} required>
            <option value="demo">Agendar demo</option>
            <option value="piloto">Participar do piloto</option>
            <option value="parceria">Proposta de parceria</option>
            <option value="informacao">Mais informações</option>
          </select>
        </div>
      </div>

      {/* Mensagem */}
      <div className="mt-4">
        <label htmlFor="f-message" className="form-label">Mensagem</label>
        <textarea id="f-message"
          className="form-input resize-y min-h-[120px]"
          placeholder="Conte-nos sobre seu projeto ou dúvida…"
          value={form.message} onChange={(e) => set("message", e.target.value)} rows={4} />
      </div>

      {/* Consentimento LGPD */}
      <label className={cn(
        "flex items-start gap-3 mt-4 cursor-pointer",
        errors.consent && "ring-1 ring-red-500/50 rounded-lg p-2"
      )}>
        <input type="checkbox"
          className="w-4 h-4 mt-0.5 accent-brand-400 cursor-pointer flex-shrink-0"
          checked={form.consent} required aria-required="true"
          onChange={(e) => set("consent", e.target.checked)} />
        <span className="text-sm text-slate-300 leading-relaxed">
          Concordo com o uso dos meus dados para contato pela equipe AccessSim,
          conforme a{" "}
          <a href="#" className="text-brand-400 hover:text-brand-300 underline underline-offset-2">
            Política de Privacidade
          </a>.{" "}
          <strong className="text-brand-400">*</strong>
        </span>
      </label>
      <FieldError errors={errors} field="consent" />

      {/* Erro global */}
      {status === "error" && globalMsg && (
        <div className="flex items-center gap-2 p-3 mt-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm" role="alert">
          ⚠ {globalMsg}
        </div>
      )}

      <div className="mt-6">
        <button type="submit" className="btn-primary" disabled={busy} aria-busy={busy}>
          {busy ? "Enviando…" : "Enviar mensagem"}
        </button>
      </div>
    </form>
  );
}
