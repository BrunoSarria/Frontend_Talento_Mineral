import { Card } from "../ui/Card";

interface CreditBalanceCardProps {
  label: string;
  value: number;
  emphasis?: boolean;
}

export function CreditBalanceCard({ label, value, emphasis }: CreditBalanceCardProps) {
  return (
    <Card className={emphasis ? "bg-[var(--color-primary)]" : ""}>
      <p className={emphasis ? "text-sm text-white/75 dark:text-[#17231a]/70" : "text-sm text-[var(--color-text-secondary)]"}>{label}</p>
      <p className={`mt-1 font-display text-4xl font-semibold ${emphasis ? "text-white dark:text-[#17231a]" : "text-[var(--color-text)]"}`}>{value}</p>
      {emphasis && <p className="mt-1 text-sm text-white/75 dark:text-[#17231a]/70">créditos disponíveis</p>}
    </Card>
  );
}
