import { PageHeader } from "../../components/layout/PageHeader";
import { AccountSection } from "./AccountSection";
import { CompanySection } from "./CompanySection";
import { PlanSection } from "./PlanSection";
import { PaymentsSection } from "./PaymentsSection";
import { NotificationPreferencesSection } from "./NotificationPreferencesSection";

export function SettingsPage() {
  return (
    <div>
      <PageHeader title="Configurações" subtitle="Gerencie os dados da sua conta, empresa, plano e notificações." />

      <div className="flex flex-col gap-5">
        <AccountSection />
        <CompanySection />
        <PlanSection />
        <PaymentsSection />
        <NotificationPreferencesSection />
      </div>
    </div>
  );
}
