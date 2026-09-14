import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { Card } from "../../components/ui/Card";
import { LoadingState } from "../../components/ui/LoadingState";
import { ErrorState } from "../../components/ui/ErrorState";
import { JobForm } from "../../components/jobs/JobForm";
import { jobService } from "../../services/jobService";
import { useToast } from "../../hooks/useToast";
import type { Job, JobFormData } from "../../types/job";

export function JobEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function load() {
    if (!id) return;
    setLoading(true);
    setError(false);
    try {
      const data = await jobService.getJobById(id);
      setJob(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSubmit(data: JobFormData) {
    if (!id) return;
    await jobService.updateJob(id, data);
    showToast("Vaga atualizada com sucesso.", "success");
    navigate(`/vagas/${id}`);
  }

  if (loading) return <LoadingState label="Carregando vaga..." />;
  if (error || !job) {
    return <ErrorState title="Vaga não encontrada" onRetry={load} />;
  }

  const initialValue: JobFormData = {
    title: job.title,
    professionalCategory: job.professionalCategory,
    location: job.location,
    description: job.description,
    experience: job.experience ?? "",
    cnh: job.cnh ?? "Não exigido",
    requirements: job.requirements,
    status: job.status,
  };

  return (
    <div>
      <PageHeader
        breadcrumb={<Breadcrumb items={[{ label: "Vagas", to: "/vagas" }, { label: job.title, to: `/vagas/${job.id}` }, { label: "Editar" }]} />}
        title="Editar vaga"
      />
      <Card className="max-w-2xl">
        <JobForm initialValue={initialValue} submitLabel="Salvar alterações" onSubmit={handleSubmit} onCancel={() => navigate(`/vagas/${job.id}`)} />
      </Card>
    </div>
  );
}
