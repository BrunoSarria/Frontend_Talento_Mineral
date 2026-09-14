import { useEffect, useState, type FormEvent } from "react";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";
import { useToast } from "../../hooks/useToast";
import { settingsService } from "../../services/settingsService";
import type { Company } from "../../types/company";

export function CompanySection() {
  const { showToast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsService.getCompany().then(setCompany);
  }, []);

  function update<K extends keyof Company>(key: K, value: Company[K]) {
    setCompany((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!company) return;
    setSaving(true);
    try {
      const updated = await settingsService.updateCompany(company);
      setCompany(updated);
      showToast("Dados da empresa atualizados.", "success");
    } catch {
      showToast("Não foi possível salvar os dados da empresa.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <h2 className="mb-4 text-base font-semibold text-[var(--color-text)]">Empresa</h2>

      {!company ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nome da empresa" value={company.name} onChange={(e) => update("name", e.target.value)} required />
            <Input label="CNPJ" value={company.document ?? ""} onChange={(e) => update("document", e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="E-mail comercial" type="email" value={company.businessEmail ?? ""} onChange={(e) => update("businessEmail", e.target.value)} />
            <Input label="Telefone" value={company.businessPhone ?? ""} onChange={(e) => update("businessPhone", e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
            <Input label="Cidade" value={company.city} onChange={(e) => update("city", e.target.value)} required />
            <Input label="UF" value={company.state ?? ""} onChange={(e) => update("state", e.target.value.toUpperCase().slice(0, 2))} maxLength={2} />
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">O upload de logo da empresa estará disponível em uma próxima etapa.</p>
          <div>
            <Button type="submit" loading={saving}>
              Salvar alterações
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
