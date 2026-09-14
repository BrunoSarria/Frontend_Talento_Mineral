import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { Card } from "../../components/ui/Card";
import { JobForm } from "../../components/jobs/JobForm";
import { jobService } from "../../services/jobService";
import { useToast } from "../../hooks/useToast";
import type { JobFormData } from "../../types/job";

export function JobCreatePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function handleSubmit(data: JobFormData) {
    const job = await jobService.createJob(data);
    showToast("Vaga criada com sucesso.", "success");
    navigate(`/vagas/${job.id}`);
  }

  return (
    <div>
      <PageHeader
        breadcrumb={<Breadcrumb items={[{ label: "Vagas", to: "/vagas" }, { label: "Nova vaga" }]} />}
        title="Nova vaga"
        subtitle="Preencha as informações para publicar uma nova oportunidade."
      />
      <Card className="max-w-2xl">
        <JobForm submitLabel="Criar vaga" onSubmit={handleSubmit} onCancel={() => navigate("/vagas")} />
      </Card>
    </div>
  );
}
