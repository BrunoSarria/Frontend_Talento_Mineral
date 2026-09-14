import { useEffect, useState } from "react";
import { Card } from "../../components/ui/Card";
import { Checkbox } from "../../components/ui/Checkbox";
import { Skeleton } from "../../components/ui/Skeleton";
import { useToast } from "../../hooks/useToast";
import { notificationService } from "../../services/notificationService";
import type { NotificationPreferences } from "../../types/notification";

const OPTIONS: { key: keyof NotificationPreferences; label: string }[] = [
  { key: "newMatches", label: "Novos currículos compatíveis com minhas vagas" },
  { key: "lowCredits", label: "Créditos baixos" },
  { key: "approvedPurchases", label: "Compras de créditos aprovadas" },
  { key: "jobUpdates", label: "Atualizações relevantes de vagas" },
  { key: "otherNotices", label: "Outros avisos importantes" },
];

export function NotificationPreferencesSection() {
  const { showToast } = useToast();
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);

  useEffect(() => {
    notificationService.getPreferences().then(setPrefs);
  }, []);

  async function handleToggle(key: keyof NotificationPreferences) {
    if (!prefs) return;
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    await notificationService.savePreferences(next);
    showToast("Preferências de notificação atualizadas.", "success");
  }

  return (
    <Card>
      <h2 className="mb-1 text-base font-semibold text-[var(--color-text)]">Notificações</h2>
      <p className="mb-4 text-sm text-[var(--color-text-secondary)]">Escolha sobre o que você quer ser avisado.</p>

      {!prefs ? (
        <Skeleton className="h-32" />
      ) : (
        <div className="flex flex-col gap-3">
          {OPTIONS.map((opt) => (
            <Checkbox key={opt.key} label={opt.label} checked={prefs[opt.key]} onChange={() => handleToggle(opt.key)} />
          ))}
        </div>
      )}
    </Card>
  );
}
