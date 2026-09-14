import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Avatar } from "../../components/ui/Avatar";
import { Button } from "../../components/ui/Button";
import { LoadingState } from "../../components/ui/LoadingState";
import { ErrorState } from "../../components/ui/ErrorState";
import { UnlockModal } from "../../components/candidates/UnlockModal";
import { AssociateCandidateModal } from "../../components/candidates/AssociateCandidateModal";
import { candidateService } from "../../services/candidateService";
import { jobService } from "../../services/jobService";
import { creditService } from "../../services/creditService";
import { favoriteService } from "../../services/favoriteService";
import { useToast } from "../../hooks/useToast";
import { formatDate } from "../../utils/format";
import type { Candidate } from "../../types/candidate";

export function CandidateDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const [balance, setBalance] = useState(0);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [unlockLoading, setUnlockLoading] = useState(false);

  const [associateOpen, setAssociateOpen] = useState(false);

  async function load() {
    if (!id) return;
    setLoading(true);
    setError(false);
    try {
      const [c, b, fav] = await Promise.all([candidateService.getCandidateById(id), creditService.getBalance(), favoriteService.isFavorite(id)]);
      setCandidate(c);
      setBalance(b.available);
      setIsFavorite(fav);
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

  async function handleUnlock() {
    if (!candidate) return;
    setUnlockLoading(true);
    try {
      const updated = await candidateService.unlockCandidate(candidate.id);
      setCandidate(updated);
      const newBalance = await creditService.getBalance();
      setBalance(newBalance.available);
      setUnlockOpen(false);
      showToast("Currículo desbloqueado com sucesso.", "success");
    } catch (err) {
      const message = (err as { message?: string })?.message ?? "Não foi possível desbloquear o currículo.";
      showToast(message, "error");
    } finally {
      setUnlockLoading(false);
    }
  }

  async function handleAssociate(jobId: string) {
    if (!candidate) return;
    try {
      await jobService.associateCandidate(candidate.id, jobId);
      setCandidate((prev) => (prev ? { ...prev, jobIds: [...new Set([...prev.jobIds, jobId])] } : prev));
      setAssociateOpen(false);
      showToast("Currículo associado à vaga.", "success");
    } catch (err) {
      const message = (err as { message?: string })?.message ?? "Não foi possível associar o currículo.";
      showToast(message, "error");
    }
  }

  async function handleToggleFavorite() {
    if (!candidate) return;
    const nowFavorite = await favoriteService.toggleFavorite(candidate.id);
    setIsFavorite(nowFavorite);
    showToast(nowFavorite ? "Currículo adicionado aos favoritos." : "Currículo removido dos favoritos.", "success");
  }

  if (loading) return <LoadingState label="Carregando currículo..." />;
  if (error || !candidate) {
    return <ErrorState title="Currículo não encontrado" description="O currículo pode ter sido removido." onRetry={load} />;
  }

  return (
    <div>
      <PageHeader
        breadcrumb={<Breadcrumb items={[{ label: "Currículos", to: "/curriculos" }, { label: "Detalhes" }]} />}
        title={candidate.isUnlocked && candidate.name ? candidate.name : candidate.professionalCategory}
        subtitle={candidate.city}
        actions={
          <>
            <button
              type="button"
              onClick={handleToggleFavorite}
              aria-pressed={isFavorite}
              className={`flex h-10 items-center gap-1.5 rounded-[var(--radius-sm)] border px-3 text-sm font-medium ${
                isFavorite
                  ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                  : "border-[var(--color-border-strong)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              }`}
            >
              <span aria-hidden="true">{isFavorite ? "★" : "☆"}</span> {isFavorite ? "Favoritado" : "Favoritar"}
            </button>
            <Button variant="secondary" onClick={() => setAssociateOpen(true)}>
              Associar à vaga
            </Button>
            {!candidate.isUnlocked && <Button onClick={() => setUnlockOpen(true)}>🔓 Desbloquear currículo — 1 crédito</Button>}
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <Card className="flex flex-col items-center gap-3 text-center">
          <Avatar name={candidate.name} photoUrl={candidate.photoUrl} locked={!candidate.isUnlocked} size="lg" />
          <div>
            <p className="font-medium text-[var(--color-text)]">
              {candidate.isUnlocked && candidate.name ? candidate.name : "Nome protegido"}
            </p>
            <p className="text-sm text-[var(--color-text-secondary)]">ID {candidate.id.replace("cand-", "#")}</p>
          </div>
          {candidate.isUnlocked ? (
            <Badge tone="success" dot>
              Currículo desbloqueado
            </Badge>
          ) : (
            <Badge tone="neutral" dot>
              Contato protegido
            </Badge>
          )}
          <p className="text-xs text-[var(--color-text-muted)]">Cadastrado em {formatDate(candidate.createdAt)}</p>
        </Card>

        <div className="flex flex-col gap-5">
          <Card>
            <h2 className="mb-3 text-sm font-semibold text-[var(--color-text)]">Informações profissionais</h2>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
              <Info label="Categoria" value={candidate.professionalCategory} />
              <Info label="Cidade" value={candidate.city} />
              <Info label="Faixa etária" value={candidate.ageRange ?? "Não informado"} />
              <Info label="Experiência" value={candidate.experience ?? "Não informado"} />
              <Info label="CNH" value={candidate.cnh && candidate.cnh !== "Nenhuma" ? candidate.cnh : "Não possui"} />
              <Info label="Disponibilidade" value={candidate.availability ?? "Não informado"} />
            </dl>

            {candidate.skills.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-2 text-xs font-medium text-[var(--color-text-muted)]">Habilidades</h3>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map((skill) => (
                    <Badge key={skill} tone="neutral">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-semibold text-[var(--color-text)]">Dados de contato</h2>
            {candidate.isUnlocked ? (
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Info label="Telefone" value={candidate.contact?.phone ?? "Não informado"} />
                <Info label="E-mail" value={candidate.contact?.email ?? "Não informado"} />
              </dl>
            ) : (
              <div className="flex flex-col items-start gap-3 rounded-[var(--radius-sm)] bg-[var(--color-surface-sunken)] px-4 py-4">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  <span aria-hidden="true">🔒</span> Dados de contato protegidos até o desbloqueio deste currículo.
                </p>
                <Button size="sm" onClick={() => setUnlockOpen(true)}>
                  Desbloquear currículo — 1 crédito
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      <UnlockModal open={unlockOpen} onClose={() => setUnlockOpen(false)} onConfirm={handleUnlock} balance={balance} loading={unlockLoading} />
      <AssociateCandidateModal
        open={associateOpen}
        onClose={() => setAssociateOpen(false)}
        onAssociate={handleAssociate}
        associatedJobIds={candidate.jobIds}
      />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[var(--color-text-muted)]">{label}</dt>
      <dd className="text-[var(--color-text)]">{value}</dd>
    </div>
  );
}
