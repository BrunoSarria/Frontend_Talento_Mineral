import { Badge } from "../ui/Badge";
import type { JobStatus } from "../../types/job";

/**
 * Status nunca é sinalizado apenas por cor: cada estado combina tom
 * semântico, glifo geométrico próprio e rótulo textual explícito.
 */
const LABELS: Record<JobStatus, string> = {
  DRAFT: "Rascunho",
  OPEN: "Aberta",
  PAUSED: "Pausada",
  CLOSED: "Encerrada",
};

const TONES: Record<JobStatus, "info" | "success" | "warning" | "error"> = {
  DRAFT: "info",
  OPEN: "success",
  PAUSED: "warning",
  CLOSED: "error",
};

const GLYPHS: Record<JobStatus, string> = {
  DRAFT: "✎",
  OPEN: "●",
  PAUSED: "❚❚",
  CLOSED: "■",
};

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return (
    <Badge tone={TONES[status]}>
      <span aria-hidden="true" className="text-[9px] leading-none">
        {GLYPHS[status]}
      </span>
      {LABELS[status]}
    </Badge>
  );
}
