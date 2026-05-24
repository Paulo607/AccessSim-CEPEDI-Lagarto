import { cn } from "../utils/cn";

export default function Card({ children, className, hover = true }) {
  return (
    <div className={cn("card", !hover && "hover:translate-y-0 hover:border-white/[0.07]", className)}>
      {children}
    </div>
  );
}
