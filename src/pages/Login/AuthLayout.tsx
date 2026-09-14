import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  quote?: string;
}

export function AuthLayout({ children, quote }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <div className="relative hidden w-[42%] shrink-0 overflow-hidden bg-[var(--color-primary)] lg:flex lg:flex-col lg:justify-between lg:p-10">
        <FacetedRock />
        <div className="relative z-10 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-white/12 text-white">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2L14 5.5L12 13H4L2 5.5L8 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="font-display text-lg font-semibold text-white">Talento Mineral</span>
        </div>

        <div className="relative z-10">
          <p className="max-w-sm font-display text-[26px] font-medium leading-[1.25] text-white">
            Recrutamento feito para quem lida com rocha, não com burocracia.
          </p>
          {quote && <p className="mt-4 max-w-sm text-sm text-white/70">{quote}</p>}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}

function FacetedRock() {
  return (
    <svg
      className="pointer-events-none absolute -right-24 -top-16 opacity-40"
      width="420"
      height="560"
      viewBox="0 0 420 560"
      fill="none"
      aria-hidden="true"
    >
      <polygon points="210,20 340,120 300,260 120,260 80,120" fill="#F2F0EA" opacity="0.12" />
      <polygon points="210,20 340,120 210,180 80,120" fill="#F2F0EA" opacity="0.2" />
      <polygon points="210,180 340,120 300,260 210,260" fill="#F2F0EA" opacity="0.1" />
      <polygon points="120,260 210,260 240,420 90,460 60,320" fill="#F2F0EA" opacity="0.08" />
      <polygon points="210,260 300,260 340,400 240,420" fill="#F2F0EA" opacity="0.14" />
      <polygon points="90,460 240,420 260,540 120,560" fill="#F2F0EA" opacity="0.06" />
    </svg>
  );
}
