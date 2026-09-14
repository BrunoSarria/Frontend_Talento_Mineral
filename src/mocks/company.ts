import type { Company, PlanSummary } from "../types/company";
import { CURRENT_COMPANY_ID } from "./jobs";

export const initialCompany: Company = {
  id: CURRENT_COMPANY_ID,
  name: "Rochas Cachoeiro Exportação Ltda.",
  document: "12.345.678/0001-90",
  businessEmail: "contato@rochascachoeiro.com.br",
  businessPhone: "(28) 3155-0000",
  city: "Cachoeiro de Itapemirim",
  state: "ES",
};

export const currentPlan: PlanSummary = {
  name: "Profissional",
  status: "ACTIVE",
  renewsAt: "2026-10-09T00:00:00.000Z",
  monthlyJobLimit: 20,
};
