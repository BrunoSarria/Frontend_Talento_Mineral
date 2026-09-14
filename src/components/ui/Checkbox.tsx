import { forwardRef, useId, type InputHTMLAttributes } from "react";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ label, id, className = "", ...props }, ref) => {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <div className="flex items-center gap-2">
      <input
        ref={ref}
        id={checkboxId}
        type="checkbox"
        className={`h-4 w-4 shrink-0 rounded border-[var(--color-border-strong)] text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] ${className}`}
        {...props}
      />
      <label htmlFor={checkboxId} className="text-sm text-[var(--color-text)]">
        {label}
      </label>
    </div>
  );
});
Checkbox.displayName = "Checkbox";
