export type ActivityType = "UNLOCK" | "PURCHASE" | "ASSOCIATION" | "JOB_CREATED" | "MATCH";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  amount?: number; // variação de créditos, quando aplicável
  createdAt: string;
}
