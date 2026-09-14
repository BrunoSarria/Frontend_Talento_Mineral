interface AvatarProps {
  name?: string;
  photoUrl?: string;
  size?: "sm" | "md" | "lg";
  locked?: boolean;
}

const SIZE_CLASSES = {
  sm: "h-9 w-9 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-16 w-16 text-base",
};

function initials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function Avatar({ name, photoUrl, size = "md", locked }: AvatarProps) {
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-primary-soft)] font-semibold text-[var(--color-primary)] ${SIZE_CLASSES[size]}`}
      aria-hidden="true"
    >
      {photoUrl ? <img src={photoUrl} alt="" className="h-full w-full object-cover" /> : <span>{locked ? "🔒" : initials(name)}</span>}
    </div>
  );
}
