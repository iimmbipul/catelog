/* Hand-illustrated SVG accents for the White & Wick storefront.
 * All parts are inline SVG — no external assets, dark-mode-safe by using absolute colors. */

import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

/* Palette — warm, illustrated florist mood */
const C = {
  leaf: "#8ea068",
  leafDark: "#5f7245",
  stem: "#6b7c4d",
  petalRose: "#e07b62",
  petalCoral: "#eb9078",
  petalMustard: "#e6b846",
  petalPink: "#f2b8ac",
  petalCream: "#f5e4c8",
  pot: "#c88568",
  potShadow: "#9c5f45",
  cream: "#f5e4c8",
  ink: "#3a2f24",
};

/* Hanging plant vine — used top-left / top-right of hero. */
export function HangingVine(props: P) {
  return (
    <svg viewBox="0 0 220 320" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* String */}
      <path d="M110 0 V45" stroke={C.ink} strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      {/* Pot */}
      <path
        d="M70 45 h80 l-8 26 c-1 4 -4 6 -9 6 h-46 c-5 0 -8 -2 -9 -6 z"
        fill={C.pot}
      />
      <ellipse cx="110" cy="45" rx="40" ry="6" fill={C.potShadow} />
      {/* Hanging strings */}
      <path d="M75 46 Q85 20 110 8" stroke={C.ink} strokeWidth="0.9" opacity="0.35" />
      <path d="M145 46 Q135 20 110 8" stroke={C.ink} strokeWidth="0.9" opacity="0.35" />
      {/* Vines */}
      <VineBranch startX={90} startY={72} dx={-30} length={200} side="left" />
      <VineBranch startX={110} startY={72} dx={0} length={230} side="center" />
      <VineBranch startX={130} startY={72} dx={30} length={190} side="right" />
    </svg>
  );
}

function VineBranch({
  startX,
  startY,
  dx,
  length,
  side,
}: {
  startX: number;
  startY: number;
  dx: number;
  length: number;
  side: "left" | "right" | "center";
}) {
  const endX = startX + dx;
  const endY = startY + length;
  const cp1x = startX + dx * 0.4;
  const cp1y = startY + length * 0.4;
  const path = `M${startX} ${startY} Q${cp1x} ${cp1y} ${endX} ${endY}`;
  const steps = 8;
  const leaves = [];
  for (let i = 1; i <= steps; i++) {
    const t = i / (steps + 1);
    const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * cp1x + t * t * endX;
    const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * cp1y + t * t * endY;
    const flip = side === "left" ? -1 : side === "right" ? 1 : i % 2 === 0 ? 1 : -1;
    leaves.push(
      <ellipse
        key={i}
        cx={x + flip * 8}
        cy={y}
        rx="10"
        ry="5"
        fill={i % 2 === 0 ? C.leaf : C.leafDark}
        transform={`rotate(${flip * 30 + i * 6} ${x + flip * 8} ${y})`}
      />,
    );
  }
  return (
    <g>
      <path d={path} stroke={C.stem} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {leaves}
    </g>
  );
}

/* Cluster of tulips — used at hero bottom corners */
export function TulipCluster(props: P) {
  return (
    <svg viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Tulip x={40} y={90} color={C.petalRose} height={80} />
      <Tulip x={80} y={70} color={C.petalMustard} height={100} />
      <Tulip x={120} y={80} color={C.petalCoral} height={90} />
      <Tulip x={160} y={95} color={C.petalPink} height={75} />
      {/* Ground leaves */}
      <path
        d="M20 175 Q60 160 100 172 Q140 158 180 172 Q200 172 210 175"
        stroke={C.leafDark}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="55" cy="170" rx="12" ry="4" fill={C.leaf} />
      <ellipse cx="150" cy="170" rx="14" ry="4" fill={C.leaf} />
    </svg>
  );
}

function Tulip({
  x,
  y,
  color,
  height,
}: {
  x: number;
  y: number;
  color: string;
  height: number;
}) {
  const stemBottom = 175;
  return (
    <g>
      <path d={`M${x} ${y + 10} Q${x - 2} ${(y + stemBottom) / 2} ${x} ${stemBottom}`} stroke={C.stem} strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Leaf */}
      <path
        d={`M${x} ${y + 40} Q${x - 24} ${y + 55} ${x - 4} ${y + 90}`}
        fill={C.leaf}
        stroke={C.leafDark}
        strokeWidth="0.6"
      />
      {/* Flower cup */}
      <path
        d={`M${x - 12} ${y + 12} Q${x - 12} ${y - height / 6} ${x} ${y - height / 8} Q${x + 12} ${y - height / 6} ${x + 12} ${y + 12} Q${x} ${y + 20} ${x - 12} ${y + 12} Z`}
        fill={color}
        stroke={C.leafDark}
        strokeWidth="0.6"
      />
      {/* Highlight */}
      <path
        d={`M${x - 8} ${y - 2} Q${x - 4} ${y - height / 8 + 4} ${x} ${y - 2}`}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.2"
        fill="none"
      />
    </g>
  );
}

/* Small floral sprig — used between sections as a decorative divider */
export function FloralSprig(props: P) {
  return (
    <svg viewBox="0 0 140 60" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M20 30 Q45 20 70 30 Q95 40 120 30" stroke={C.stem} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="26" r="7" fill={C.petalRose} />
      <circle cx="30" cy="26" r="3" fill={C.petalMustard} />
      <ellipse cx="45" cy="34" rx="8" ry="4" fill={C.leaf} transform="rotate(-15 45 34)" />
      <circle cx="70" cy="30" r="6" fill={C.petalMustard} />
      <circle cx="70" cy="30" r="2.5" fill={C.petalCoral} />
      <ellipse cx="95" cy="34" rx="8" ry="4" fill={C.leafDark} transform="rotate(15 95 34)" />
      <circle cx="110" cy="26" r="7" fill={C.petalCoral} />
      <circle cx="110" cy="26" r="3" fill={C.petalCream} />
    </svg>
  );
}

/* Simple leaf branch used as background accents */
export function LeafBranch(props: P) {
  return (
    <svg viewBox="0 0 240 120" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10 100 Q120 40 230 20" stroke={C.stem} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {Array.from({ length: 7 }).map((_, i) => {
        const t = (i + 1) / 8;
        const x = 10 + t * 220;
        const y = 100 - Math.pow(t, 0.8) * 80;
        const flip = i % 2 === 0 ? 1 : -1;
        return (
          <ellipse
            key={i}
            cx={x + flip * 10}
            cy={y - 4}
            rx="14"
            ry="6"
            fill={i % 2 === 0 ? C.leaf : C.leafDark}
            transform={`rotate(${flip * 25} ${x + flip * 10} ${y - 4})`}
          />
        );
      })}
    </svg>
  );
}

/* Bee dot — playful little accent */
export function Bee(props: P) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6 10 Q12 4 20 8" stroke={C.ink} strokeWidth="1" fill="none" opacity="0.5" strokeDasharray="1 3" />
      <ellipse cx="24" cy="20" rx="9" ry="7" fill={C.petalMustard} />
      <path d="M18 15 Q19 25 20 27" stroke={C.ink} strokeWidth="1" />
      <path d="M23 14 Q24 25 25 27" stroke={C.ink} strokeWidth="1" />
      <ellipse cx="19" cy="17" rx="6" ry="4" fill="rgba(255,255,255,0.6)" />
      <ellipse cx="26" cy="16" rx="5" ry="4" fill="rgba(255,255,255,0.6)" />
      <circle cx="30" cy="20" r="1" fill={C.ink} />
    </svg>
  );
}

/* Blob background — soft cream shapes to break up whitespace */
export function SoftBlob({ variant = "warm", ...props }: P & { variant?: "warm" | "sage" | "peach" }) {
  const fill = variant === "sage" ? "#dde2d3" : variant === "peach" ? "#f6e0d5" : "#f6efe0";
  return (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M200 20 C300 40 380 120 370 220 C360 320 260 380 170 370 C80 360 20 280 30 190 C40 100 100 0 200 20 Z"
        fill={fill}
      />
    </svg>
  );
}

/* Small sparkle */
export function TinySparkle(props: P) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10 2 L11 8 L17 10 L11 12 L10 18 L9 12 L3 10 L9 8 Z" fill={C.petalMustard} />
    </svg>
  );
}

/* Illustrated hero — a warm scene of a lit candle surrounded by florals.
 * Fully self-contained SVG, no external assets. */
export function CandleHeroScene(props: P) {
  return (
    <svg
      viewBox="0 0 500 620"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      {...props}
    >
      <defs>
        <radialGradient id="ww-glow" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#fff2c8" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#f6e0d5" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f6e0d5" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ww-jar" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#c88568" />
          <stop offset="60%" stopColor="#a35a3d" />
          <stop offset="100%" stopColor="#7a3d24" />
        </linearGradient>
        <linearGradient id="ww-jar-hi" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="30%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id="ww-wax" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#f5e4c8" />
          <stop offset="100%" stopColor="#e6b846" />
        </linearGradient>
        <linearGradient id="ww-flame" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#fff2c8" />
          <stop offset="60%" stopColor="#e6b846" />
          <stop offset="100%" stopColor="#e07b62" />
        </linearGradient>
      </defs>

      {/* Warm background wash */}
      <rect x="0" y="0" width="500" height="620" fill="#f7ecdc" />

      {/* Soft ambient glow behind the candle */}
      <ellipse cx="250" cy="240" rx="220" ry="200" fill="url(#ww-glow)" />

      {/* Sky arc / window motif top */}
      <path d="M60 40 Q250 -30 440 40 L440 90 L60 90 Z" fill="#e6ddc8" opacity="0.5" />
      <path d="M60 90 L440 90" stroke="#c88568" strokeWidth="1" opacity="0.5" />

      {/* Left hanging vine */}
      <g transform="translate(20 0)">
        <path d="M40 0 V26" stroke="#3a2f24" strokeWidth="1" opacity="0.4" />
        <ellipse cx="40" cy="30" rx="20" ry="4" fill="#9c5f45" />
        <path d="M20 32 h40 l-4 20 c-1 3 -3 4 -6 4 h-20 c-3 0 -5 -1 -6 -4 z" fill="#c88568" />
        <path d="M28 60 Q22 100 44 150 Q60 210 40 300" stroke="#6b7c4d" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        {Array.from({ length: 10 }).map((_, i) => {
          const y = 70 + i * 24;
          const x = 34 + Math.sin(i * 1.3) * 14;
          const flip = i % 2 === 0 ? -1 : 1;
          return (
            <ellipse
              key={i}
              cx={x + flip * 10}
              cy={y}
              rx="11"
              ry="5"
              fill={i % 2 === 0 ? "#8ea068" : "#5f7245"}
              transform={`rotate(${flip * 32 + i * 4} ${x + flip * 10} ${y})`}
            />
          );
        })}
      </g>

      {/* Right hanging vine (mirrored variation) */}
      <g transform="translate(480 0) scale(-1 1)">
        <path d="M40 0 V26" stroke="#3a2f24" strokeWidth="1" opacity="0.4" />
        <ellipse cx="40" cy="30" rx="20" ry="4" fill="#9c5f45" />
        <path d="M20 32 h40 l-4 20 c-1 3 -3 4 -6 4 h-20 c-3 0 -5 -1 -6 -4 z" fill="#c88568" />
        <path d="M28 60 Q22 120 44 190 Q60 240 40 340" stroke="#6b7c4d" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        {Array.from({ length: 12 }).map((_, i) => {
          const y = 70 + i * 24;
          const x = 34 + Math.sin(i * 1.1) * 14;
          const flip = i % 2 === 0 ? -1 : 1;
          return (
            <ellipse
              key={i}
              cx={x + flip * 10}
              cy={y}
              rx="11"
              ry="5"
              fill={i % 2 === 0 ? "#8ea068" : "#5f7245"}
              transform={`rotate(${flip * 32 + i * 4} ${x + flip * 10} ${y})`}
            />
          );
        })}
      </g>

      {/* Table / shelf line */}
      <path d="M40 470 Q250 452 460 470 L460 476 L40 476 Z" fill="#e6ddc8" />
      <path d="M40 476 L460 476" stroke="#9c5f45" strokeWidth="1.2" opacity="0.5" />

      {/* Central candle in amber jar */}
      <g transform="translate(180 250)">
        {/* Flame glow */}
        <ellipse cx="70" cy="10" rx="55" ry="55" fill="#fff2c8" opacity="0.55" />
        <ellipse cx="70" cy="12" rx="30" ry="30" fill="#fff2c8" opacity="0.85" />
        {/* Wick */}
        <rect x="68" y="30" width="4" height="18" fill="#3a2f24" rx="1" />
        {/* Flame */}
        <path
          d="M70 -6 Q56 20 62 42 Q70 52 78 42 Q84 20 70 -6 Z"
          fill="url(#ww-flame)"
        />
        <path d="M70 12 Q65 26 68 38 Q70 42 72 38 Q75 26 70 12 Z" fill="#fff5d0" opacity="0.85" />
        {/* Jar */}
        <path d="M20 60 h100 v130 c0 12 -8 20 -22 20 h-56 c-14 0 -22 -8 -22 -20 z" fill="url(#ww-jar)" />
        <path d="M20 60 h100 v130 c0 12 -8 20 -22 20 h-56 c-14 0 -22 -8 -22 -20 z" fill="url(#ww-jar-hi)" opacity="0.5" />
        {/* Jar rim */}
        <ellipse cx="70" cy="60" rx="50" ry="8" fill="#7a3d24" />
        <ellipse cx="70" cy="58" rx="45" ry="5" fill="url(#ww-wax)" />
        {/* Label */}
        <rect x="42" y="120" width="56" height="42" rx="4" fill="#f5e4c8" />
        <text x="70" y="140" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="14" fill="#3a2f24">
          White
        </text>
        <text x="70" y="156" textAnchor="middle" fontFamily="Georgia, serif" fontSize="10" letterSpacing="2" fill="#5b4a37">
          &amp; WICK
        </text>
      </g>

      {/* Left bouquet on the table */}
      <g transform="translate(80 380)">
        {/* Vase */}
        <path d="M10 60 h30 l-2 40 c0 4 -3 6 -6 6 h-14 c-3 0 -6 -2 -6 -6 z" fill="#dcc59a" />
        {/* Flowers */}
        <path d="M25 60 V25" stroke="#6b7c4d" strokeWidth="1.5" />
        <path d="M18 60 Q12 40 20 20" stroke="#6b7c4d" strokeWidth="1.5" fill="none" />
        <path d="M32 60 Q38 40 30 20" stroke="#6b7c4d" strokeWidth="1.5" fill="none" />
        <circle cx="20" cy="18" r="9" fill="#e07b62" />
        <circle cx="20" cy="18" r="4" fill="#e6b846" />
        <circle cx="30" cy="18" r="9" fill="#eb9078" />
        <circle cx="30" cy="18" r="4" fill="#f5e4c8" />
        <circle cx="25" cy="8" r="9" fill="#e6b846" />
        <circle cx="25" cy="8" r="4" fill="#e07b62" />
        {/* Leaves */}
        <ellipse cx="8" cy="34" rx="10" ry="4" fill="#8ea068" transform="rotate(-30 8 34)" />
        <ellipse cx="42" cy="34" rx="10" ry="4" fill="#5f7245" transform="rotate(30 42 34)" />
      </g>

      {/* Right small potted plant */}
      <g transform="translate(360 400)">
        <path d="M8 40 h44 l-4 26 c-1 4 -4 6 -8 6 h-20 c-4 0 -7 -2 -8 -6 z" fill="#c88568" />
        {/* Leaves */}
        <path d="M30 40 V6" stroke="#6b7c4d" strokeWidth="1.5" />
        <ellipse cx="18" cy="20" rx="14" ry="6" fill="#8ea068" transform="rotate(-40 18 20)" />
        <ellipse cx="42" cy="20" rx="14" ry="6" fill="#5f7245" transform="rotate(40 42 20)" />
        <ellipse cx="30" cy="4" rx="12" ry="5" fill="#8ea068" />
      </g>

      {/* Ground florals in front of candle */}
      <g transform="translate(180 460)">
        <path d="M20 20 Q60 10 100 20 Q120 24 140 18" stroke="#5f7245" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <circle cx="28" cy="16" r="6" fill="#e07b62" />
        <circle cx="28" cy="16" r="2.5" fill="#e6b846" />
        <ellipse cx="55" cy="20" rx="8" ry="3" fill="#8ea068" transform="rotate(-10 55 20)" />
        <circle cx="82" cy="14" r="6" fill="#f2b8ac" />
        <circle cx="82" cy="14" r="2.5" fill="#e07b62" />
        <ellipse cx="110" cy="20" rx="8" ry="3" fill="#5f7245" transform="rotate(10 110 20)" />
        <circle cx="132" cy="14" r="6" fill="#e6b846" />
        <circle cx="132" cy="14" r="2.5" fill="#e07b62" />
      </g>

      {/* Little bee */}
      <g transform="translate(340 200)">
        <path d="M4 4 Q10 12 22 8" stroke="#3a2f24" strokeWidth="1" strokeDasharray="1 2" fill="none" opacity="0.6" />
        <ellipse cx="26" cy="10" rx="8" ry="6" fill="#e6b846" />
        <path d="M22 6 Q23 14 24 15" stroke="#3a2f24" strokeWidth="0.8" />
        <path d="M26 6 Q27 14 28 15" stroke="#3a2f24" strokeWidth="0.8" />
        <ellipse cx="22" cy="7" rx="5" ry="3.5" fill="rgba(255,255,255,0.7)" />
        <ellipse cx="28" cy="7" rx="4" ry="3.5" fill="rgba(255,255,255,0.7)" />
      </g>

      {/* Tiny stars */}
      <g fill="#e6b846">
        <path d="M130 140 l1 5 5 1 -5 1 -1 5 -1 -5 -5 -1 5 -1 z" />
        <path d="M400 130 l1 5 5 1 -5 1 -1 5 -1 -5 -5 -1 5 -1 z" />
        <path d="M410 320 l1 5 5 1 -5 1 -1 5 -1 -5 -5 -1 5 -1 z" />
      </g>
    </svg>
  );
}

