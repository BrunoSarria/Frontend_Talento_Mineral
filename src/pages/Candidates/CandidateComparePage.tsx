import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { Badge } from "../../components/ui/Badge";
import { Avatar } from "../../components/ui/Avatar";
import { Button } from "../../components/ui/Button";
import { LoadingState } from "../../components/ui/LoadingState";
import { ErrorState } from "../../components/ui/ErrorState";
import { candidateService } from "../../services/candidateService";
import type { Candidate } from "../../types/candidate";

interface Row {
  label: string;
  render: (candidate: Candidate) => string;
}

const ROWS: Row[] = [
  { label: "Categoria profissional", render: (c) => c.professionalCategory },
  { label: "Cidade", render: (c) => c.city },
  { label: "Faixa etária", render: (c) => c.ageRange ?? "Não informado" },
  { label: "Experiência", render: (c) => c.experience ?? "Não informado" },
  { label: "CNH", render: (c) => (c.cnh && c.cnh !== "Nenhuma" ? c.cnh : "Não possui") },
  { label: "Disponibilidade", render: (c) => c.availability ?? "Não informado" },
];

export function CandidateComparePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ids = (searchParams.get("ids") ?? "").split(",").filter(Boolean);

  const [candidates, setCandidates] = useState<Candidate[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function load() {
    if (ids.length < 2) {
      setError(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const results = await Promise.all(ids.map((id) => candidateService.getCandidateById(id)));
      setCandidates(results);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (loading) return <LoadingState label="Carregando comparação..." />;
  if (error || !candidates) {
    return (
      <div>
        <PageHeader title="Comparar currículos" />
        <ErrorState
          title="Não foi possível montar a comparação"
          description="Selecione ao menos dois currículos na listagem para compará-los."
          onRetry={() => navigate("/curriculos")}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        breadcrumb={<Breadcrumb items={[{ label: "Currículos", to: "/curriculos" }, { label: "Comparar" }]} />}
        title="Comparar currículos"
        subtitle="Dados protegidos permanecem ocultos até o desbloqueio de cada currículo."
      />

      <div className="custom-scroll overflow-x-auto rounded-[var(--radius-md)] border border-[var(--color-border)]">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-sunken)]">
              <th scope="col" className="w-40 px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">
                Critério
              </th>
              {candidates.map((c) => (
                <th key={c.id} scope="col" className="px-4 py-3 text-left align-top font-medium text-[var(--color-text)]">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={c.name} photoUrl={c.photoUrl} locked={!c.isUnlocked} size="sm" />
                    <div>
                      <p className="font-medium">{c.isUnlocked && c.name ? c.name : "Protegido"}</p>
                      {c.isUnlocked ? (
                        <Badge tone="success">Desbloqueado</Badge>
                      ) : (
                        <Badge tone="neutral">🔒 Protegido</Badge>
                      )}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="border-b border-[var(--color-border)] last:border-0">
                <th scope="row" className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">
                  {row.label}
                </th>
                {candidates.map((c) => (
                  <td key={c.id} className="px-4 py-3 text-[var(--color-text)]">
                    {row.render(c)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row" className="px-4 py-3 text-left align-top font-medium text-[var(--color-text-secondary)]">
                Habilidades
              </th>
              {candidates.map((c) => (
                <td key={c.id} className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {c.skills.map((skill) => (
                      <Badge key={skill} tone="neutral">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">
                Ações
              </th>
              {candidates.map((c) => (
                <td key={c.id} className="px-4 py-3">
                  <Link to={`/curriculos/${c.id}`}>
                    <Button variant="secondary" size="sm">
                      Ver currículo
                    </Button>
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
