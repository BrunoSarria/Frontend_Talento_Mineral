import { useState } from "react";
import type { CandidateFilters as Filters } from "../../types/candidate";
import { Select } from "../ui/Select";
import { Badge } from "../ui/Badge";

interface CandidateFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  cities: string[];
  categories: string[];
  ageRanges: string[];
}

const CNH_OPTIONS = ["Todas", "Nenhuma", "A", "B", "AB", "C", "D", "E"];
const EXPERIENCE_OPTIONS = [
  { value: "Qualquer", label: "Qualquer" },
  { value: "1", label: "1+ ano" },
  { value: "2", label: "2+ anos" },
  { value: "5", label: "5+ anos" },
];
const AVAILABILITY_OPTIONS = ["Qualquer", "Imediata", "15 dias", "30 dias", "A combinar"];

const FILTER_LABELS: Record<string, string> = {
  city: "Cidade",
  professionalCategory: "Categoria",
  cnh: "CNH",
  experience: "Experiência",
  availability: "Disponibilidade",
  ageRange: "Faixa etária",
};

export function CandidateFilters({ filters, onChange, cities, categories, ageRanges }: CandidateFiltersProps) {
  const [showMore, setShowMore] = useState(Boolean(filters.ageRange));

  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    onChange({ ...filters, [key]: value, page: 1 });
  }

  function remove(key: keyof Filters) {
    const next = { ...filters };
    delete next[key];
    onChange({ ...next, page: 1 });
  }

  function clearAll() {
    onChange({ search: filters.search, page: 1 });
  }

  const activeChips = (Object.keys(FILTER_LABELS) as (keyof Filters)[])
    .filter((key) => {
      const value = filters[key];
      return value && value !== "Todas" && value !== "Qualquer";
    })
    .map((key) => ({ key, value: String(filters[key]) }));

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Select label="Cidade / Polo" aria-label="Cidade" value={filters.city ?? "Todas"} onChange={(e) => set("city", e.target.value)}>
          <option value="Todas">Todas as cidades</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </Select>

        <Select label="Categoria" aria-label="Categoria profissional" value={filters.professionalCategory ?? "Todas"} onChange={(e) => set("professionalCategory", e.target.value)}>
          <option value="Todas">Todas as categorias</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>

        <Select label="Habilitação CNH" aria-label="CNH" value={filters.cnh ?? "Todas"} onChange={(e) => set("cnh", e.target.value)}>
          {CNH_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "Todas" ? "CNH (todas)" : opt === "Nenhuma" ? "Sem CNH" : `CNH ${opt}`}
            </option>
          ))}
        </Select>

        <Select label="Experiência" aria-label="Experiência" value={filters.experience ?? "Qualquer"} onChange={(e) => set("experience", e.target.value)}>
          {EXPERIENCE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>

        <Select label="Disponibilidade" aria-label="Disponibilidade" value={filters.availability ?? "Qualquer"} onChange={(e) => set("availability", e.target.value)}>
          {AVAILABILITY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "Qualquer" ? "Disponibilidade" : opt}
            </option>
          ))}
        </Select>

        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="col-span-2 h-10 self-end rounded-[var(--radius-sm)] border border-dashed border-[var(--color-border-strong)] px-3 text-[13px] font-semibold text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] sm:col-span-1"
        >
          {showMore ? "− Menos filtros" : "+ Mais filtros"}
        </button>
      </div>

      {showMore && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Select label="Faixa etária" aria-label="Faixa etária" value={filters.ageRange ?? "Todas"} onChange={(e) => set("ageRange", e.target.value)}>
            <option value="Todas">Faixa etária</option>
            {ageRanges.map((range) => (
              <option key={range} value={range}>
                {range} anos
              </option>
            ))}
          </Select>
        </div>
      )}

      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-surface-sunken)] px-3 py-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">
            Filtros ativos:
          </span>
          {activeChips.map((chip) => (
            <button key={chip.key} type="button" onClick={() => remove(chip.key)} className="group">
              <Badge tone="primary">
                {FILTER_LABELS[chip.key]}: {chip.value}
                <span aria-hidden="true" className="ml-0.5 group-hover:opacity-70">
                  ×
                </span>
              </Badge>
            </button>
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="text-[12px] font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-error)] hover:underline"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}
