import { useAuth } from "../../hooks/useAuth";
import { Dropdown } from "../ui/Dropdown";
import { Avatar } from "../ui/Avatar";
import { NotificationBell } from "./NotificationBell";
import { ThemeToggle } from "./ThemeToggle";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export function Header({ onMenuClick, title }: HeaderProps) {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-[var(--radius-sm)] p-2 text-[var(--color-text)] hover:bg-[var(--color-surface-sunken)] md:hidden"
          aria-label="Abrir menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3 5.5H17M3 10H17M3 14.5H17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <span className="font-display text-sm font-semibold text-[var(--color-text)] md:hidden">{title ?? "Talento Mineral"}</span>
        {title && <span className="hidden font-display text-base font-semibold text-[var(--color-text)] md:block">{title}</span>}
      </div>

      <div className="flex items-center gap-1.5">
        <NotificationBell />
        <ThemeToggle />
        <Dropdown
          align="right"
          trigger={
            <span className="flex items-center gap-2.5 rounded-[var(--radius-sm)] py-1 pl-1.5 pr-2 hover:bg-[var(--color-surface-sunken)]">
              <Avatar name={session?.recruiter.name} size="sm" />
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-medium leading-tight text-[var(--color-text)]">{session?.recruiter.name}</span>
                <span className="block text-xs leading-tight text-[var(--color-text-secondary)]">{session?.recruiter.companyName}</span>
              </span>
            </span>
          }
          items={[
            { label: "Configurações", onSelect: () => navigate("/configuracoes") },
            { label: "Central de ajuda", onSelect: () => navigate("/ajuda") },
            { label: "Sair", tone: "danger", onSelect: () => logout() },
          ]}
        />
      </div>
    </header>
  );
}
