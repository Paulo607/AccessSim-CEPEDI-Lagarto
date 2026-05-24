/*
  Cabeçalho padrão de seção: badge + título + subtítulo.
  Centralizado por padrão; use align="left" para alinhar à esquerda.
*/
export default function SectionHeader({ badge, title, subtitle, align = "center" }) {
  const base = align === "left" ? "text-left" : "text-center mx-auto";
  return (
    <div className={`mb-14 max-w-2xl ${base}`}>
      {badge && <span className="badge mb-4 inline-block">{badge}</span>}
      <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">{title}</h2>
      {subtitle && <p className="text-slate-400 text-lg leading-relaxed">{subtitle}</p>}
    </div>
  );
}
