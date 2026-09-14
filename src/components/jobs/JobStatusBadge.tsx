import { Badge } from "../ui/Badge";
import type { JobStatus } from "../../types/job";

const LABELS: Record<JobStatus, string> = {
  DRAFT: "Rascunho",
  OPEN: "Aberta",
  PAUSED: "Pausada",
  CLOSED: "Encerrada",
};

const TONES: Record<JobStatus, "neutral" | "success" | "warning" | "error" | "primary"> = {
  DRAFT: "primary",
  OPEN: "success",
  PAUSED: "warning",
  CLOSED: "neutral",
};

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return (
    <Badge tone={TONES[status]} dot>
      {LABELS[status]}
    </Badge>
  );
}
