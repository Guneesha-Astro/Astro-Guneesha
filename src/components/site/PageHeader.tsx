import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="starfield absolute inset-0 opacity-70" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-20">
        {eyebrow && (
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold/80">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 max-w-3xl text-3xl leading-tight text-starlight md:text-5xl">
          {title}
        </h1>
        {lead && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {lead}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
