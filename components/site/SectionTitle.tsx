// Section heading on a school profile: a short brass rule, a large Caslon title and an
// optional one-line description. Pass light for sections on a dark background.
export default function SectionTitle({
  id,
  title,
  lede,
  light = false,
}: {
  id: string;
  title: string;
  lede?: string;
  light?: boolean;
}) {
  return (
    <div>
      <span aria-hidden="true" className="block h-px w-10 bg-brass" />
      <h2
        id={id}
        className={`mt-4 font-display text-[2rem] leading-[1.1] tracking-tight sm:text-[2.35rem] ${light ? "text-white" : "text-ink"}`}
      >
        {title}
      </h2>
      {lede && <p className={`mt-2 max-w-xl text-[0.95rem] ${light ? "text-white/70" : "text-granite"}`}>{lede}</p>}
    </div>
  );
}
