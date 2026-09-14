import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { ErrorState } from "../../components/ui/ErrorState";
import { CreditPlanCard } from "../../components/credits/CreditPlanCard";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { creditService } from "../../services/creditService";
import { paymentService } from "../../services/paymentService";
import { useToast } from "../../hooks/useToast";
import { formatCurrency } from "../../utils/format";
import type { CreditPlan } from "../../types/credit";

export function BuyCreditsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [plans, setPlans] = useState<CreditPlan[] | null>(null);
  const [error, setError] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<CreditPlan | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  async function load() {
    setError(false);
    try {
      const data = await creditService.getPlans();
      setPlans(data);
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleConfirmPurchase() {
    if (!selectedPlan) return;
    setPurchaseLoading(true);
    try {
      await paymentService.createPayment(selectedPlan);
      showToast(`Compra aprovada: +${selectedPlan.credits} créditos.`, "success");
      setSelectedPlan(null);
      navigate("/creditos");
    } catch {
      showToast("Não foi possível concluir a compra. Tente novamente.", "error");
    } finally {
      setPurchaseLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        breadcrumb={<Breadcrumb items={[{ label: "Créditos", to: "/creditos" }, { label: "Comprar créditos" }]} />}
        title="Comprar créditos"
        subtitle="Escolha um plano para desbloquear mais currículos."
      />

      {error ? (
        <ErrorState onRetry={load} />
      ) : !plans ? (
        <p className="text-sm text-[var(--color-text-secondary)]">Carregando planos...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {plans.map((plan) => (
            <CreditPlanCard key={plan.id} plan={plan} onSelect={setSelectedPlan} />
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-[var(--color-text-muted)]">
        A integração com meio de pagamento real ainda será implementada. Esta compra é simulada para fins de demonstração.
      </p>

      <ConfirmModal
        open={Boolean(selectedPlan)}
        onClose={() => setSelectedPlan(null)}
        onConfirm={handleConfirmPurchase}
        title="Confirmar compra"
        confirmLabel="Confirmar pagamento"
        loading={purchaseLoading}
      >
        {selectedPlan && (
          <p className="text-[var(--color-text-secondary)]">
            Você está prestes a adquirir o plano <strong className="text-[var(--color-text)]">{selectedPlan.name}</strong> com{" "}
            <strong className="text-[var(--color-text)]">{selectedPlan.credits} créditos</strong> por{" "}
            <strong className="text-[var(--color-text)]">{formatCurrency(selectedPlan.price)}</strong>.
          </p>
        )}
      </ConfirmModal>
    </div>
  );
}
