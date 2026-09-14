export type NotificationType = "MATCH" | "CREDIT" | "PAYMENT" | "JOB" | "SYSTEM";

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface NotificationPreferences {
  newMatches: boolean;
  lowCredits: boolean;
  approvedPurchases: boolean;
  jobUpdates: boolean;
  otherNotices: boolean;
}
