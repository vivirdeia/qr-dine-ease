import { PageLayout, Section } from "@/components/PageLayout";

const guides = [
  { title: "Guía rápida: tu primera carta en 10 minutos", desc: "Desde el alta hasta el QR impreso en tu mesa." },
  { title: "Cómo estructurar las categorías de tu carta", desc: "Recomendaciones para una carta clara y vendedora." },
  { title: "Alérgenos: cómo cumplir la normativa", desc: "Los 14 alérgenos oficiales explicados." },
  { title: "Reservas sin comisiones: buenas prácticas", desc: "Cómo gestionar el aforo y reducir no-shows." },
  { title: "Personaliza tu marca", desc: "Logo, colores y tipografía en tu carta pública." },
];

const Guias = () => (
  <PageLayout title="Guías" subtitle="Aprende a sacar el máximo partido a Carta">
    <Section title="Guías destacadas">
      <div className="space-y-4 not-prose">
        {guides.map((g) => (
          <div key={g.title} className="border border-border rounded-lg p-5 hover:border-foreground/20 transition-colors">
            <h3 className="font-semibold mb-1">{g.title}</h3>
            <p className="text-sm text-muted-foreground">{g.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  </PageLayout>
);

export default Guias;
