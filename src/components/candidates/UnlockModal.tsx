import { Link } from "react-router-dom";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

interface UnlockModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  balance: number;
  loading?: boolean;
}

export function UnlockModal({ open, onClose, onConfirm, balance, loading }: UnlockModalProps) {
  const hasCredits = balance >= 1;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Desbloquear currículo?"
      footer={
        hasCredits ? (
          <>
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={onConfirm} loading={loading}>
              Confirmar desbloqueio
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Link to="/creditos/comprar">
              <Button variant="primary">Comprar créditos</Button>
            </Link>
          </>
        )
      }
    >
      {hasCredits ? (
        <>
          <p className="text-[var(--color-text-secondary)]">
            Você está prestes a utilizar 1 crédito para acessar os dados completos disponibilizados pelo currículo.
          </p>
          <div className="mt-4 flex items-center justify-between rounded-[var(--radius-sm)] bg-[var(--color-surface-sunken)] px-4 py-3">
            <span className="text-sm text-[var(--color-text-secondary)]">Saldo atual</span>
            <span className="font-medium text-[var(--color-text)]">{balance} créditos</span>
          </div>
          <div className="mt-2 flex items-center justify-between rounded-[var(--radius-sm)] bg-[var(--color-primary-soft)] px-4 py-3">
            <span className="text-sm text-[var(--color-primary)]">Saldo após desbloqueio</span>
            <span className="font-medium text-[var(--color-primary)]">{balance - 1} créditos</span>
          </div>
        </>
      ) : (
        <p className="rounded-[var(--radius-sm)] bg-[var(--color-error-soft)] px-4 py-3 text-[var(--color-error)]">
          Você não possui créditos suficientes.
        </p>
      )}
    </Modal>
  );
}
