export default function Scallop() {
  // Piped-buttercream scallop — the brand's signature divider.
  const d = Array.from({ length: 40 }, (_, i) => `Q${i * 30 + 15} 0 ${i * 30 + 30} 26`).join(" ");
  return (
    <div className="scallop" aria-hidden="true">
      <svg width="1200" height="26" viewBox="0 0 1200 26" preserveAspectRatio="none">
        <path d={`M0 26 ${d}`} fill="#F6E3E6" />
      </svg>
    </div>
  );
}
