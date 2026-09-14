import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-bg)] px-6 text-center">
      <p className="font-display text-6xl font-semibold text-[var(--color-primary)]">404</p>
      <h1 className="text-xl font-semibold text-[var(--color-text)]">Página não encontrada</h1>
      <p className="max-w-sm text-sm text-[var(--color-text-secondary)]">O recurso que você tentou acessar não existe ou foi removido.</p>
      <Link to="/dashboard">
        <Button>Voltar ao dashboard</Button>
      </Link>
    </div>
  );
}
