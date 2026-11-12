export default function ArchPattern({ className = "" }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true">
      <defs>
        <pattern id="arch-pattern" width="64" height="80" patternUnits="userSpaceOnUse">
          <path
            d="M8 80V44C8 28 24 22 32 6C40 22 56 28 56 44V80"
            fill="none"
            stroke="#e5b94f"
            strokeOpacity=".16"
            strokeWidth="1.5"
          />
          <circle cx="32" cy="46" r="2.5" fill="#e5b94f" fillOpacity=".2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#arch-pattern)" />
    </svg>
  );
}
