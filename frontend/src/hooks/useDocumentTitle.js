import { useEffect } from "react";

export function useDocumentTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = title
      ? `${title} | AccessSim`
      : "AccessSim — Acessibilidade que transforma espaços";
    return () => { document.title = prev; };
  }, [title]);
}
