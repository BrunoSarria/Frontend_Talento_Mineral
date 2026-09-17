import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumb?: ReactNode;
  /** Rótulo contextual acima do título (ex.: "BASE QUALIFICADA ES"). */
  eyebrow?: string;
  /** Texto auxiliar ao lado do eyebrow (ex.: "Atualizado há 14 minutos"). */
  eyebrowMeta?: string;
}

export function PageHeader({ title, subtitle, actions, breadcrumb, eyebrow, eyebrowMeta }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        {breadcrumb && <div className="mb-2">{breadcrumb}</div>}
        {(eyebrow || eyebrowMeta) && (
          <p className="mb-1.5 flex flex-wrap items-center gap-2">
            {eyebrow && (
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-primary)]">{eyebrow}</span>
            )}
            {eyebrowMeta && <span className="text-[12px] text-[var(--color-text-muted)]">{eyebrowMeta}</span>}
          </p>
        )}
        <h1 className="font-display text-[28px] font-extrabold leading-9 text-[var(--color-text)] md:text-[32px] md:leading-10">
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 max-w-2xl text-sm text-[var(--color-text-secondary)]">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  );
}
