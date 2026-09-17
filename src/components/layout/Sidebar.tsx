import { useEffect, useState, type ReactNode } from "react";
import { NavLink, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { jobService } from "../../services/jobService";
import { creditService } from "../../services/creditService";
import { candidateService } from "../../services/candidateService";
import { notificationService } from "../../services/notificationService";
import { formatNumber } from "../../utils/format";

interface SidebarProps {
  onNavigate?: () => void;
}

/** Contagens exibidas à direita de cada item, como no design system. */
interface SidebarCounts {
  candidates?: number;
  jobs?: number;
  credits?: number;
  notifications?: number;
}

const ITEM_BASE =
  "flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-semibold transition-colors";
const ITEM_ACTIVE = "bg-[var(--color-primary)] text-[var(--color-on-primary)]";
const ITEM_IDLE =
  "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)]";

export function Sidebar({ onNavigate }: SidebarProps) {
  const { logout, session } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [counts, setCounts] = useState<SidebarCounts>({});

  const onCandidates = location.pathname.startsWith("/curriculos");
  const favoritesActive = onCandidates && searchParams.get("tab") === "favoritos";
  const allCandidatesActive = onCandidates && !favoritesActive;

  useEffect(() => {
    let active = true;
    Promise.all([
      jobService.getJobs(),
      creditService.getBalance(),
      candidateService.getCandidates({ pageSize: 1 }),
      notificationService.getUnreadCount(),
    ])
      .then(([jobs, balance, candidates, unread]) => {
        if (!active) return;
        setCounts({
          jobs: jobs.length,
          credits: balance.available,
          candidates: candidates.total,
          notifications: unread,
        });
      })
      .catch(() => {
        /* contadores são informativos; falham silenciosamente */
      });
    return () => {
      active = false;
    };
  }, [location.pathname]);

  return (
    <div className="flex h-full flex-col justify-between px-3 py-5">
      <div className="min-h-0">
        <div className="mb-7 flex items-center gap-2.5 px-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-primary-deep)] text-white dark:text-[#001d33]">
            <IconMark />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-[15px] font-extrabold leading-tight text-[var(--color-text)]">
              Talento Mineral
            </span>
            <span className="block text-[11px] leading-tight text-[var(--color-text-muted)]">
              Conectando Pessoas ao Mercado de Rochas
            </span>
          </span>
        </div>

        <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
          Navegação principal
        </p>

        <nav aria-label="Navegação principal" className="flex flex-col gap-0.5">
          <NavLink
            to="/dashboard"
            onClick={onNavigate}
            className={({ isActive }) => `${ITEM_BASE} ${isActive ? ITEM_ACTIVE : ITEM_IDLE}`}
          >
            <IconGrid />
            Dashboard
          </NavLink>

          <div>
            <NavLink
              to="/curriculos"
              onClick={onNavigate}
              className={`${ITEM_BASE} ${onCandidates ? ITEM_ACTIVE : ITEM_IDLE}`}
            >
              <IconUsers />
              <span className="flex-1">Currículos</span>
              {counts.candidates !== undefined && <Count active={onCandidates}>{formatNumber(counts.candidates)}</Count>}
            </NavLink>
            <div className="ml-[34px] mt-0.5 flex flex-col gap-0.5 border-l border-[var(--color-border)] pl-3">
              <NavLink
                to="/curriculos"
                onClick={onNavigate}
                className={`rounded-[var(--radius-sm)] px-2.5 py-1.5 text-[13px] transition-colors ${
                  allCandidatesActive
                    ? "font-semibold text-[var(--color-primary)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                }`}
              >
                Todos
              </NavLink>
              <NavLink
                to="/curriculos?tab=favoritos"
                onClick={onNavigate}
                className={`rounded-[var(--radius-sm)] px-2.5 py-1.5 text-[13px] transition-colors ${
                  favoritesActive
                    ? "font-semibold text-[var(--color-primary)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                }`}
              >
                Favoritos
              </NavLink>
            </div>
          </div>

          <NavLink to="/vagas" onClick={onNavigate} className={({ isActive }) => `${ITEM_BASE} ${isActive ? ITEM_ACTIVE : ITEM_IDLE}`}>
            {({ isActive }) => (
              <>
                <IconBriefcase />
                <span className="flex-1">Vagas</span>
                {counts.jobs !== undefined && <Count active={isActive}>{counts.jobs}</Count>}
              </>
            )}
          </NavLink>

          <NavLink to="/historico" onClick={onNavigate} className={({ isActive }) => `${ITEM_BASE} ${isActive ? ITEM_ACTIVE : ITEM_IDLE}`}>
            <IconClock />
            Histórico
          </NavLink>

          <NavLink to="/creditos" onClick={onNavigate} className={({ isActive }) => `${ITEM_BASE} ${isActive ? ITEM_ACTIVE : ITEM_IDLE}`}>
            {({ isActive }) => (
              <>
                <IconCoin />
                <span className="flex-1">Créditos</span>
                {counts.credits !== undefined && (
                  <span
                    className={`rounded-full px-1.5 text-[12px] font-bold tabular ${
                      isActive ? "text-[var(--color-on-primary)]" : "text-[var(--color-accent)]"
                    }`}
                  >
                    {formatNumber(counts.credits)}
                  </span>
                )}
              </>
            )}
          </NavLink>

          <p className="mb-2 mt-5 px-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
            Sistema &amp; suporte
          </p>

          <NavLink to="/notificacoes" onClick={onNavigate} className={({ isActive }) => `${ITEM_BASE} ${isActive ? ITEM_ACTIVE : ITEM_IDLE}`}>
            {({ isActive }) => (
              <>
                <IconBell />
                <span className="flex-1">Notificações</span>
                {counts.notifications ? (
                  <span
                    className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold tabular ${
                      isActive ? "bg-white/20 text-[var(--color-on-primary)]" : "bg-[var(--color-error-soft)] text-[var(--color-error)]"
                    }`}
                  >
                    {counts.notifications}
                  </span>
                ) : null}
              </>
            )}
          </NavLink>

          <NavLink to="/configuracoes" onClick={onNavigate} className={({ isActive }) => `${ITEM_BASE} ${isActive ? ITEM_ACTIVE : ITEM_IDLE}`}>
            <IconSettings />
            Configurações
          </NavLink>

          <NavLink to="/ajuda" onClick={onNavigate} className={({ isActive }) => `${ITEM_BASE} ${isActive ? ITEM_ACTIVE : ITEM_IDLE}`}>
            <IconHelp />
            Central de Ajuda
          </NavLink>
        </nav>
      </div>

      {/* Cartão de conta corporativa, fixo na base da navegação. */}
      <div className="mt-6 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-sunken)] p-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-surface)] text-[var(--color-primary)]">
            <IconBuilding />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-semibold leading-tight text-[var(--color-text)]">
              {session?.recruiter.companyName ?? "Minha empresa"}
            </span>
            <span className="block text-[11px] leading-tight text-[var(--color-text-muted)]">Conta corporativa</span>
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--color-border)] pt-2.5">
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-semibold leading-tight text-[var(--color-text)]">
              {session?.recruiter.name}
            </span>
            <span className="block truncate text-[11px] leading-tight text-[var(--color-text-muted)]">
              {session?.recruiter.role ?? "Recrutador"}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-0.5">
            <NavLink
              to="/configuracoes"
              onClick={onNavigate}
              aria-label="Configurações"
              className="rounded-[var(--radius-sm)] p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
            >
              <IconSettings />
            </NavLink>
            <button
              type="button"
              onClick={() => {
                onNavigate?.();
                logout();
              }}
              aria-label="Sair"
              className="rounded-[var(--radius-sm)] p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-error)]"
            >
              <IconLogout />
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

function Count({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <span
      className={`rounded-full px-1.5 text-[12px] font-bold tabular ${
        active ? "bg-white/20 text-[var(--color-on-primary)]" : "bg-[var(--color-surface-sunken)] text-[var(--color-text-secondary)]"
      }`}
    >
      {children}
    </span>
  );
}

function IconMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2L14 5.5L12 13H4L2 5.5L8 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M2 5.5L8 8L14 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
function IconGrid() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="9.5" y="2" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="2" y="9.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="9.5" y="9.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <circle cx="6.3" cy="5.5" r="2.3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M1.8 14C1.8 11.4 3.8 9.4 6.3 9.4C8.8 9.4 10.8 11.4 10.8 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M11 9.6C13 9.9 14.5 11.7 14.5 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M9.7 3.4C10.8 3.6 11.6 4.5 11.6 5.6C11.6 6.7 10.8 7.6 9.7 7.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function IconBriefcase() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <rect x="2" y="5.3" width="13" height="8.5" rx="1.4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 5.3V4C6 3.4 6.4 3 7 3H10C10.6 3 11 3.4 11 4V5.3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2 9.3H15" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
function IconCoin() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8.5 5.5V11.5M6.8 10.2C6.8 10.9 7.5 11.4 8.5 11.4C9.5 11.4 10.2 10.9 10.2 10.1C10.2 8.5 6.8 9.1 6.8 7.5C6.8 6.7 7.5 6.2 8.5 6.2C9.3 6.2 9.9 6.5 10.1 7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8.5 5.3V8.7L10.7 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <path d="M4 11.8V7.7C4 5.3 5.9 3.4 8.5 3.4C11.1 3.4 13 5.3 13 7.7V11.8L14.2 13.2H2.8L4 11.8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M6.9 14.3C7.2 14.9 7.8 15.2 8.5 15.2C9.2 15.2 9.8 14.9 10.1 14.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="2.3" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8.5 2.5V3.8M8.5 13.2V14.5M14.5 8.5H13.2M3.8 8.5H2.5M12.6 4.4L11.7 5.3M5.3 11.7L4.4 12.6M12.6 12.6L11.7 11.7M5.3 5.3L4.4 4.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconHelp() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="6.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6.7 6.6C6.9 5.6 7.6 5 8.6 5C9.6 5 10.4 5.7 10.4 6.6C10.4 7.9 8.6 7.8 8.6 9.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="8.6" cy="11.7" r="0.85" fill="currentColor" />
    </svg>
  );
}
function IconBuilding() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2.5" y="3" width="7" height="10.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M9.5 6.5H13C13.3 6.5 13.5 6.7 13.5 7V13.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4.8 5.8H7.2M4.8 8H7.2M4.8 10.2H7.2M11 9H12M11 11H12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function IconLogout() {
  return (
    <svg width="16" height="16" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <path d="M6.5 14H3.8C3.4 14 3 13.6 3 13.2V3.8C3 3.4 3.4 3 3.8 3H6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10.5 11.5L14 8.5L10.5 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 8.5H6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
