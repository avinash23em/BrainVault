export function Logo() {
  return (
    <svg xmlns="http://w3.org" viewBox="0 0 32 32" fill="none" className="size-8">
      {/* Simplified Brain Shape */}
      <path 
        d="M16 6C11 6 7 9 7 13C7 16 9 18 11 19V22H21V19C23 18 25 16 25 13C25 9 21 6 16 6Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinejoin="round"
      />
      {/* The "Vault" Base */}
      <rect x="10" y="22" width="12" height="6" rx="1" fill="currentColor" />
      {/* Central Node/Lock */}
      <circle cx="16" cy="13" r="2" fill="currentColor" />
    </svg>
  );
}
