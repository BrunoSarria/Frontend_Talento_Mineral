import { useState, type FormEvent } from "react";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import type { JobFormData } from "../../types/job";

interface JobFormProps {
  initialValue?: JobFormData;
  onSubmit: (data: JobFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

const CATEGORY_OPTIONS = [
  "Operador de Máquina",
  "Polidor de Rocha",
  "Serrador",
  "Marmorista",
  "Auxiliar de Produção",
  "Motorista/Carreteiro",
  "Soldador",
  "Técnico de Manutenção",
  "Conferente de Chapas",
  "Classificador de Blocos",
  "Encarregado de Produção",
  "Auxiliar Administrativo",
];

const CNH_OPTIONS = ["Não exigido", "A", "B", "AB", "C", "D", "E"];

const EMPTY_VALUE: JobFormData = {
  title: "",
  professionalCategory: CATEGORY_OPTIONS[0],
  location: "",
  description: "",
  experience: "",
  cnh: "Não exigido",
  requirements: [],
  status: "OPEN",
};

export function JobForm({ initialValue = EMPTY_VALUE, onSubmit, onCancel, submitLabel }: JobFormProps) {
  const [form, setForm] = useState<JobFormData>(initialValue);
  const [requirementsText, setRequirementsText] = useState(initialValue.requirements.join("\n"));
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function update<K extends keyof JobFormData>(key: K, value: JobFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof JobFormData, string>> = {};
    if (!form.title.trim()) next.title = "Informe o título da vaga.";
    if (!form.professionalCategory.trim()) next.professionalCategory = "Selecione uma categoria.";
    if (!form.location.trim()) next.location = "Informe a localização.";
    if (!form.description.trim()) next.description = "Descreva a vaga.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const requirements = requirementsText
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean);
      await onSubmit({ ...form, requirements, cnh: form.cnh === "Não exigido" ? undefined : form.cnh });
    } catch (err) {
      setSubmitError((err as { message?: string })?.message ?? "Não foi possível salvar a vaga.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-[var(--color-text)]">Informações da vaga</h2>
        <Input label="Título" required value={form.title} onChange={(e) => update("title", e.target.value)} error={errors.title} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Categoria profissional" required value={form.professionalCategory} onChange={(e) => update("professionalCategory", e.target.value)} error={errors.professionalCategory}>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
          <Input
            label="Localização"
            required
            placeholder="Cachoeiro de Itapemirim"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            error={errors.location}
          />
        </div>
        <Textarea label="Descrição" required value={form.description} onChange={(e) => update("description", e.target.value)} error={errors.description} />
      </section>

      <section className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-5">
        <h2 className="text-sm font-semibold text-[var(--color-text)]">Requisitos</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Experiência" placeholder="Ex: 2 anos" value={form.experience ?? ""} onChange={(e) => update("experience", e.target.value)} />
          <Select label="CNH" value={form.cnh ?? "Não exigido"} onChange={(e) => update("cnh", e.target.value)}>
            {CNH_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "Não exigido" ? "Não exigido" : `CNH ${opt}`}
              </option>
            ))}
          </Select>
        </div>
        <Textarea
          label="Outros requisitos"
          hint="Um requisito por linha."
          rows={3}
          value={requirementsText}
          onChange={(e) => setRequirementsText(e.target.value)}
        />
      </section>

      <section className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-5">
        <h2 className="text-sm font-semibold text-[var(--color-text)]">Status</h2>
        <Select label="Status da vaga" value={form.status} onChange={(e) => update("status", e.target.value as JobFormData["status"])}>
          <option value="DRAFT">Rascunho</option>
          <option value="OPEN">Aberta</option>
          <option value="PAUSED">Pausada</option>
          <option value="CLOSED">Encerrada</option>
        </Select>
      </section>

      {submitError && (
        <p role="alert" className="rounded-[var(--radius-sm)] bg-[var(--color-error-soft)] px-3 py-2 text-sm text-[var(--color-error)]">
          {submitError}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
