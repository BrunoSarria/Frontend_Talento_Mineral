export interface CreditBalance {
  available: number;
  acquired: number;
  used: number;
}

export interface CreditPlan {
  id: string;
  name: string;
  credits: number;
  price: number;
  highlight?: string;
}

export interface CreditTransaction {
  id: string;
  type: "UNLOCK" | "PURCHASE";
  description: string;
  amount: number; // positivo = crédito, negativo = débito
  createdAt: string;
}
