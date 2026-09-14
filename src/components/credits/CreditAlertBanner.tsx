import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { LOW_CREDIT_THRESHOLD, CRITICAL_CREDIT_THRESHOLD } from "../../services/creditService";

interface CreditAlertBannerProps {
  available: number;
}

export function CreditAlertBanner({ available }: CreditAlertBannerProps) {
  if (available > LOW_CREDIT_THRESHOLD) return null;

  const critical = available <= CRITICAL_CREDIT_THRESHOLD;

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] border px-4 py-3.5 ${
        critical ? "border-[var(--color-error-soft)] bg-[var(--color-error-soft)]" : "border-[var(--color-warning-soft)] bg-[var(--color-warning-soft)]"
      }`}
      role="status"
    >
      <p className={`text-sm font-medium ${critical ? "text-[var(--color-error)]" : "text-[var(--color-warning)]"}`}>
        <span aria-hidden="true">{critical ? "🔴" : "⚠"}</span>{" "}
        {critical
          ? `Seus créditos estão acabando. Restam apenas ${available} crédito${available !== 1 ? "s" : ""}.`
          : `Você possui apenas ${available} crédito${available !== 1 ? "s" : ""} disponíve${available !== 1 ? "is" : "l"}.`}
      </p>
      <Link to="/creditos/comprar">
        <Button size="sm" variant={critical ? "danger" : "primary"}>
          Comprar créditos
        </Button>
      </Link>
    </div>
  );
}
