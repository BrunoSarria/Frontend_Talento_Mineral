import { NavLink, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface SidebarProps {
  onNavigate?: () => void;
}

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: IconGrid },
  { to: "/vagas", label: "Vagas", icon: IconBriefcase },
  { to: "/creditos", label: "Créditos", icon: IconCoin },
  { to: "/historico", label: "Histórico", icon: IconClock },
];

export function Sidebar({ onNavigate }: SidebarProps) {
  const { logout } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const onCandidates = location.pathname === "/curriculos";
  const favoritesActive = onCandidates && searchParams.get("tab") === "favoritos";
  const allCandidatesActive = onCandidates && !favoritesActive;

  return (
    <div className="flex h-full flex-col justify-between px-3 py-5">
      <div>
        <div className="mb-6 flex items-center gap-2 px-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-primary)] text-[var(--color-surface)]">
            <IconMark />
          </span>
          <span className="font-display text-[15px] font-semibold leading-tight text-[var(--color-text)]">
            Talento
            <br />
            Mineral
          </span>
        </div>

        <nav aria-label="Navegação principal" className="flex flex-col gap-0.5">
          <NavLink
            to="/dashboard"
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)]"
              }`
            }
          >
            <IconGrid />
            Dashboard
          </NavLink>

          <div>
            <NavLink
              to="/curriculos"
              onClick={onNavigate}
              className={`flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium transition-colors ${
                onCandidates
                  ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)]"
              }`}
            >
              <IconUsers />
              Currículos
            </NavLink>
            <div className="ml-[34px] mt-0.5 flex flex-col gap-0.5 border-l border-[var(--color-border)] pl-3">
              <NavLink
                to="/curriculos"
                onClick={onNavigate}
                className={`rounded-[var(--radius-sm)] px-2.5 py-1.5 text-sm transition-colors ${
                  allCandidatesActive ? "font-medium text-[var(--color-primary)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                }`}
              >
                Todos
              </NavLink>
              <NavLink
                to="/curriculos?tab=favoritos"
                onClick={onNavigate}
                className={`rounded-[var(--radius-sm)] px-2.5 py-1.5 text-sm transition-colors ${
                  favoritesActive ? "font-medium text-[var(--color-primary)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                }`}
              >
                Favoritos
              </NavLink>
            </div>
          </div>

          {NAV_ITEMS.filter((item) => item.to !== "/dashboard").map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)]"
                }`
              }
            >
              <Icon />
              {label}
            </NavLink>
          ))}

          <div className="my-2 border-t border-[var(--color-border)]" />

          <NavLink
            to="/notificacoes"
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)]"
              }`
            }
          >
            <IconBell />
            Notificações
          </NavLink>
        </nav>
      </div>

      <div className="flex flex-col gap-0.5 border-t border-[var(--color-border)] pt-3">
        <NavLink
          to="/ajuda"
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)]"
            }`
          }
        >
          <IconHelp />
          Ajuda
        </NavLink>
        <NavLink
          to="/configuracoes"
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)]"
            }`
          }
        >
          <IconSettings />
          Configurações
        </NavLink>
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            logout();
          }}
          className="flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-left text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)]"
        >
          <IconLogout />
          Sair
        </button>
      </div>
    </div>
  );
}

function IconMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2L14 5.5L12 13H4L2 5.5L8 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}
function IconGrid() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9.5" y="2" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="2" y="9.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9.5" y="9.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <circle cx="6.3" cy="5.5" r="2.3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1.8 14C1.8 11.4 3.8 9.4 6.3 9.4C8.8 9.4 10.8 11.4 10.8 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M11 9.6C13 9.9 14.5 11.7 14.5 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M9.7 3.4C10.8 3.6 11.6 4.5 11.6 5.6C11.6 6.7 10.8 7.6 9.7 7.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
function IconBriefcase() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <rect x="2" y="5.3" width="13" height="8.5" rx="1.3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6 5.3V4C6 3.4 6.4 3 7 3H10C10.6 3 11 3.4 11 4V5.3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 9.3H15" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
function IconCoin() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8.5 5.5V11.5M6.8 10.2C6.8 10.9 7.5 11.4 8.5 11.4C9.5 11.4 10.2 10.9 10.2 10.1C10.2 8.5 6.8 9.1 6.8 7.5C6.8 6.7 7.5 6.2 8.5 6.2C9.3 6.2 9.9 6.5 10.1 7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8.5 5.3V8.7L10.7 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="2.3" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M8.5 2.5V3.8M8.5 13.2V14.5M14.5 8.5H13.2M3.8 8.5H2.5M12.6 4.4L11.7 5.3M5.3 11.7L4.4 12.6M12.6 12.6L11.7 11.7M5.3 5.3L4.4 4.4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <path d="M4 11.8V7.7C4 5.3 5.9 3.4 8.5 3.4C11.1 3.4 13 5.3 13 7.7V11.8L14.2 13.2H2.8L4 11.8Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M6.9 14.3C7.2 14.9 7.8 15.2 8.5 15.2C9.2 15.2 9.8 14.9 10.1 14.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
function IconHelp() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="6.2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6.7 6.6C6.9 5.6 7.6 5 8.6 5C9.6 5 10.4 5.7 10.4 6.6C10.4 7.9 8.6 7.8 8.6 9.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8.6" cy="11.7" r="0.85" fill="currentColor" />
    </svg>
  );
}
function IconLogout() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <path d="M6.5 14H3.8C3.4 14 3 13.6 3 13.2V3.8C3 3.4 3.4 3 3.8 3H6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M10.5 11.5L14 8.5L10.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 8.5H6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
