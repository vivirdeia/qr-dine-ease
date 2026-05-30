import { CreditCard, MapPin, MessageCircle, Mail, Instagram, Share2 } from "lucide-react";
import { FadeIn, FadeInStagger, FadeInItem } from "./FadeIn";

const integrations = [
  { icon: CreditCard, name: "Stripe", desc: "Pagos online" },
  { icon: MapPin, name: "Google Maps", desc: "Ubicación y reseñas" },
  { icon: MessageCircle, name: "WhatsApp", desc: "Confirmación de reserva" },
  { icon: Share2, name: "TheFork export", desc: "Migra tu carta" },
  { icon: Mail, name: "Mailchimp", desc: "Newsletter del menú" },
  { icon: Instagram, name: "Instagram", desc: "Comparte el QR" },
];

export const Integrations = () => (
  <section className="py-20">
    <div className="container">
      <FadeIn className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Conecta con tus herramientas</h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          Carta se integra con las apps que ya usas a diario en tu restaurante.
        </p>
      </FadeIn>
      <FadeInStagger className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {integrations.map((it, i) => (
          <FadeInItem key={i}>
            <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 hover:shadow-warm transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <it.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-bold text-sm">{it.name}</div>
                <div className="text-xs text-muted-foreground">{it.desc}</div>
              </div>
            </div>
          </FadeInItem>
        ))}
      </FadeInStagger>
    </div>
  </section>
);
