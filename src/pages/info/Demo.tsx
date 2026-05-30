import { PageLayout, Section } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const Demo = () => (
  <PageLayout title="Demo en vivo" subtitle="Mira cómo se ve una carta real de Carta">
    <Section title="Restaurante de ejemplo">
      <p>Hemos preparado un restaurante de demostración con carta, categorías, alérgenos y variantes para que veas el resultado final tal y como lo verían tus clientes.</p>
    </Section>
    <div className="flex flex-wrap gap-3 not-prose">
      <Button asChild>
        <Link to="/r/la-trattoria">
          Abrir carta de demo <ExternalLink className="ml-1 h-4 w-4" strokeWidth={1.5} />
        </Link>
      </Button>
      <Button asChild variant="outline">
        <Link to="/register">Crear la mía gratis</Link>
      </Button>
    </div>
    <Section title="¿Qué incluye la demo?">
      <p>Carta completa con categorías, filtros por alérgenos, variantes de precio, etiquetas dietéticas y flujo de reserva. Todo lo que tendrás disponible desde el primer día.</p>
    </Section>
  </PageLayout>
);

export default Demo;
