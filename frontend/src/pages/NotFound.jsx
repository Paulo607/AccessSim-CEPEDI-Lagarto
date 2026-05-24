import { Link }              from "react-router-dom";
import { useDocumentTitle }  from "../hooks/useDocumentTitle";

export default function NotFound() {
  useDocumentTitle("404 — Página não encontrada");
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="font-display font-extrabold text-[9rem] leading-none text-white/[0.04] select-none text-brand-400/90">
        404
      </p>
      <h1 className="font-display font-bold text-3xl text-white -mt-4 mb-4">
        Página não encontrada
      </h1>
      <p className="text-slate-400 mb-8 max-w-sm">
        A URL que você tentou acessar não existe ou foi movida.
      </p>
      <Link to="/" className="btn-primary">← Voltar para o site</Link>
    </main>
  );
}
