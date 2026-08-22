export function Newsletter() {
  return (
    <section className="container-page mt-28">
      <div className="rounded-3xl border hairline bg-ivory-50 px-6 py-14 text-center lg:px-16">
        <p className="eyebrow">Slow letters</p>
        <h2 className="mt-3 heading-serif text-editorial">Sign up to hear about new pours first.</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-cocoa-500">
          A short letter every few weeks — new fragrances, gifting ideas, and an occasional early-access discount.
        </p>
        <form className="mx-auto mt-8 flex max-w-md overflow-hidden rounded-full border hairline bg-white">
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="flex-1 bg-transparent px-5 py-3 text-sm placeholder:text-cocoa-400 focus:outline-none"
          />
          <button className="bg-cocoa-700 px-6 py-3 text-xs uppercase tracking-widish text-ivory-50 hover:bg-cocoa-500">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
