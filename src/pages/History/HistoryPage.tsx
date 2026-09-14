import { useEffect, useState } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Tabs } from "../../components/ui/Tabs";
import { Table, type TableColumn } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { LoadingState } from "../../components/ui/LoadingState";
import { ActivityFeed } from "../../components/dashboard/ActivityFeed";
import { paymentService } from "../../services/paymentService";
import { creditService } from "../../services/creditService";
import { activityService } from "../../services/activityService";
import { formatCurrency, formatDate } from "../../utils/format";
import type { Payment, PaymentStatus } from "../../types/payment";
import type { CreditTransaction } from "../../types/credit";
import type { ActivityItem } from "../../types/activity";

type TabKey = "all" | "unlocks" | "payments" | "jobs";

const PAYMENT_STATUS_TONE: Record<PaymentStatus, "success" | "warning" | "error"> = {
  APPROVED: "success",
  PENDING: "warning",
  REJECTED: "error",
};
const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  APPROVED: "Aprovado",
  PENDING: "Pendente",
  REJECTED: "Rejeitado",
};

export function HistoryPage() {
  const [tab, setTab] = useState<TabKey>("all");
  const [payments, setPayments] = useState<Payment[] | null>(null);
  const [unlocks, setUnlocks] = useState<CreditTransaction[] | null>(null);
  const [allActivity, setAllActivity] = useState<ActivityItem[] | null>(null);
  const [jobActivity, setJobActivity] = useState<ActivityItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function load() {
    setLoading(true);
    setError(false);
    try {
      const [paymentData, txData, everything, jobEvents] = await Promise.all([
        paymentService.getHistory(),
        creditService.getHistory(),
        activityService.getRecentActivity(100),
        activityService.getActivityByType(["JOB_CREATED", "ASSOCIATION"]),
      ]);
      setPayments(paymentData);
      setUnlocks(txData.filter((tx) => tx.type === "UNLOCK"));
      setAllActivity(everything);
      setJobActivity(jobEvents);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const unlockColumns: TableColumn<CreditTransaction>[] = [
    { key: "date", header: "Data", render: (tx) => formatDate(tx.createdAt) },
    { key: "candidate", header: "Currículo", render: (tx) => tx.description.replace("Desbloqueio de currículo — ", "") },
    { key: "amount", header: "Créditos utilizados", render: () => "1 crédito", align: "right" },
  ];

  const paymentColumns: TableColumn<Payment>[] = [
    { key: "date", header: "Data", render: (p) => formatDate(p.createdAt) },
    { key: "plan", header: "Plano", render: (p) => p.planName },
    { key: "amount", header: "Valor", render: (p) => formatCurrency(p.amount), align: "right" },
    {
      key: "status",
      header: "Status",
      render: (p) => (
        <Badge tone={PAYMENT_STATUS_TONE[p.status]} dot>
          {PAYMENT_STATUS_LABEL[p.status]}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Histórico" subtitle="Acompanhe desbloqueios, pagamentos e movimentações de vagas." />

      <div className="mb-5">
        <Tabs
          items={[
            { key: "all", label: "Todos" },
            { key: "unlocks", label: "Desbloqueios" },
            { key: "payments", label: "Pagamentos" },
            { key: "jobs", label: "Vagas" },
          ]}
          activeKey={tab}
          onChange={(key) => setTab(key as TabKey)}
        />
      </div>

      {loading ? (
        <LoadingState label="Carregando histórico..." />
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : tab === "all" ? (
        <ActivityFeed items={allActivity ?? []} />
      ) : tab === "payments" ? (
        payments && payments.length > 0 ? (
          <Table columns={paymentColumns} rows={payments} getRowKey={(p) => p.id} caption="Histórico de pagamentos" />
        ) : (
          <EmptyState title="Nenhum pagamento registrado ainda." />
        )
      ) : tab === "unlocks" ? (
        unlocks && unlocks.length > 0 ? (
          <Table columns={unlockColumns} rows={unlocks} getRowKey={(tx) => tx.id} caption="Histórico de desbloqueios" />
        ) : (
          <EmptyState title="Nenhum desbloqueio registrado ainda." />
        )
      ) : (
        <ActivityFeed items={jobActivity ?? []} />
      )}
    </div>
  );
}
