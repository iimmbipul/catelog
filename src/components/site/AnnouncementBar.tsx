export function AnnouncementBar({ text }: { text: string }) {
  const items = new Array(6).fill(text);
  return (
    <div className="bg-cocoa-700 text-ivory-50">
      <div className="relative overflow-hidden">
        <div className="flex w-max animate-marquee whitespace-nowrap py-2.5 text-[11px] uppercase tracking-widish">
          {items.concat(items).map((t, i) => (
            <span key={i} className="mx-8 inline-flex items-center gap-8">
              <span>{t}</span>
              <span aria-hidden className="text-ivory-50/40">◇</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
