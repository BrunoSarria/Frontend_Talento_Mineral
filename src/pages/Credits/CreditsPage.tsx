import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { ErrorState } from "../../components/ui/ErrorState";
import { CreditBalanceCard } from "../../components/credits/CreditBalanceCard";
import { CreditAlertBanner } from "../../components/credits/CreditAlertBanner";
import { TransactionList } from "../../components/credits/TransactionList";
import { creditService } from "../../services/creditService";
import type { CreditBalance, CreditTransaction } from "../../types/credit";

export function CreditsPage() {
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function load() {
    setLoading(true);
    setError(false);
    try {
      const [b, t] = await Promise.all([creditService.getBalance(), creditService.getHistory()]);
      setBalance(b);
      setTransactions(t.slice(0, 6));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (error) {
    return (
      <div>
        <PageHeader title="Créditos" />
        <ErrorState onRetry={load} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Créditos"
        subtitle="Gerencie o saldo utilizado para desbloquear currículos."
        actions={
          <Link to="/creditos/comprar">
            <Button>+ Comprar créditos</Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <CreditBalanceCard label="Saldo disponível" value={loading ? 0 : balance?.available ?? 0} emphasis />
        <CreditBalanceCard label="Créditos adquiridos" value={loading ? 0 : balance?.acquired ?? 0} />
        <CreditBalanceCard label="Créditos utilizados" value={loading ? 0 : balance?.used ?? 0} />
      </div>

      {!loading && balance && (
        <div className="mt-4">
          <CreditAlertBanner available={balance.available} />
        </div>
      )}

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Últimas movimentações</h2>
          <Link to="/historico" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
            Ver histórico completo
          </Link>
        </div>
        <Card>{loading ? <p className="text-sm text-[var(--color-text-secondary)]">Carregando...</p> : <TransactionList transactions={transactions ?? []} />}</Card>
      </div>
    </div>
  );
}
