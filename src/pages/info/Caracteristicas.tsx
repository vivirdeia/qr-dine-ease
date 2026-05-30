import { PageLayout, Section } from "@/components/PageLayout";
import { QrCode, Calendar, Smartphone, Languages, BarChart3, Shield } from "lucide-react";

const features = [
  { icon: QrCode, title: "Carta digital con QR", desc: "Tus clientes acceden a tu carta escaneando un único código." },
  { icon: Calendar, title: "Reservas integradas", desc: "Gestiona las reservas desde un único panel, sin comisiones." },
  { icon: Smartphone, title: "100% responsive", desc: "Pensada para móvil, perfecta en cualquier dispositivo." },
  { icon: Languages, title: "Multi-idioma", desc: "Atrae al turista mostrando tu carta en varios idiomas." },
  { icon: BarChart3, title: "Estadísticas", desc: "Conoce los platos más vistos y las horas de mayor demanda." },
  { icon: Shield, title: "Alérgenos y etiquetas", desc: "Los 14 alérgenos oficiales y etiquetas dietéticas." },
];

const Caracteristicas = () => (
  <PageLayout title="Características" subtitle="Todo lo que necesitas para digitalizar tu restaurante">
    <div className="grid sm:grid-cols-2 gap-4 not-prose">
      {features.map((f) => (
        <div key={f.title} className="border border-border rounded-lg p-6 space-y-2 hover:border-foreground/20 transition-colors">
          <f.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
          <h3 className="font-semibold">{f.title}</h3>
          <p className="text-sm text-muted-foreground">{f.desc}</p>
        </div>
      ))}
    </div>
    <Section title="¿Listo para empezar?">
      <p>Crea tu cuenta gratis en menos de 10 minutos. Sin tarjeta, sin compromisos.</p>
    </Section>
  </PageLayout>
);

export default Caracteristicas;
