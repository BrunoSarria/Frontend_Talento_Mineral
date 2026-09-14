import type { CandidateFilters } from "./candidate";

export interface SavedFilter {
  id: string;
  name: string;
  filters: CandidateFilters;
  createdAt: string;
}
