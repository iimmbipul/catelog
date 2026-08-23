import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

type P = SVGProps<SVGSVGElement>;

const base = "h-[18px] w-[18px]";

/* All icons merge the built-in size class with any className passed in
 * (so callers can add `rotate-180` etc without wiping out the size). */

export function Search({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)} {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
export function User({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)} {...p}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}
export function Heart({ className, filled, ...p }: P & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)} {...p}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  );
}
export function Bag({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)} {...p}>
      <path d="M6 7h12l-1 13H7L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}
export function Menu({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)} {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
export function Close({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)} {...p}>
      <path d="M6 6l12 12M6 18L18 6" />
    </svg>
  );
}
export function Arrow({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)} {...p}>
      <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
    </svg>
  );
}
export function ChevronDown({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)} {...p}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
export function ChevronRight({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)} {...p}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
export function Star({ className, filled, ...p }: P & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={cn("h-3.5 w-3.5", className)} {...p}>
      <path d="m12 3 2.9 5.9L21 10l-4.5 4.4L17.8 21 12 17.8 6.2 21 7.5 14.4 3 10l6.1-1.1L12 3Z" />
    </svg>
  );
}
export function Instagram({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)} {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}
export function Youtube({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)} {...p}>
      <rect x="2.5" y="6" width="19" height="12" rx="3" />
      <path d="M10 9.5v5l4.5-2.5L10 9.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
export function Facebook({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)} {...p}>
      <path d="M14 21v-8h2.5l.5-3h-3V8c0-1 .3-1.6 1.7-1.6H17V3.7A20 20 0 0 0 14.5 3.5C12.3 3.5 11 4.8 11 7v3H8v3h3v8h3Z" />
    </svg>
  );
}
export function Whatsapp({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)} {...p}>
      <path d="M20 12a8 8 0 1 1-3.4-6.5L20 4l-1.4 3.5A8 8 0 0 1 20 12Z" />
      <path d="M8 10c.7 3.2 2.8 5.3 6 6l1.5-1.5-2-1-1.2.6-1.4-1.4.6-1.2-1-2L9 10Z" />
    </svg>
  );
}
export function Truck({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)} {...p}>
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" />
    </svg>
  );
}
export function Flame({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)} {...p}>
      <path d="M12 3s5 4 5 9a5 5 0 1 1-10 0c0-2 1-3 2-4-1 3 1 4 2 4s-1-3 1-6c1-2 0-3 0-3Z" />
    </svg>
  );
}
export function Leaf({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)} {...p}>
      <path d="M5 20c8 0 14-6 14-14 0 0-6 0-10 4S5 20 5 20Z" />
      <path d="M5 20c0-4 4-8 10-10" />
    </svg>
  );
}
export function Gift({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)} {...p}>
      <rect x="3" y="8" width="18" height="12" rx="1" />
      <path d="M12 8v12M3 12h18" />
      <path d="M12 8c-2 0-4-1-4-3a2 2 0 0 1 4 0c0 2-2 3-4 3" />
      <path d="M12 8c2 0 4-1 4-3a2 2 0 0 0-4 0c0 2 2 3 4 3" />
    </svg>
  );
}
export function Package({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)} {...p}>
      <path d="M3 7 12 3l9 4v10l-9 4-9-4V7Z" />
      <path d="M3 7 12 11l9-4M12 11v10" />
    </svg>
  );
}
export function Sparkle({ className, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)} {...p}>
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l3 3M15 15l3 3M6 18l3-3M15 9l3-3" />
    </svg>
  );
}
