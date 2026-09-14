import type { Notification, NotificationPreferences } from "../types/notification";
import { delay } from "../utils/delay";
import { mockDb } from "../utils/mockDb";

/**
 * Endpoints futuros (sugestão):
 *   GET   /api/notificacoes
 *   PATCH /api/notificacoes/:id/lida
 *   PATCH /api/notificacoes/lidas
 *   GET   /api/notificacoes/preferencias
 *   PUT   /api/notificacoes/preferencias
 */
export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    await delay(250);
    return mockDb.getNotifications().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },

  async getUnreadCount(): Promise<number> {
    await delay(100);
    return mockDb.getNotifications().filter((n) => !n.read).length;
  },

  async markAsRead(id: string): Promise<void> {
    await delay(150);
    const next = mockDb.getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
    mockDb.saveNotifications(next);
  },

  async markAllAsRead(): Promise<void> {
    await delay(200);
    const next = mockDb.getNotifications().map((n) => ({ ...n, read: true }));
    mockDb.saveNotifications(next);
  },

  async getPreferences(): Promise<NotificationPreferences> {
    await delay(150);
    return mockDb.getNotificationPreferences();
  },

  async savePreferences(prefs: NotificationPreferences): Promise<NotificationPreferences> {
    await delay(300);
    mockDb.saveNotificationPreferences(prefs);
    return prefs;
  },

  /** Uso interno: outros services podem gerar notificações a partir de eventos do produto. */
  push(notification: Omit<Notification, "id" | "read" | "createdAt">): void {
    const full: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    mockDb.saveNotifications([full, ...mockDb.getNotifications()]);
  },
};
