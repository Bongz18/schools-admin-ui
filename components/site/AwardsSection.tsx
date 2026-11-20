import type { SchoolAward } from "@/lib/schools";

// A brass laurel wreath: two branches curving up around the centre, each a thin stem with
// paired leaves angled outwards and inwards.
const WREATH_R = 46;
const WREATH_TILT = 35;

function polar(deg: number, r: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: 60 + r * Math.cos(rad), y: 60 + r * Math.sin(rad) };
}

function LaurelWreath({ className = "" }: { className?: string }) {
  // Leaves for the left branch (angles in SVG space, 90 = bottom, 180 = left); the right is mirrored.
  const leaves: { x: number; y: number; angle: number }[] = [];
  for (let i = 0; i < 8; i++) {
    const t = 118 + i * (120 / 7);
    const outer = polar(t, WREATH_R + 5);
    const inner = polar(t + 4, WREATH_R - 5);
    leaves.push({ ...outer, angle: t + WREATH_TILT });
    leaves.push({ ...inner, angle: t + 4 - WREATH_TILT });
  }
  const a = polar(100, WREATH_R);
  const b = polar(242, WREATH_R);
  const f = (n: number) => n.toFixed(2);

  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="laurel-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ecd7a6" />
          <stop offset="55%" stopColor="#c9a464" />
          <stop offset="100%" stopColor="#8f6d38" />
        </linearGradient>
      </defs>
      <g fill="url(#laurel-gold)">
        {leaves.map((leaf, i) => (
          <g key={i}>
            <ellipse cx={f(leaf.x)} cy={f(leaf.y)} rx="2.9" ry="7.4" transform={`rotate(${leaf.angle.toFixed(1)} ${f(leaf.x)} ${f(leaf.y)})`} />
            <ellipse
              cx={f(120 - leaf.x)}
              cy={f(leaf.y)}
              rx="2.9"
              ry="7.4"
              transform={`rotate(${(-leaf.angle).toFixed(1)} ${f(120 - leaf.x)} ${f(leaf.y)})`}
            />
          </g>
        ))}
      </g>
      <g fill="none" stroke="url(#laurel-gold)" strokeWidth="1.2" strokeLinecap="round">
        <path d={`M${f(a.x)} ${f(a.y)} A${WREATH_R} ${WREATH_R} 0 0 1 ${f(b.x)} ${f(b.y)}`} />
        <path d={`M${f(120 - a.x)} ${f(a.y)} A${WREATH_R} ${WREATH_R} 0 0 0 ${f(120 - b.x)} ${f(b.y)}`} />
      </g>
    </svg>
  );
}

const goldText = "bg-gradient-to-b from-[#f1dfb5] via-[#d1ad6c] to-[#9c7840] bg-clip-text text-transparent";

// Awards and recognition: a deep evergreen panel with a fine brass frame. Each award is a
// laurel-wreathed medallion with the number in gold Caslon, the award name and the year.
export default function AwardsSection({ awards }: { awards: SchoolAward[] }) {
  if (!awards.length) return null;
  const single = awards.length === 1;

  return (
    <section
      aria-labelledby="awards"
      className="relative overflow-hidden rounded-2xl bg-leaf-dark px-7 py-9 sm:px-10 sm:py-11"
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-[7px] rounded-[0.95rem] border border-brass/30" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(201,164,100,0.18),transparent_65%)]"
      />

      <div className="relative">
        <p className="text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-brass">Awards and recognition</p>
        <h2 id="awards" className="sr-only">Awards and recognition</h2>

        <ul className={`mt-7 grid gap-8 ${single ? "" : "sm:grid-cols-2"}`}>
          {awards.map((award, index) => (
            <li
              key={index}
              className={`flex items-center gap-6 ${single ? "flex-col text-center sm:flex-row sm:text-left sm:gap-9" : ""}`}
            >
              <div className={`relative shrink-0 ${single ? "h-36 w-36 sm:h-40 sm:w-40" : "h-28 w-28"}`}>
                <LaurelWreath className="absolute inset-0 h-full w-full" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {award.count != null ? (
                    <span className={`font-display leading-none ${single ? "text-[3.6rem] sm:text-[4.2rem]" : "text-[2.8rem]"} ${goldText}`}>
                      {award.count}
                    </span>
                  ) : (
                    <span className="h-3 w-3 rotate-45 bg-brass" />
                  )}
                </div>
              </div>
              <div className="min-w-0">
                {award.year && (
                  <p className="font-display text-[1.05rem] italic tracking-wide text-brass">{award.year}</p>
                )}
                <p className={`font-display leading-[1.12] text-white ${single ? "text-[1.9rem] sm:text-[2.3rem]" : "text-[1.4rem]"}`}>
                  {award.title}
                </p>
                <span aria-hidden="true" className={`mt-4 block h-px w-12 bg-brass/70 ${single ? "mx-auto sm:mx-0" : ""}`} />
                {award.note && <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-white/70">{award.note}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
