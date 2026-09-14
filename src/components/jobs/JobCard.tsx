import { Link } from "react-router-dom";
import type { Job } from "../../types/job";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { JobStatusBadge } from "./JobStatusBadge";
import { formatDate } from "../../utils/format";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-[var(--color-text)]">{job.title}</h3>
          <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">{job.location}</p>
        </div>
        <JobStatusBadge status={job.status} />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--color-text-secondary)]">
        <span>{job.professionalCategory}</span>
        <span aria-hidden="true">·</span>
        <span>{job.candidateCount} currículos</span>
        <span aria-hidden="true">·</span>
        <span>{formatDate(job.createdAt)}</span>
      </div>

      <div className="mt-1 flex gap-2">
        <Link to={`/vagas/${job.id}`} className="flex-1">
          <Button variant="secondary" size="sm" fullWidth>
            Ver vaga
          </Button>
        </Link>
        <Link to={`/vagas/${job.id}/editar`} className="flex-1">
          <Button variant="ghost" size="sm" fullWidth>
            Editar
          </Button>
        </Link>
      </div>
    </Card>
  );
}
