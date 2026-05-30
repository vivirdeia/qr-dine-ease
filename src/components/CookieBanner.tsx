import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCookieConsent } from "@/hooks/useCookieConsent";

export default function CookieBanner() {
  const { consent, accept, reject } = useCookieConsent();
  if (consent !== null) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4 pointer-events-none">
      <div
        role="dialog"
        aria-live="polite"
        aria-label="Aviso de cookies"
        className="pointer-events-auto mx-auto max-w-3xl bg-card border border-border rounded-lg shadow-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
      >
        <div className="flex-1 text-sm text-foreground">
          <p className="font-medium">Usamos cookies</p>
          <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
            Cookies propias y de terceros para analítica y mejorar tu experiencia. Puedes aceptarlas o rechazarlas.{" "}
            <Link to="/cookies" className="underline underline-offset-2 hover:text-foreground">Más información</Link>.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" variant="outline" onClick={reject}>Rechazar</Button>
          <Button size="sm" onClick={accept}>Aceptar</Button>
          <button
            onClick={reject}
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground"
            aria-label="Cerrar y rechazar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
