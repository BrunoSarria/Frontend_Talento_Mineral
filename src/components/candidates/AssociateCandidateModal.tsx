import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { jobService } from "../../services/jobService";
import type { Job } from "../../types/job";

interface AssociateCandidateModalProps {
  open: boolean;
  onClose: () => void;
  onAssociate: (jobId: string) => Promise<void>;
  associatedJobIds: string[];
}

export function AssociateCandidateModal({ open, onClose, onAssociate, associatedJobIds }: AssociateCandidateModalProps) {
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelectedJobId(null);
    jobService.getOpenJobs().then(setJobs);
  }, [open]);

  async function handleAssociate() {
    if (!selectedJobId) return;
    setLoading(true);
    try {
      await onAssociate(selectedJobId);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Associar currículo"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAssociate} loading={loading} disabled={!selectedJobId}>
            Associar
          </Button>
        </>
      }
    >
      {jobs === null ? (
        <p className="text-[var(--color-text-secondary)]">Carregando vagas...</p>
      ) : jobs.length === 0 ? (
        <EmptyState title="Nenhuma vaga aberta no momento." description="Crie uma vaga para poder associar currículos." />
      ) : (
        <fieldset className="flex flex-col gap-2">
          <legend className="sr-only">Selecione uma vaga</legend>
          {jobs.map((job) => {
            const already = associatedJobIds.includes(job.id);
            return (
              <label
                key={job.id}
                className={`flex cursor-pointer items-center gap-3 rounded-[var(--radius-sm)] border px-3.5 py-2.5 text-sm ${
                  selectedJobId === job.id ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]" : "border-[var(--color-border-strong)]"
                } ${already ? "opacity-60" : ""}`}
              >
                <input
                  type="radio"
                  name="job"
                  value={job.id}
                  checked={selectedJobId === job.id}
                  onChange={() => setSelectedJobId(job.id)}
                  className="h-4 w-4 text-[var(--color-primary)]"
                />
                <span className="flex-1 text-[var(--color-text)]">{job.title}</span>
                {already && <span className="text-xs text-[var(--color-text-muted)]">Já associado</span>}
              </label>
            );
          })}
        </fieldset>
      )}
    </Modal>
  );
}
