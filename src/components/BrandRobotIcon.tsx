type Props = { className?: string };

/** Small robot silhouette for gradient “cube” marks (login, splash, topbar). */
export function BrandRobotIcon({ className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="16" cy="3.2" r="1.6" fill="currentColor" opacity="0.95" />
      <path
        d="M16 4.8v2.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.95"
      />
      <rect
        x="8.5"
        y="7"
        width="15"
        height="11"
        rx="3"
        fill="currentColor"
        opacity="0.95"
      />
      <circle cx="12.5" cy="12.5" r="1.35" fill="#0a0a10" />
      <circle cx="19.5" cy="12.5" r="1.35" fill="#0a0a10" />
      <rect
        x="6.5"
        y="18.5"
        width="19"
        height="11.5"
        rx="3.5"
        fill="currentColor"
        opacity="0.88"
      />
      <rect x="12" y="22" width="8" height="4.5" rx="1.2" fill="#0a0a10" opacity="0.22" />
      <rect x="9" y="28" width="5" height="3.5" rx="1.2" fill="currentColor" opacity="0.9" />
      <rect x="18" y="28" width="5" height="3.5" rx="1.2" fill="currentColor" opacity="0.9" />
    </svg>
  );
}
