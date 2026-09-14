export interface Company {
  id: string;
  name: string;
  document?: string; // CNPJ
  businessEmail?: string;
  businessPhone?: string;
  city: string;
  state?: string;
  logoUrl?: string;
}

export interface PlanSummary {
  name: string;
  status: "ACTIVE" | "TRIAL";
  renewsAt?: string;
  monthlyJobLimit?: number;
}
