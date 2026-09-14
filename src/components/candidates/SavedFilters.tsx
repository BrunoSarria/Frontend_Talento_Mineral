import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";
import type { SavedFilter } from "../../types/savedFilter";

interface SavedFiltersProps {
  savedFilters: SavedFilter[];
  activeFilterId: string | null;
  onApply: (filter: SavedFilter) => void;
  onDelete: (id: string) => void;
  onSave: (name: string) => void;
  canSave: boolean;
}

export function SavedFilters({ savedFilters, activeFilterId, onApply, onDelete, onSave, canSave }: SavedFiltersProps) {
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [name, setName] = useState("");

  function handleConfirmSave() {
    if (!name.trim()) return;
    onSave(name.trim());
    setName("");
    setSaveModalOpen(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-[var(--color-text-muted)]">Meus filtros salvos:</span>

      {savedFilters.length === 0 && <span className="text-xs text-[var(--color-text-muted)]">Nenhum filtro salvo ainda.</span>}

      {savedFilters.map((filter) => (
        <span
          key={filter.id}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
            activeFilterId === filter.id
              ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
              : "border-[var(--color-border-strong)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
          }`}
        >
          <button type="button" onClick={() => onApply(filter)}>
            {filter.name}
          </button>
          <button type="button" onClick={() => onDelete(filter.id)} aria-label={`Excluir filtro ${filter.name}`} className="text-[var(--color-text-muted)] hover:text-[var(--color-error)]">
            ×
          </button>
        </span>
      ))}

      {canSave && (
        <Button variant="ghost" size="sm" onClick={() => setSaveModalOpen(true)}>
          + Salvar filtro atual
        </Button>
      )}

      <Modal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        title="Salvar combinação de filtros"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSaveModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmSave} disabled={!name.trim()}>
              Salvar
            </Button>
          </>
        }
      >
        <Input
          label="Nome do filtro"
          placeholder="Ex: Operadores de Máquina - Cachoeiro"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </Modal>
    </div>
  );
}
