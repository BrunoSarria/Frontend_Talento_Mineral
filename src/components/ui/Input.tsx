import { forwardRef, useId, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = "", required, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--color-text-muted)]">
            {label} {required && <span className="text-[var(--color-error)]">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`h-10 rounded-[var(--radius-sm)] border bg-[var(--color-surface)] px-3 text-sm font-medium text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] disabled:bg-[var(--color-surface-sunken)] disabled:text-[var(--color-text-muted)] ${
            error ? "border-[var(--color-error)]" : "border-[var(--color-border-strong)]"
          } ${className}`}
          {...props}
        />
        {error ? (
          <p id={errorId} className="text-xs text-[var(--color-error)]">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="text-xs text-[var(--color-text-secondary)]">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";
