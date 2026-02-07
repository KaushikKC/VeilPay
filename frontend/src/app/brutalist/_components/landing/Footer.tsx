export function Footer() {
  return (
    <footer className="border-t-4 border-black px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <span className="text-lg font-black uppercase tracking-widest">
          VEILPAY
        </span>
        <p className="text-sm text-black/40">
          &copy; {new Date().getFullYear()} VeilPay. Privacy is a right, not a
          feature.
        </p>
        <div className="flex gap-6">
          <a
            href="#"
            className="text-sm font-bold uppercase text-black/40 transition-colors hover:text-black"
          >
            GitHub
          </a>
          <a
            href="#"
            className="text-sm font-bold uppercase text-black/40 transition-colors hover:text-black"
          >
            Docs
          </a>
          <a
            href="#"
            className="text-sm font-bold uppercase text-black/40 transition-colors hover:text-black"
          >
            Twitter
          </a>
        </div>
      </div>
    </footer>
  );
}
