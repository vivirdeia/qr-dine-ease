import { FadeIn } from "./FadeIn";

const stats = [
  { value: "+800", label: "Restaurantes activos" },
  { value: "1.2M", label: "Comensales/año" },
  { value: "-35%", label: "Menos no-shows" },
  { value: "0€", label: "Comisiones siempre" },
];

export const TrustBar = () => (
  <section className="py-12 border-y border-border bg-card/40">
    <div className="container">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-border">
        {stats.map((s, i) => (
          <FadeIn key={i} delay={i * 0.05} className="text-center md:px-4">
            <div className="font-serif text-4xl md:text-5xl font-bold text-gradient-primary leading-none">
              {s.value}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);
