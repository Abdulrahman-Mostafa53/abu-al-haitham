export default function BrandIcon({ size = 54 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id="bi-ic" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#159aa0" />
          <stop offset="1" stopColor="#08425a" />
        </linearGradient>
        <linearGradient id="bi-pg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="1" stopColor="#f1e5c4" />
        </linearGradient>
        <linearGradient id="bi-gg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eac25f" />
          <stop offset="1" stopColor="#e2b048" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="26" fill="url(#bi-ic)" />
      <rect x="5" y="5" width="90" height="90" rx="21" fill="none" stroke="#e7c86e" strokeOpacity=".4" />
      <svg x="24" y="21" width="52" height="58" viewBox="90 90 870 1060">
        <path d="M96 1146V400C96 260 150 190 192 96C234 190 288 260 288 400V1146Z" fill="url(#bi-pg)" />
        <path d="M760 1146V400C760 260 814 190 856 96C898 190 952 260 952 400V1146Z" fill="url(#bi-pg)" />
        <path
          fillRule="evenodd"
          fill="url(#bi-gg)"
          d="M359 900V746A330 330 0 0 1 524 460A330 330 0 0 1 689 746V900ZM425 834H623V746A264 264 0 0 0 524 501A264 264 0 0 0 425 746Z"
        />
        <circle cx="524" cy="692" r="36" fill="url(#bi-gg)" />
      </svg>
    </svg>
  );
}
