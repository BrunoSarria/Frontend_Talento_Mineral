interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = "Carregando..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center" role="status" aria-live="polite">
      <span
        className="h-7 w-7 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent"
        aria-hidden="true"
      />
      <p className="text-sm text-[var(--color-text-secondary)]">{label}</p>
    </div>
  );
}
