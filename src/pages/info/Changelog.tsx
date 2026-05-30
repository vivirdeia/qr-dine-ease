import { PageLayout } from "@/components/PageLayout";

const entries = [
  {
    version: "1.2.0",
    date: "30 mayo 2026",
    items: [
      "Nuevo: alérgenos oficiales (14) y etiquetas dietéticas en cada plato",
      "Nuevo: variantes de precio por plato",
      "Nuevo: compartir carta por WhatsApp y descarga de QR en PNG",
      "Mejora: validación de slugs únicos en el alta",
    ],
  },
  {
    version: "1.1.0",
    date: "15 abril 2026",
    items: [
      "Nuevo: panel de SuperAdmin para gestionar tenants",
      "Mejora: rediseño completo del dashboard",
    ],
  },
  {
    version: "1.0.0",
    date: "1 marzo 2026",
    items: ["Lanzamiento público de Carta"],
  },
];

const Changelog = () => (
  <PageLayout title="Changelog" subtitle="Todo lo que hemos lanzado">
    <div className="space-y-10 not-prose">
      {entries.map((e) => (
        <div key={e.version} className="border-l-2 border-border pl-6 space-y-3">
          <div className="flex items-baseline gap-3">
            <h3 className="text-lg font-semibold">v{e.version}</h3>
            <span className="text-xs text-muted-foreground">{e.date}</span>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {e.items.map((i, idx) => (
              <li key={idx}>· {i}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </PageLayout>
);

export default Changelog;
