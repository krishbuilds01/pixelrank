export default function SectionHead({ no, label, title, sub }: { no: string; label: string; title: string; sub?: string }) {
  return (
    <div className="mb-8">
      <p className="mb-3 font-mono text-[13px] uppercase tracking-widest text-mint">{no} / {label}</p>
      <h2 className="font-pixel text-xl leading-relaxed text-cream sm:text-2xl">{title}</h2>
      {sub ? <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-dim">{sub}</p> : null}
    </div>
  );
}
