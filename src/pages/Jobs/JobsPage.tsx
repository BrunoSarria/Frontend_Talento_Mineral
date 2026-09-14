import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { JobCard } from "../../components/jobs/JobCard";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { Card } from "../../components/ui/Card";
import { Tabs } from "../../components/ui/Tabs";
import { jobService } from "../../services/jobService";
import type { Job } from "../../types/job";

type StatusFilter = "all" | "DRAFT" | "OPEN" | "PAUSED" | "CLOSED";

export function JobsPage() {
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  async function load() {
    setLoading(true);
    setError(false);
    try {
      const data = await jobService.getJobs();
      setJobs(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredJobs = jobs?.filter((j) => statusFilter === "all" || j.status === statusFilter) ?? [];

  return (
    <div>
      <PageHeader
        title="Vagas"
        subtitle="Gerencie as oportunidades da sua empresa."
        actions={
          <Link to="/vagas/nova">
            <Button>+ Nova vaga</Button>
          </Link>
        }
      />

      {!loading && jobs && jobs.length > 0 && (
        <div className="mb-5">
          <Tabs
            items={[
              { key: "all", label: "Todas" },
              { key: "DRAFT", label: "Rascunho" },
              { key: "OPEN", label: "Abertas" },
              { key: "PAUSED", label: "Pausadas" },
              { key: "CLOSED", label: "Encerradas" },
            ]}
            activeKey={statusFilter}
            onChange={(key) => setStatusFilter(key as StatusFilter)}
          />
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-40 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : jobs && jobs.length === 0 ? (
        <EmptyState
          title="Você ainda não possui vagas cadastradas."
          action={
            <Link to="/vagas/nova">
              <Button size="sm">Criar primeira vaga</Button>
            </Link>
          }
        />
      ) : filteredJobs.length === 0 ? (
        <EmptyState title="Nenhuma vaga encontrada para este filtro." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
