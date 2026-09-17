import { useAuth } from "../../hooks/useAuth";
import { Dropdown } from "../ui/Dropdown";
import { Avatar } from "../ui/Avatar";
import { NotificationBell } from "./NotificationBell";
import { ThemeToggle } from "./ThemeToggle";
import { CreditPill } from "./CreditPill";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export function Header({ onMenuClick, title }: HeaderProps) {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-[var(--radius-sm)] p-2 text-[var(--color-text)] hover:bg-[var(--color-surface-sunken)] md:hidden"
          aria-label="Abrir menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3 5.5H17M3 10H17M3 14.5H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        {title && (
          <span className="truncate font-display text-base font-bold text-[var(--color-text)]">{title}</span>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <CreditPill />
        <span className="mx-1 hidden h-6 w-px bg-[var(--color-border)] sm:block" aria-hidden="true" />
        <NotificationBell />
        <ThemeToggle />
        <Dropdown
          align="right"
          trigger={
            <span className="flex items-center gap-2.5 rounded-full py-1 pl-1.5 pr-2 hover:bg-[var(--color-surface-sunken)]">
              <Avatar name={session?.recruiter.name} size="sm" />
              <span className="hidden text-left lg:block">
                <span className="block text-[13px] font-semibold leading-tight text-[var(--color-text)]">
                  {session?.recruiter.name}
                </span>
                <span className="block text-[11px] leading-tight text-[var(--color-text-muted)]">
                  {session?.recruiter.role ?? "Recrutador"}
                </span>
              </span>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true" className="text-[var(--color-text-muted)]">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
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
