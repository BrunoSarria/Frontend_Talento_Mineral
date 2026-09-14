import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { notificationService } from "../../services/notificationService";
import { formatDateShort } from "../../utils/format";
import type { Notification, NotificationType } from "../../types/notification";

const TYPE_ICON: Record<NotificationType, string> = {
  MATCH: "🔎",
  CREDIT: "💳",
  PAYMENT: "✅",
  JOB: "💼",
  SYSTEM: "👋",
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  async function refresh() {
    const data = await notificationService.getNotifications();
    setNotifications(data.slice(0, 5));
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function handleMarkAllAsRead() {
    await notificationService.markAllAsRead();
    refresh();
  }

  async function handleItemClick(id: string) {
    await notificationService.markAsRead(id);
    refresh();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          if (!open) refresh();
        }}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Notificações${unreadCount > 0 ? `, ${unreadCount} não lidas` : ""}`}
        className="relative flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)]"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-error)] px-1 text-[10px] font-semibold text-white dark:text-[#2a0f0c]"
            aria-hidden="true"
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-[min(340px,calc(100vw-2rem))] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-elevated)]">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
            <p className="text-sm font-semibold text-[var(--color-text)]">Notificações</p>
            {unreadCount > 0 && (
              <button type="button" onClick={handleMarkAllAsRead} className="text-xs font-medium text-[var(--color-primary)] hover:underline">
                Marcar todas como lidas
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-[var(--color-text-secondary)]">Você está em dia! Não há novas notificações.</p>
          ) : (
            <ul className="custom-scroll max-h-80 overflow-y-auto">
              {notifications.map((n) => (
                <li key={n.id} className={`border-b border-[var(--color-border)] last:border-0 ${n.read ? "" : "bg-[var(--color-primary-soft)]"}`}>
                  <Link
                    to={n.link ?? "/notificacoes"}
                    onClick={() => {
                      setOpen(false);
                      if (!n.read) handleItemClick(n.id);
                    }}
                    className="flex gap-2.5 px-4 py-3 hover:bg-[var(--color-surface-sunken)]"
                  >
                    <span className="mt-0.5 text-base" aria-hidden="true">
                      {TYPE_ICON[n.type]}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium leading-snug text-[var(--color-text)]">{n.title}</span>
                      <span className="mt-0.5 block text-xs leading-snug text-[var(--color-text-secondary)]">{n.description}</span>
                      <span className="mt-1 block text-[11px] text-[var(--color-text-muted)]">{formatDateShort(n.createdAt)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <Link
            to="/notificacoes"
            onClick={() => setOpen(false)}
            className="block border-t border-[var(--color-border)] px-4 py-2.5 text-center text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-surface-sunken)]"
          >
            Ver todas
          </Link>
        </div>
      )}
    </div>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M4.2 12.5V8.2C4.2 5.6 6.2 3.5 9 3.5C11.8 3.5 13.8 5.6 13.8 8.2V12.5L15 14H3L4.2 12.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M7.3 15.2C7.6 15.8 8.2 16.2 9 16.2C9.8 16.2 10.4 15.8 10.7 15.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
