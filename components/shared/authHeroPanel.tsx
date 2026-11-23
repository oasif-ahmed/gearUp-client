export default function AuthHeroPanel() {
  return (
    <section className="flex flex-col justify-between gap-10 bg-primary p-8 text-primary-foreground sm:p-12 lg:p-16">
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-primary-foreground/60">
          [ Gear Rental, Simplified ]
        </span>
        <p className="text-xs font-mono text-primary-foreground/60">Gear Up Rental Platform</p>
      </div>

      <div className="max-w-xl space-y-5">
        <h1 className="font-serif text-3xl font-medium leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
          Professional gear for every adventure.
        </h1>
        <p className="font-sans text-sm leading-relaxed text-primary-foreground/80">
          Find the best sports gear without the big price tag. Browse verified equipment, compare
          clear daily rates, and reserve in seconds — so you get quality kit for less and spend more
          time outside.
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-primary-foreground/20 pt-6 text-xs font-mono text-primary-foreground/60">
        <span>EST. 2026</span>
        <span>SECURE AUTHENTICATION</span>
      </div>
    </section>
  );
}
