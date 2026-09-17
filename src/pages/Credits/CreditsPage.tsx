import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { ErrorState } from "../../components/ui/ErrorState";
import { Skeleton } from "../../components/ui/Skeleton";
import { CreditBalanceCard } from "../../components/credits/CreditBalanceCard";
import { CreditAlertBanner } from "../../components/credits/CreditAlertBanner";
import { PricingTable } from "../../components/credits/PricingTable";
import { TransactionList } from "../../components/credits/TransactionList";
import { creditService } from "../../services/creditService";
import { formatNumber } from "../../utils/format";
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

  const usageRatio = balance && balance.acquired > 0 ? Math.min(100, Math.round((balance.used / balance.acquired) * 100)) : 0;

  return (
    <div>
      <PageHeader
        title="Gestão de créditos"
        subtitle="Acompanhe o saldo operacional, adquira pacotes e audite cada dedução com transparência."
        actions={
          <Link to="/creditos/comprar">
            <Button variant="accent">+ Comprar créditos</Button>
          </Link>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-5">
          {loading || !balance ? (
            <Skeleton className="h-48" />
          ) : (
            <>
              <CreditBalanceCard label="Saldo operacional disponível" value={balance.available} emphasis />

              <Card>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">
                    Consumo acumulado
                  </p>
                  <p className="text-[12px] tabular text-[var(--color-text-secondary)]">
                    {formatNumber(balance.used)} usados de {formatNumber(balance.acquired)} adquiridos
                  </p>
                </div>
                <div
                  className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-surface-sunken)]"
                  role="progressbar"
                  aria-valuenow={usageRatio}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Consumo de créditos"
                >
                  <div className="h-full rounded-full bg-[var(--color-primary)]" style={{ width: `${usageRatio}%` }} />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4 border-t border-[var(--color-border)] pt-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">Adquiridos</p>
                    <p className="mt-0.5 font-display text-[20px] font-extrabold tabular text-[var(--color-text)]">
                      {formatNumber(balance.acquired)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">Utilizados</p>
                    <p className="mt-0.5 font-display text-[20px] font-extrabold tabular text-[var(--color-text)]">
                      {formatNumber(balance.used)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">Validade</p>
                    <p className="mt-0.5 font-display text-[20px] font-extrabold text-[var(--color-text)]">Sem expiração</p>
                  </div>
                </div>
              </Card>

              <CreditAlertBanner available={balance.available} />
            </>
          )}
        </div>

        <PricingTable />
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-[18px] font-bold text-[var(--color-text)]">Últimas movimentações</h2>
          <Link to="/historico" className="text-[13px] font-semibold text-[var(--color-primary)] hover:underline">
            Ver histórico completo
          </Link>
        </div>
        <Card>
          {loading ? <Skeleton className="h-32" /> : <TransactionList transactions={transactions ?? []} />}
        </Card>
      </div>
    </div>
  );
}
