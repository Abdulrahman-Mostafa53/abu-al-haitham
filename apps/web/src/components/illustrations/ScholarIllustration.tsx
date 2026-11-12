export default function ScholarIllustration({ className = "" }: { className?: string }) {
  const arch = "M30 520V300A340 340 0 0 1 200 6A340 340 0 0 1 370 300V520Z";
  return (
    <svg
      className={className}
      viewBox="0 0 400 520"
      role="img"
      aria-label="Illustration of a scholar reading beneath the night sky, in homage to Ibn al-Haytham"
    >
      <defs>
        <linearGradient id="sc-sk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#052b38" />
          <stop offset=".6" stopColor="#0d7480" />
          <stop offset="1" stopColor="#e5b94f" />
        </linearGradient>
        <linearGradient id="sc-bm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3c4" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff3c4" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="sc-glow">
          <stop offset="0" stopColor="#ffe9a3" stopOpacity=".8" />
          <stop offset="1" stopColor="#ffe9a3" stopOpacity="0" />
        </radialGradient>
        <clipPath id="sc-clip">
          <path d={arch} />
        </clipPath>
        <mask id="sc-moon-cut">
          <rect width="400" height="520" fill="#fff" />
          <circle cx="286" cy="118" r="28" fill="#000" />
        </mask>
      </defs>

      <path d={arch} fill="url(#sc-sk)" />

      <g clipPath="url(#sc-clip)">
        <g fill="#fff6d8">
          <circle cx="110" cy="130" r="1.8" />
          <circle cx="150" cy="80" r="1.4" />
          <circle cx="205" cy="70" r="2" />
          <circle cx="175" cy="150" r="1.3" />
          <circle cx="95" cy="215" r="1.4" />
          <circle cx="325" cy="215" r="1.6" />
          <circle cx="238" cy="185" r="1.2" />
          <circle cx="135" cy="260" r="1.2" />
        </g>
        <circle cx="268" cy="128" r="34" fill="#f6e3a8" mask="url(#sc-moon-cut)" />
        <polygon points="268,128 120,520 285,520" fill="url(#sc-bm)" />
        <circle cx="200" cy="412" r="64" fill="url(#sc-glow)" />
        <path d="M148 520C146 440 150 372 200 346C250 372 254 440 252 520Z" fill="#052b36" />
        <circle cx="200" cy="320" r="22" fill="#052b36" />
        <ellipse cx="200" cy="302" rx="31" ry="17" fill="#052b36" />
        <ellipse cx="200" cy="291" rx="21" ry="15" fill="#052b36" />
        <path d="M170 304Q200 318 230 304" fill="none" stroke="#e5b94f" strokeWidth="2.5" />
        <path d="M171 404L200 394L229 404V432L200 422L171 432Z" fill="#f4d982" />
        <path d="M200 394V422" stroke="#b98a1c" strokeWidth="1.5" />
        <rect y="506" width="400" height="14" fill="#052b36" />
      </g>

      <path d="M30 520V300A340 340 0 0 1 200 6A340 340 0 0 1 370 300V520" fill="none" stroke="#e5b94f" strokeWidth="3" />
      <path
        d="M48 520V300A304 304 0 0 1 200 37A304 304 0 0 1 352 300V520"
        fill="none"
        stroke="#e5b94f"
        strokeOpacity=".5"
        strokeWidth="1.5"
      />
    </svg>
  );
}
