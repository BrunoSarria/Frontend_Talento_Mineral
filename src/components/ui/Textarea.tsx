import { forwardRef, useId, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, className = "", required, rows = 4, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-[var(--color-text)]">
            {label} {required && <span className="text-[var(--color-error)]">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          required={required}
          rows={rows}
          aria-invalid={Boolean(error) || undefined}
          className={`resize-y rounded-[var(--radius-sm)] border bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] disabled:bg-[var(--color-surface-sunken)] ${
            error ? "border-[var(--color-error)]" : "border-[var(--color-border-strong)]"
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs text-[var(--color-error)]">{error}</p>
        ) : hint ? (
          <p className="text-xs text-[var(--color-text-secondary)]">{hint}</p>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
