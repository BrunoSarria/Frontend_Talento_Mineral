import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import { paymentService } from "../../services/paymentService";
import { formatCurrency, formatDate } from "../../utils/format";
import type { Payment, PaymentStatus } from "../../types/payment";

const STATUS_TONE: Record<PaymentStatus, "success" | "warning" | "error"> = {
  APPROVED: "success",
  PENDING: "warning",
  REJECTED: "error",
};
const STATUS_LABEL: Record<PaymentStatus, string> = {
  APPROVED: "Aprovado",
  PENDING: "Pendente",
  REJECTED: "Rejeitado",
};

export function PaymentsSection() {
  const [payments, setPayments] = useState<Payment[] | null>(null);

  useEffect(() => {
    paymentService.getHistory().then((data) => setPayments(data.slice(0, 4)));
  }, []);

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-[var(--color-text)]">Pagamentos</h2>
        <Link to="/historico" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
          Ver histórico completo
        </Link>
      </div>

      {!payments ? (
        <Skeleton className="h-24" />
      ) : payments.length === 0 ? (
        <EmptyState title="Nenhum pagamento registrado ainda." />
      ) : (
        <ul className="flex flex-col divide-y divide-[var(--color-border)]">
          {payments.map((payment) => (
            <li key={payment.id} className="flex items-center justify-between gap-3 py-3 text-sm">
              <div>
                <p className="text-[var(--color-text)]">Pacote {payment.planName}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{formatDate(payment.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[var(--color-text)]">{formatCurrency(payment.amount)}</span>
                <Badge tone={STATUS_TONE[payment.status]} dot>
                  {STATUS_LABEL[payment.status]}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
