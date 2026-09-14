interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "h-4 w-full" }: SkeletonProps) {
  return <div className={`animate-pulse rounded-[var(--radius-sm)] bg-[var(--color-surface-sunken)] ${className}`} aria-hidden="true" />;
}
