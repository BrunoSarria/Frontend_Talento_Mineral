import { useState, type FormEvent } from "react";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Avatar } from "../../components/ui/Avatar";
import { Modal } from "../../components/ui/Modal";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { settingsService } from "../../services/settingsService";

export function AccountSection() {
  const { session, refreshSession } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(session?.recruiter.name ?? "");
  const [email, setEmail] = useState(session?.recruiter.email ?? "");
  const [phone, setPhone] = useState(session?.recruiter.phone ?? "");
  const [role, setRole] = useState(session?.recruiter.role ?? "");
  const [saving, setSaving] = useState(false);

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsService.updateAccount({ name, email, phone, role });
      refreshSession();
      showToast("Dados da conta atualizados.", "success");
    } catch {
      showToast("Não foi possível salvar seus dados.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    setPasswordSaving(true);
    try {
      await settingsService.changePassword(currentPassword, newPassword);
      setPasswordModalOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      showToast("Senha alterada com sucesso.", "success");
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <Card>
      <h2 className="mb-4 text-base font-semibold text-[var(--color-text)]">Minha conta</h2>
      <div className="mb-5 flex items-center gap-3">
        <Avatar name={session?.recruiter.name} size="lg" />
        <p className="text-xs text-[var(--color-text-muted)]">
          O upload de foto de perfil estará disponível em uma próxima etapa.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Cargo" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Ex: Analista de RH" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button type="submit" loading={saving}>
            Salvar alterações
          </Button>
          <Button type="button" variant="secondary" onClick={() => setPasswordModalOpen(true)}>
            Alterar senha
          </Button>
        </div>
      </form>

      <Modal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        title="Alterar senha"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPasswordModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleChangePassword} loading={passwordSaving} disabled={!currentPassword || newPassword.length < 6}>
              Salvar nova senha
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input label="Senha atual" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          <Input label="Nova senha" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} hint="Mínimo de 6 caracteres." />
        </div>
      </Modal>
    </Card>
  );
}
