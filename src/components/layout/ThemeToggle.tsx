import { Dropdown } from "../ui/Dropdown";
import { useTheme, type ThemePreference } from "../../hooks/useTheme";

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "light", label: "Claro" },
  { value: "dark", label: "Escuro" },
  { value: "system", label: "Sistema" },
];

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <Dropdown
      align="right"
      trigger={
        <span
          className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-sunken)] hover:text-[var(--color-text)]"
          aria-label={`Tema: ${OPTIONS.find((o) => o.value === theme)?.label}`}
        >
          {resolvedTheme === "dark" ? <MoonIcon /> : <SunIcon />}
        </span>
      }
      items={OPTIONS.map((opt) => ({
        label: theme === opt.value ? `✓ ${opt.label}` : opt.label,
        onSelect: () => setTheme(opt.value),
      }))}
    />
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="3.4" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M9 1.8V3.4M9 14.6V16.2M16.2 9H14.6M3.4 9H1.8M14 4L12.9 5.1M5.1 12.9L4 14M14 14L12.9 12.9M5.1 5.1L4 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M15.2 10.8C14.3 11.3 13.2 11.6 12.1 11.6C8.6 11.6 5.8 8.8 5.8 5.3C5.8 4.2 6.1 3.1 6.6 2.2C4 3.2 2.2 5.8 2.2 8.8C2.2 12.7 5.4 15.8 9.2 15.8C12.2 15.8 14.8 14 15.8 11.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
