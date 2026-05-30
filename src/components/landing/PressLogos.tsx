const logos = ["El País", "Hosteltur", "Metrópoli", "Diario Gastronómico", "Restauradores", "Forbes ES", "Cinco Días"];

export const PressLogos = () => (
  <section className="py-12 border-y border-border overflow-hidden">
    <div className="container">
      <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-6">
        Aparecido en
      </p>
      <div className="relative">
        <div className="flex gap-16 animate-marquee whitespace-nowrap">
          {[...logos, ...logos].map((logo, i) => (
            <span
              key={i}
              className="font-serif text-2xl text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);
