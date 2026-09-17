import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { SearchInput } from "../../components/ui/SearchInput";
import { Tabs } from "../../components/ui/Tabs";
import { CandidateFilters } from "../../components/candidates/CandidateFilters";
import { CandidateCard } from "../../components/candidates/CandidateCard";
import { SavedFilters } from "../../components/candidates/SavedFilters";
import { Pagination } from "../../components/ui/Pagination";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { UnlockModal } from "../../components/candidates/UnlockModal";
import { AssociateCandidateModal } from "../../components/candidates/AssociateCandidateModal";
import { candidateService } from "../../services/candidateService";
import { favoriteService } from "../../services/favoriteService";
import { savedFilterService } from "../../services/savedFilterService";
import { creditService } from "../../services/creditService";
import { jobService } from "../../services/jobService";
import { useDebounce } from "../../hooks/useDebounce";
import { useToast } from "../../hooks/useToast";
import { formatNumber } from "../../utils/format";
import type { Candidate, CandidateFilters as Filters } from "../../types/candidate";
import type { SavedFilter } from "../../types/savedFilter";

type CandidateTab = "all" | "favorites";

export function CandidatesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const tab: CandidateTab = searchParams.get("tab") === "favoritos" ? "favorites" : "all";

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 350);
  const [filters, setFilters] = useState<Filters>({ page: 1 });
  const [activeSavedFilterId, setActiveSavedFilterId] = useState<string | null>(null);

  const [candidates, setCandidates] = useState<Candidate[] | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [cities, setCities] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [ageRanges, setAgeRanges] = useState<string[]>([]);

  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Desbloqueio e associação direto da listagem, como no design.
  const [balance, setBalance] = useState(0);
  const [unlockTargetId, setUnlockTargetId] = useState<string | null>(null);
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [associateTargetId, setAssociateTargetId] = useState<string | null>(null);

  useEffect(() => {
    setCities(candidateService.getDistinctCities());
    setCategories(candidateService.getDistinctCategories());
    setAgeRanges(candidateService.getDistinctAgeRanges());
    favoriteService.getFavoriteIds().then((ids) => setFavoriteIds(new Set(ids)));
    savedFilterService.getSavedFilters().then(setSavedFilters);
    creditService.getBalance().then((b) => setBalance(b.available));
  }, []);

  const effectiveFilters = useMemo<Filters>(
    () => ({
      ...filters,
      search: debouncedSearch || undefined,
      favoritesOnly: tab === "favorites" ? true : undefined,
      pageSize: 8,
    }),
    [filters, debouncedSearch, tab]
  );

  async function load() {
    setLoading(true);
    setError(false);
    try {
      const result = await candidateService.getCandidates(effectiveFilters);
      setCandidates(result.items);
      setTotal(result.total);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveFilters]);

  function handleClearFilters() {
    setSearchInput("");
    setFilters({ page: 1 });
    setActiveSavedFilterId(null);
  }

  function handleChangeTab(next: string) {
    setSearchParams(next === "favorites" ? { tab: "favoritos" } : {});
    setFilters((prev) => ({ ...prev, page: 1 }));
    setSelectedIds(new Set());
  }

  async function handleToggleFavorite(candidateId: string) {
    const nowFavorite = await favoriteService.toggleFavorite(candidateId);
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (nowFavorite) next.add(candidateId);
      else next.delete(candidateId);
      return next;
    });
    if (!nowFavorite && tab === "favorites") {
      // Remover da lista de favoritos imediatamente ao desfavoritar nesta aba.
      setCandidates((prev) => prev?.filter((c) => c.id !== candidateId) ?? prev);
      setTotal((prev) => Math.max(0, prev - 1));
    }
    showToast(nowFavorite ? "Currículo adicionado aos favoritos." : "Currículo removido dos favoritos.", "success");
  }

  function handleToggleSelect(candidateId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(candidateId)) next.delete(candidateId);
      else if (next.size < 4) next.add(candidateId);
      return next;
    });
  }

  function handleApplySavedFilter(filter: SavedFilter) {
    setSearchInput(filter.filters.search ?? "");
    setFilters({ ...filter.filters, page: 1 });
    setActiveSavedFilterId(filter.id);
    if (filter.filters.favoritesOnly) setSearchParams({ tab: "favoritos" });
    else setSearchParams({});
  }

  async function handleSaveFilter(name: string) {
    const saved = await savedFilterService.saveFilter(name, effectiveFilters);
    setSavedFilters((prev) => [saved, ...prev]);
    setActiveSavedFilterId(saved.id);
    showToast("Filtro salvo com sucesso.", "success");
  }

  async function handleDeleteSavedFilter(id: string) {
    await savedFilterService.deleteFilter(id);
    setSavedFilters((prev) => prev.filter((f) => f.id !== id));
    if (activeSavedFilterId === id) setActiveSavedFilterId(null);
  }

  async function handleConfirmUnlock() {
    if (!unlockTargetId) return;
    setUnlockLoading(true);
    try {
      const updated = await candidateService.unlockCandidate(unlockTargetId);
      setCandidates((prev) => prev?.map((c) => (c.id === updated.id ? updated : c)) ?? prev);
      const newBalance = await creditService.getBalance();
      setBalance(newBalance.available);
      setUnlockTargetId(null);
      showToast("Currículo desbloqueado com sucesso.", "success");
    } catch (err) {
      const message = (err as { message?: string })?.message ?? "Não foi possível desbloquear o currículo.";
      showToast(message, "error");
    } finally {
      setUnlockLoading(false);
    }
  }

  async function handleAssociate(jobId: string) {
    if (!associateTargetId) return;
    try {
      await jobService.associateCandidate(associateTargetId, jobId);
      setAssociateTargetId(null);
      showToast("Currículo associado à vaga.", "success");
    } catch (err) {
      const message = (err as { message?: string })?.message ?? "Não foi possível associar o currículo.";
      showToast(message, "error");
    }
  }

  const associateTarget = candidates?.find((c) => c.id === associateTargetId) ?? null;

  const hasActiveCriteria = Boolean(
    debouncedSearch || filters.city || filters.professionalCategory || filters.cnh || filters.experience || filters.availability || filters.ageRange
  );

  return (
    <div>
      <PageHeader
        eyebrow="Base qualificada"
        eyebrowMeta="Currículos recebidos via WhatsApp"
        title="Banco de Currículos"
        subtitle="Explore e selecione profissionais da cadeia produtiva de rochas ornamentais e mineração."
      />

      <div className="mb-5">
        <Tabs
          variant="segmented"
          items={[
            { key: "all", label: "Todos os currículos", count: tab === "all" ? formatNumber(total) : undefined },
            { key: "favorites", label: "Favoritos", count: tab === "favorites" ? formatNumber(total) : undefined },
          ]}
          activeKey={tab}
          onChange={handleChangeTab}
        />
      </div>

      {/* Regra transacional sempre visível: o custo do desbloqueio nunca é
          uma surpresa, conforme o princípio de transparência atômica. */}
      <div className="mb-5 flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-accent-border)] border-l-4 border-l-[var(--color-accent)] bg-[var(--color-accent-soft)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-[13px] font-bold text-[var(--color-text)]">
            Regra de desbloqueio
            <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--color-accent)]">
              Custo fixo
            </span>
          </p>
          <p className="mt-1 text-[13px] text-[var(--color-text-secondary)]">
            O acesso aos dados de contato consome exatamente <strong>1 crédito por currículo</strong>. Currículos já
            desbloqueados permanecem acessíveis sem custo adicional.
          </p>
        </div>
        <div className="shrink-0 rounded-[var(--radius-md)] bg-[var(--color-surface)] px-4 py-2 text-right">
          <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">Seu saldo</p>
          <p className="font-display text-[20px] font-extrabold tabular text-[var(--color-accent)]">
            {formatNumber(balance)} <span className="text-[12px] font-semibold">créditos</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <SearchInput
          label="Buscar por nome, profissão ou palavra-chave"
          placeholder="Buscar por nome, profissão ou palavra-chave..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setFilters((prev) => ({ ...prev, page: 1 }));
            setActiveSavedFilterId(null);
          }}
        />

        <CandidateFilters
          filters={filters}
          onChange={(next) => {
            setFilters(next);
            setActiveSavedFilterId(null);
          }}
          cities={cities}
          categories={categories}
          ageRanges={ageRanges}
        />

        <SavedFilters
          savedFilters={savedFilters}
          activeFilterId={activeSavedFilterId}
          onApply={handleApplySavedFilter}
          onDelete={handleDeleteSavedFilter}
          onSave={handleSaveFilter}
          canSave={hasActiveCriteria}
        />
      </div>

      {selectedIds.size > 0 && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-[var(--radius-sm)] bg-[var(--color-primary-soft)] px-4 py-2.5">
          <p className="text-sm text-[var(--color-primary)]">{selectedIds.size} currículo{selectedIds.size !== 1 ? "s" : ""} selecionado{selectedIds.size !== 1 ? "s" : ""}</p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>
              Limpar seleção
            </Button>
            <Button
              size="sm"
              disabled={selectedIds.size < 2}
              onClick={() => navigate(`/curriculos/comparar?ids=${Array.from(selectedIds).join(",")}`)}
            >
              Comparar {selectedIds.size > 1 ? selectedIds.size : ""} currículos
            </Button>
          </div>
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <div className="grid gap-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-36 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <ErrorState onRetry={load} />
        ) : candidates && candidates.length > 0 ? (
          <>
            <p className="mb-3 text-sm text-[var(--color-text-secondary)]">
              {formatNumber(total)} currículo{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
            </p>
            <div className="grid gap-3">
              {candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  isFavorite={favoriteIds.has(candidate.id)}
                  onToggleFavorite={handleToggleFavorite}
                  selectable
                  selected={selectedIds.has(candidate.id)}
                  onToggleSelect={handleToggleSelect}
                  onUnlock={setUnlockTargetId}
                  onAssociate={setAssociateTargetId}
                />
              ))}
            </div>
            <div className="mt-5">
              <Pagination
                page={filters.page ?? 1}
                pageSize={8}
                total={total}
                onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
              />
            </div>
          </>
        ) : tab === "favorites" ? (
          <EmptyState
            title="Você ainda não possui currículos favoritos."
            description="Favorite currículos na listagem para encontrá-los rapidamente aqui."
            action={
              <Button size="sm" variant="secondary" onClick={() => handleChangeTab("all")}>
                Buscar currículos
              </Button>
            }
          />
        ) : (
          <EmptyState
            title="Não encontramos currículos com esses filtros."
            description="Tente ajustar ou limpar os filtros para ver mais resultados."
            action={
              <Button size="sm" variant="secondary" onClick={handleClearFilters}>
                Limpar filtros
              </Button>
            }
          />
        )}
      </div>

      <UnlockModal
        open={Boolean(unlockTargetId)}
        onClose={() => setUnlockTargetId(null)}
        onConfirm={handleConfirmUnlock}
        balance={balance}
        loading={unlockLoading}
      />
      <AssociateCandidateModal
        open={Boolean(associateTargetId)}
        onClose={() => setAssociateTargetId(null)}
        onAssociate={handleAssociate}
        associatedJobIds={associateTarget?.jobIds ?? []}
      />
    </div>
  );
}
