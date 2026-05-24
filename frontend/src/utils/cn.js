/** Combina classes Tailwind de forma condicional sem dependência extra */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
