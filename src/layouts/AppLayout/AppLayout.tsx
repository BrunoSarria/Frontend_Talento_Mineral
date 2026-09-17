import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../../components/layout/Sidebar";
import { Header } from "../../components/layout/Header";

const TITLES: { prefix: string; title: string }[] = [
  { prefix: "/dashboard", title: "Dashboard" },
  { prefix: "/curriculos/comparar", title: "Comparar currículos" },
  { prefix: "/curriculos", title: "Currículos" },
  { prefix: "/vagas", title: "Vagas" },
  { prefix: "/creditos", title: "Créditos" },
  { prefix: "/historico", title: "Histórico" },
  { prefix: "/notificacoes", title: "Notificações" },
  { prefix: "/ajuda", title: "Ajuda" },
  { prefix: "/configuracoes", title: "Configurações" },
];

function resolveTitle(pathname: string): string | undefined {
  return TITLES.find((t) => pathname.startsWith(t.prefix))?.title;
}

export function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const title = resolveTitle(location.pathname);

  return (
    <div className="flex h-screen bg-[var(--color-bg)]">
      {/* Sidebar fixa (desktop) */}
      <aside className="hidden w-60 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] md:block">
        <Sidebar />
      </aside>

      {/* Drawer (mobile) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-[#012742]/50" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
          <div className="absolute inset-y-0 left-0 w-64 bg-[var(--color-surface)] shadow-[var(--shadow-elevated)]">
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setDrawerOpen(true)} title={title} />
        <main className="custom-scroll flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
