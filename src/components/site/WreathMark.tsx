import type { SVGProps } from "react";

/* An olive/sage wreath encircling initials — matches the White & Wick logo motif.
 * Kept as pure SVG so it scales crisply and inherits currentColor for tinting. */

type P = SVGProps<SVGSVGElement> & { withText?: boolean; withTagline?: boolean };

const OLIVE = "#8fa070";
const OLIVE_DARK = "#6b7745";
const GOLD = "#b8985d";
const INK = "#3d2e1c";
const CREAM = "#f6ecd5";

const n = (v: number) => Number(v.toFixed(3));

/* A single small leaf (used many times around the ring). */
function Leaf({ cx, cy, r, angle, tone }: { cx: number; cy: number; r: number; angle: number; tone: "light" | "dark" }) {
  const x = n(cx);
  const y = n(cy);
  const a = n(angle);
  return (
    <ellipse
      cx={x}
      cy={y}
      rx={n(r)}
      ry={n(r * 0.42)}
      fill={tone === "light" ? OLIVE : OLIVE_DARK}
      transform={`rotate(${a} ${x} ${y})`}
    />
  );
}

/* Ring of leaves — count controls density. */
function LeafRing({
  cx,
  cy,
  radius,
  count,
  leafSize,
  swing,
}: {
  cx: number;
  cy: number;
  radius: number;
  count: number;
  leafSize: number;
  swing: number;
}) {
  const leaves = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    // Skip top gap where text sits
    const topGap = Math.PI * 0.24;
    if (t < Math.PI / 2 + topGap && t > Math.PI / 2 - topGap) continue;
    if (t < -Math.PI / 2 + topGap + Math.PI * 2 && t > -Math.PI / 2 - topGap + Math.PI * 2) continue;
    const x = n(cx + Math.cos(t) * radius);
    const y = n(cy + Math.sin(t) * radius);
    // Tangent angle so leaf sits along ring
    const tangent = n((t * 180) / Math.PI + 90 + (i % 2 === 0 ? swing : -swing));
    leaves.push(<Leaf key={i} cx={x} cy={y} r={leafSize} angle={tangent} tone={i % 2 === 0 ? "light" : "dark"} />);
  }
  return <g>{leaves}</g>;
}

export function WreathMark({ withText, withTagline, ...props }: P) {
  // Non-text mark auto-fits — text version uses wider viewBox.
  if (!withText) {
    return (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="50" cy="50" r="46" fill={CREAM} />
        <circle cx="50" cy="50" r="46" stroke={GOLD} strokeWidth="0.8" fill="none" opacity="0.7" />
        <LeafRing cx={50} cy={50} radius={36} count={26} leafSize={7} swing={12} />
        <LeafRing cx={50} cy={50} radius={30} count={20} leafSize={5.5} swing={-14} />
        {/* Center initial */}
        <text
          x="50"
          y="55"
          textAnchor="middle"
          fontFamily="Georgia, 'Cormorant Garamond', serif"
          fontSize="26"
          fontStyle="italic"
          fill={INK}
        >
          W
        </text>
      </svg>
    );
  }

  /* Full logo — wreath around "White & Wick" wordmark, gold arc, optional Handcrafted script. */
  return (
    <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Cream disc */}
      <circle cx="130" cy="120" r="112" fill={CREAM} />
      {/* Gold circle accent */}
      <circle cx="130" cy="120" r="112" stroke={GOLD} strokeWidth="1.2" fill="none" opacity="0.75" />
      {/* Wreath foliage — dense */}
      <LeafRing cx={130} cy={120} radius={92} count={40} leafSize={10} swing={15} />
      <LeafRing cx={130} cy={120} radius={82} count={32} leafSize={8} swing={-18} />
      <LeafRing cx={130} cy={120} radius={72} count={26} leafSize={6.5} swing={22} />
      {/* Small berry accents */}
      <circle cx="60" cy="120" r="2.5" fill={GOLD} />
      <circle cx="200" cy="120" r="2.5" fill={GOLD} />
      <circle cx="66" cy="150" r="2" fill={GOLD} />
      <circle cx="194" cy="150" r="2" fill={GOLD} />

      {/* Wordmark */}
      <text
        x="130"
        y="115"
        textAnchor="middle"
        fontFamily="Georgia, 'Cormorant Garamond', serif"
        fontSize="26"
        fill={INK}
        letterSpacing="1"
      >
        White
      </text>
      {/* Ornamental ampersand with underline arc */}
      <path
        d="M100 128 Q130 138 160 128"
        stroke={GOLD}
        strokeWidth="1"
        fill="none"
      />
      <text
        x="130"
        y="140"
        textAnchor="middle"
        fontFamily="Georgia, 'Cormorant Garamond', serif"
        fontSize="22"
        fontStyle="italic"
        fill={GOLD}
      >
        &amp;
      </text>
      <path
        d="M100 148 Q130 158 160 148"
        stroke={GOLD}
        strokeWidth="1"
        fill="none"
      />
      <text
        x="130"
        y="168"
        textAnchor="middle"
        fontFamily="Georgia, 'Cormorant Garamond', serif"
        fontSize="26"
        fill={INK}
        letterSpacing="1"
      >
        Wick
      </text>

      {withTagline && (
        <text
          x="130"
          y="242"
          textAnchor="middle"
          fontFamily="'Cormorant Garamond', 'Brush Script MT', cursive"
          fontStyle="italic"
          fontSize="22"
          fill={INK}
        >
          Handcrafted
        </text>
      )}
    </svg>
  );
}
