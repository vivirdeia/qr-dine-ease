import { PageLayout, Section } from "@/components/PageLayout";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "0€",
    period: "para siempre",
    features: ["Carta digital con QR", "Hasta 50 platos", "1 idioma", "Reservas básicas", "Soporte por email"],
  },
  {
    name: "Pro",
    price: "19€",
    period: "/mes",
    features: ["Todo lo del plan Free", "Platos ilimitados", "Multi-idioma", "Estadísticas avanzadas", "Personalización de marca", "Soporte prioritario"],
    highlight: true,
  },
];

const Pricing = () => (
  <PageLayout title="Precios" subtitle="Sin comisiones por reserva. Sin sorpresas.">
    <div className="grid sm:grid-cols-2 gap-6 not-prose">
      {plans.map((p) => (
        <div key={p.name} className={`border rounded-lg p-8 space-y-5 ${p.highlight ? "border-foreground" : "border-border"}`}>
          <div>
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight">{p.price}</span>
              <span className="text-sm text-muted-foreground">{p.period}</span>
            </div>
          </div>
          <ul className="space-y-2">
            {p.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 mt-0.5 text-primary" strokeWidth={1.5} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Button asChild className="w-full" variant={p.highlight ? "default" : "outline"}>
            <Link to="/register">Empezar</Link>
          </Button>
        </div>
      ))}
    </div>
    <Section title="Preguntas frecuentes">
      <p><strong>¿Cobráis comisiones por reserva?</strong> No. Nunca.</p>
      <p><strong>¿Puedo cambiar de plan?</strong> Sí, en cualquier momento desde tu panel.</p>
      <p><strong>¿Necesito tarjeta para empezar?</strong> No, el plan Free no requiere tarjeta.</p>
    </Section>
  </PageLayout>
);

export default Pricing;
