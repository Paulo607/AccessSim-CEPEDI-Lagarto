import { Link } from "react-router-dom";
import { cn }   from "../utils/cn";

/*
  Botão polimórfico:
  - prop `to`   → <Link> interno (React Router)
  - prop `href` → <a> externo
  - padrão      → <button>

  Variantes: "primary" | "secondary" | "ghost"
*/
const VARIANTS = {
  primary:   "btn-primary",
  secondary: "btn-secondary",
  ghost:     "btn-ghost",
};

export default function Button({
  variant   = "primary",
  to,
  href,
  className = "",
  children,
  ...props
}) {
  const cls = cn(VARIANTS[variant], className);

  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...props}>{children}</a>;
  }
  if (to) {
    return <Link to={to} className={cls} {...props}>{children}</Link>;
  }
  return <button type="button" className={cls} {...props}>{children}</button>;
}
