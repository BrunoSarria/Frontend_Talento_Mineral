import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Tabs } from "../../components/ui/Tabs";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingState } from "../../components/ui/LoadingState";
import { ErrorState } from "../../components/ui/ErrorState";
import { notificationService } from "../../services/notificationService";
import { formatDate } from "../../utils/format";
import type { Notification, NotificationType } from "../../types/notification";

type TabKey = "all" | "unread";

const TYPE_ICON: Record<NotificationType, string> = {
  MATCH: "🔎",
  CREDIT: "💳",
  PAYMENT: "✅",
  JOB: "💼",
  SYSTEM: "👋",
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<TabKey>("all");

  async function load() {
    setLoading(true);
    setError(false);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleMarkAsRead(id: string) {
    await notificationService.markAsRead(id);
    setNotifications((prev) => prev?.map((n) => (n.id === id ? { ...n, read: true } : n)) ?? prev);
  }

  async function handleMarkAllAsRead() {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev?.map((n) => ({ ...n, read: true })) ?? prev);
  }

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;
  const visible = notifications?.filter((n) => tab === "all" || !n.read) ?? [];

  return (
    <div>
      <PageHeader
        title="Notificações"
        subtitle="Acompanhe atualizações sobre currículos, créditos e vagas."
        actions={
          unreadCount > 0 ? (
            <Button variant="secondary" size="sm" onClick={handleMarkAllAsRead}>
              Marcar todas como lidas
            </Button>
          ) : undefined
        }
      />

      <div className="mb-5">
        <Tabs
          items={[
            { key: "all", label: "Todas" },
            { key: "unread", label: `Não lidas${unreadCount > 0 ? ` (${unreadCount})` : ""}` },
          ]}
          activeKey={tab}
          onChange={(key) => setTab(key as TabKey)}
        />
      </div>

      {loading ? (
        <LoadingState label="Carregando notificações..." />
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : visible.length === 0 ? (
        <EmptyState title="Você está em dia! Não há novas notificações." />
      ) : (
        <ul className="flex flex-col gap-2">
          {visible.map((notification) => (
            <li
              key={notification.id}
              className={`flex items-start gap-3 rounded-[var(--radius-md)] border px-4 py-3.5 ${
                notification.read ? "border-[var(--color-border)] bg-[var(--color-surface)]" : "border-[var(--color-primary-soft-border)] bg-[var(--color-primary-soft)]"
              }`}
            >
              <span className="mt-0.5 text-lg" aria-hidden="true">
                {TYPE_ICON[notification.type]}
              </span>
              <div className="min-w-0 flex-1">
                {notification.link ? (
                  <Link to={notification.link} onClick={() => !notification.read && handleMarkAsRead(notification.id)} className="font-medium text-[var(--color-text)] hover:underline">
                    {notification.title}
                  </Link>
                ) : (
                  <p className="font-medium text-[var(--color-text)]">{notification.title}</p>
                )}
                <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">{notification.description}</p>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">{formatDate(notification.createdAt)}</p>
              </div>
              {!notification.read && (
                <button
                  type="button"
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="shrink-0 text-xs font-medium text-[var(--color-primary)] hover:underline"
                >
                  Marcar como lida
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
