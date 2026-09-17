import { Card } from "../ui/Card";

interface PricingRow {
  title: string;
  description: string;
  cost: string;
}

/**
 * Tabela de tarifação — custos fixos pré-definidos, sem taxas ocultas.
 * Reforça a transparência transacional exigida pelo produto.
 */
const ROWS: PricingRow[] = [
  {
    title: "Desbloqueio de currículo",
    description: "Telefone, WhatsApp e e-mail verificados. Acesso permanente para sua empresa.",
    cost: "1 CR",
  },
  {
    title: "Publicação de nova vaga",
    description: "Divulgação ativa com triagem de currículos compatíveis.",
    cost: "0 CR",
  },
  {
    title: "Busca avançada & triagem",
    description: "Filtros por cidade, categoria, CNH, experiência e comparação em lote.",
    cost: "0 CR",
  },
];

export function PricingTable() {
  return (
    <Card>
      <h2 className="font-display text-[16px] font-bold text-[var(--color-text)]">Tabela de tarifação</h2>
      <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">
        Custos fixos pré-definidos, sem taxas ocultas.
      </p>

      <ul className="mt-4 flex flex-col gap-2">
        {ROWS.map((row) => (
          <li
            key={row.title}
            className="flex items-start justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] p-3"
          >
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-[var(--color-text)]">{row.title}</p>
              <p className="mt-0.5 text-[12px] text-[var(--color-text-secondary)]">{row.description}</p>
            </div>
            <span className="shrink-0 rounded-[var(--radius-sm)] bg-[var(--color-accent-soft)] px-2.5 py-1 text-[13px] font-extrabold tabular text-[var(--color-accent)]">
              {row.cost}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-3 flex items-center gap-1.5 text-[12px] text-[var(--color-text-muted)]">
        <span aria-hidden="true">✓</span> Desbloqueio permanente garantido, sem expiração de créditos.
      </p>
    </Card>
  );
}
