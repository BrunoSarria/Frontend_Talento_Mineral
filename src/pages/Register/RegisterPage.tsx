import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../Login/AuthLayout";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

interface FormState {
  recruiterName: string;
  recruiterEmail: string;
  recruiterPhone: string;
  companyName: string;
  companyDocument: string;
  companyCity: string;
  password: string;
  confirmPassword: string;
}

const EMPTY_FORM: FormState = {
  recruiterName: "",
  recruiterEmail: "",
  recruiterPhone: "",
  companyName: "",
  companyDocument: "",
  companyCity: "",
  password: "",
  confirmPassword: "",
};

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};

    if (!form.recruiterName.trim()) next.recruiterName = "Informe seu nome.";
    if (!form.recruiterEmail.trim()) next.recruiterEmail = "Informe seu e-mail.";
    else if (!/^\S+@\S+\.\S+$/.test(form.recruiterEmail)) next.recruiterEmail = "E-mail inválido.";
    if (!form.recruiterPhone.trim()) next.recruiterPhone = "Informe um telefone de contato.";
    if (!form.companyName.trim()) next.companyName = "Informe o nome da empresa.";
    if (!form.companyCity.trim()) next.companyCity = "Informe a cidade da empresa.";
    if (!form.password) next.password = "Crie uma senha.";
    else if (form.password.length < 6) next.password = "A senha deve ter pelo menos 6 caracteres.";
    if (form.confirmPassword !== form.password) next.confirmPassword = "As senhas não coincidem.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        recruiterName: form.recruiterName,
        recruiterEmail: form.recruiterEmail,
        recruiterPhone: form.recruiterPhone,
        companyName: form.companyName,
        companyDocument: form.companyDocument || undefined,
        companyCity: form.companyCity,
        password: form.password,
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const e2 = err as { message?: string; fieldErrors?: Record<string, string> };
      setSubmitError(e2.message ?? "Não foi possível criar a conta.");
      if (e2.fieldErrors) {
        setErrors((prev) => ({ ...prev, ...(e2.fieldErrors as Partial<Record<keyof FormState, string>>) }));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold text-[var(--color-text)]">Criar conta</h1>
      <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">
        Cadastre sua empresa para começar a pesquisar currículos.
      </p>

      <form className="mt-7 flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Dados do recrutador</h2>
          <Input label="Nome" required value={form.recruiterName} onChange={(e) => update("recruiterName", e.target.value)} error={errors.recruiterName} />
          <Input
            label="E-mail"
            type="email"
            required
            value={form.recruiterEmail}
            onChange={(e) => update("recruiterEmail", e.target.value)}
            error={errors.recruiterEmail}
          />
          <Input label="Telefone" required value={form.recruiterPhone} onChange={(e) => update("recruiterPhone", e.target.value)} error={errors.recruiterPhone} placeholder="(28) 99999-0000" />
        </section>

        <section className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-5">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Dados da empresa</h2>
          <Input label="Nome da empresa" required value={form.companyName} onChange={(e) => update("companyName", e.target.value)} error={errors.companyName} />
          <Input label="CNPJ" hint="Opcional nesta etapa." value={form.companyDocument} onChange={(e) => update("companyDocument", e.target.value)} />
          <Input label="Cidade" required value={form.companyCity} onChange={(e) => update("companyCity", e.target.value)} error={errors.companyCity} placeholder="Cachoeiro de Itapemirim" />
        </section>

        <section className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-5">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Senha</h2>
          <Input label="Senha" type="password" required value={form.password} onChange={(e) => update("password", e.target.value)} error={errors.password} />
          <Input
            label="Confirmar senha"
            type="password"
            required
            value={form.confirmPassword}
            onChange={(e) => update("confirmPassword", e.target.value)}
            error={errors.confirmPassword}
          />
        </section>

        {submitError && (
          <p role="alert" className="rounded-[var(--radius-sm)] bg-[var(--color-error-soft)] px-3 py-2 text-sm text-[var(--color-error)]">
            {submitError}
          </p>
        )}

        <Button type="submit" fullWidth loading={loading}>
          Criar conta
        </Button>
      </form>

      <p className="mt-6 text-sm text-[var(--color-text-secondary)]">
        Já possui uma conta?{" "}
        <Link to="/login" className="font-medium text-[var(--color-primary)] hover:underline">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
}
