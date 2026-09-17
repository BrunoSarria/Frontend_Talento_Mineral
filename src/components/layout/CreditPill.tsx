import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { creditService } from "../../services/creditService";
import { formatNumber } from "../../utils/format";

/**
 * Pílula de saldo persistente no header — visibilidade periférica imediata
 * da cota transacional, em bronze mineral, como define o design system.
 */
export function CreditPill() {
  const [available, setAvailable] = useState<number | null>(null);
  const location = useLocation();

  useEffect(() => {
    let active = true;
    creditService
      .getBalance()
      .then((balance) => {
        if (active) setAvailable(balance.available);
      })
      .catch(() => {
        /* silencioso: o saldo real continua acessível na página de Créditos */
      });
    return () => {
      active = false;
    };
  }, [location.pathname]);

  return (
    <div className="flex items-center gap-2 rounded-full border border-[var(--color-accent-border)] bg-[var(--color-accent-soft)] py-1 pl-3 pr-1">
      <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-accent)]">
        <CoinIcon />
        <span className="hidden sm:inline">Saldo:</span>
        <span className="tabular">{available === null ? "—" : formatNumber(available)}</span>
        <span className="hidden md:inline">créditos</span>
      </span>
      <Link
        to="/creditos/comprar"
        className="flex h-7 items-center gap-1 rounded-full bg-[var(--color-accent)] px-3 text-[13px] font-semibold text-white transition-[filter] hover:brightness-110 dark:text-[#241708]"
      >
        <span aria-hidden="true">+</span> Comprar
      </Link>
    </div>
  );
}

function CoinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 5.6A3.2 3.2 0 0 0 10 10.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
