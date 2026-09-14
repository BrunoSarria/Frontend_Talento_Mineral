export type CNHType = "Nenhuma" | "A" | "B" | "AB" | "C" | "D" | "E";

export type AvailabilityType = "Imediata" | "15 dias" | "30 dias" | "A combinar";

export interface CandidateContact {
  phone?: string;
  email?: string;
}

export interface Candidate {
  id: string;
  name?: string; // protegido até desbloqueio
  city: string;
  ageRange?: string;
  professionalCategory: string;
  experience?: string; // ex: "3 anos"
  experienceYears?: number; // usado internamente para filtros
  cnh?: CNHType;
  availability?: AvailabilityType;
  skills: string[];
  photoUrl?: string;
  isUnlocked: boolean;
  createdAt: string;
  contact?: CandidateContact; // só populado após desbloqueio
  jobIds: string[]; // vagas associadas
}

export interface CandidateFilters {
  search?: string;
  city?: string;
  professionalCategory?: string;
  cnh?: string;
  experience?: string; // "qualquer" | "1" | "2" | "5"
  availability?: string;
  ageRange?: string;
  favoritesOnly?: boolean;
  page?: number;
  pageSize?: number;
}
