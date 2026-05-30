import { MapPin, Navigation, ExternalLink } from "lucide-react";

interface LocationMapProps {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

const LocationMap = ({ name, address, lat, lng }: LocationMapProps) => {
  const embedUrl = `https://www.google.com/maps?q=${lat},${lng}&hl=es&z=16&output=embed`;
  const openUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <section className="px-4 mt-10">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-4 w-4 text-primary" />
        <h2 className="text-base font-bold">Cómo llegar</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{address}</p>
      <div className="relative w-full overflow-hidden rounded-2xl border border-border aspect-[4/3] sm:aspect-[16/9] bg-secondary">
        <iframe
          title={`Mapa de ${name}`}
          src={embedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
        />
      </div>
      <div className="flex gap-2 mt-3">
        <a
          href={dirUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium transition-opacity hover:opacity-90"
        >
          <Navigation className="h-4 w-4" /> Cómo llegar
        </a>
        <a
          href={openUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
        >
          <ExternalLink className="h-4 w-4" /> Abrir
        </a>
      </div>
    </section>
  );
};

export default LocationMap;
