export type JobStatus = "DRAFT" | "OPEN" | "PAUSED" | "CLOSED";

export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  location: string;
  professionalCategory: string;
  requirements: string[];
  experience?: string;
  cnh?: string;
  status: JobStatus;
  createdAt: string;
  candidateCount: number;
}

export interface JobFormData {
  title: string;
  professionalCategory: string;
  location: string;
  description: string;
  experience?: string;
  cnh?: string;
  requirements: string[];
  status: JobStatus;
}

export type AssociationStatus = "ASSOCIATED" | "REMOVED";

export interface CandidateJobAssociation {
  id: string;
  candidateId: string;
  jobId: string;
  status: AssociationStatus;
  createdAt: string;
}
