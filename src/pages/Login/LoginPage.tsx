import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("demo@talentomineral.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const message = (err as { message?: string })?.message ?? "Não foi possível entrar. Tente novamente.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout quote="Usado por empresas de rochas ornamentais em Cachoeiro de Itapemirim.">
      <h1 className="text-2xl font-semibold text-[var(--color-text)]">Entre na sua conta</h1>
      <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">
        Acesse o painel para pesquisar currículos e gerenciar suas vagas.
      </p>

      <form className="mt-7 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Senha"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p role="alert" className="rounded-[var(--radius-sm)] bg-[var(--color-error-soft)] px-3 py-2 text-sm text-[var(--color-error)]">
            {error}
          </p>
        )}

        <Button type="submit" fullWidth loading={loading}>
          Entrar
        </Button>
      </form>

      <p className="mt-5 rounded-[var(--radius-sm)] bg-[var(--color-primary-soft)] px-3 py-2.5 text-xs text-[var(--color-primary)]">
        Ambiente de demonstração — use <strong>demo@talentomineral.com</strong> e senha <strong>123456</strong>.
      </p>

      <p className="mt-6 text-sm text-[var(--color-text-secondary)]">
        Não possui uma conta?{" "}
        <Link to="/cadastro" className="font-medium text-[var(--color-primary)] hover:underline">
          Cadastre-se
        </Link>
      </p>
    </AuthLayout>
  );
}
