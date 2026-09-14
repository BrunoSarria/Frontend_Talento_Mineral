export interface MatchCriterion {
  label: string;
  matched: boolean;
  points: number;
}

export interface CompatibilityResult {
  candidateId: string;
  jobId: string;
  score: number; // 0-100
  criteria: MatchCriterion[];
}
