import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { heroRestaurant } from "@/data/dishImages";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/landing/FadeIn";
import { TrustBar } from "@/components/landing/TrustBar";
import { MigrationHelp } from "@/components/landing/MigrationHelp";
import { InteractiveDemo } from "@/components/landing/InteractiveDemo";
import { DashboardMockup } from "@/components/landing/DashboardMockup";
import {
  UtensilsCrossed,
  Store,
  CalendarCheck,
  QrCode,
  Book,
  LayoutGrid,
  BarChart3,
  Globe,
  Check,
  X,
  Star,
  ArrowRight,
  Menu,
  ChevronRight,
} from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <span className="font-serif text-xl font-bold tracking-tight">CARTA</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Características
          </a>
          <a href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Demo
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
          <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Testimonios
          </a>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline-primary" size="sm" asChild>
            <Link to="/login">Iniciar sesión</Link>
          </Button>
          <Button variant="gradient" size="sm" asChild>
            <Link to="/register">Crear mi carta gratis</Link>
          </Button>
        </div>
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          <Menu className="h-5 w-5" />
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 space-y-3">
          <a href="#features" className="block text-sm text-muted-foreground">
            Características
          </a>
          <a href="#pricing" className="block text-sm text-muted-foreground">
            Pricing
          </a>
          <a href="#testimonials" className="block text-sm text-muted-foreground">
            Testimonios
          </a>
          <div className="flex gap-2 pt-2">
            <Button variant="outline-primary" size="sm" asChild className="flex-1">
              <Link to="/login">Iniciar sesión</Link>
            </Button>
            <Button variant="gradient" size="sm" asChild className="flex-1">
              <Link to="/register">Crear mi carta</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => (
  <section className="relative overflow-hidden py-20 md:py-32">
    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
    <div className="container relative">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        className="max-w-3xl mx-auto text-center space-y-6"
      >
        <motion.span
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium"
        >
          +800 restaurantes ya usan Carta
        </motion.span>
        <motion.h1
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          className="text-4xl md:text-6xl font-bold leading-tight tracking-tight"
        >
          Tu carta digital. <span className="text-gradient-primary">Un solo QR.</span>
        </motion.h1>
        <motion.p
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Crea la carta digital de tu restaurante en 10 minutos. Tus clientes escanean el QR, ven los platos, y reservan
          mesa. Sin apps, sin comisiones, sin complicaciones.
        </motion.p>
        <motion.div
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-2"
        >
          <Button variant="gradient" size="xl" asChild>
            <Link to="/register">
              Crear mi carta gratis <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline-primary" size="xl" asChild>
            <Link to="/r/casa-martin">Ver demo en vivo</Link>
          </Button>
        </motion.div>
        <motion.div
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          className="flex items-center justify-center gap-3 pt-4"
        >
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-gradient-primary" />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">Más de 800 restaurantes</span>
        </motion.div>
      </motion.div>
      <div className="mt-16 flex justify-center gap-6 px-4">
        <div className="relative w-48 md:w-56 h-80 md:h-96 rounded-2xl shadow-warm-lg overflow-hidden border border-border">
          <img
            src={heroRestaurant}
            alt="Carta digital en móvil"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
            <div className="h-3 w-20 bg-primary-foreground/30 rounded" />
            <div className="space-y-1.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-2 items-center">
                  <div className="w-8 h-8 rounded-lg bg-primary-foreground/20" />
                  <div className="flex-1 space-y-1">
                    <div className="h-2 w-full bg-primary-foreground/15 rounded" />
                    <div className="h-1.5 w-2/3 bg-primary-foreground/10 rounded" />
                  </div>
                </div>
              ))}
            </div>
            <div className="h-10 bg-gradient-primary rounded-xl opacity-90 flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-medium">Reservar mesa</span>
            </div>
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-foreground/20" />
        </div>
        <div className="hidden md:block">
          <DashboardMockup />
        </div>
      </div>
    </div>
  </section>
);


const steps = [
  { icon: Store, title: "Configura tu restaurante", desc: "Nombre, horarios, mesas, fotos. 10 minutos." },
  {
    icon: UtensilsCrossed,
    title: "Crea tu carta",
    desc: "Añade categorías, platos con foto y precio, menú del día. Sin código.",
  },
  {
    icon: CalendarCheck,
    title: "Activa las reservas",
    desc: "Configura mesas, franjas horarias y confirmación automática o manual.",
  },
  {
    icon: QrCode,
    title: "Imprime tu QR",
    desc: "Descarga el QR, ponlo en las mesas, y listo. Tus clientes hacen el resto.",
  },
];

const HowItWorks = () => (
  <section className="py-20">
    <div className="container">
      <FadeIn>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Cómo funciona</h2>
      </FadeIn>
      <FadeInStagger className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {steps.map((s, i) => (
          <FadeInItem key={i} className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center shadow-warm">
              <s.icon className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="text-sm font-bold text-primary">Paso {i + 1}</div>
            <h3 className="text-lg font-bold font-sans">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </FadeInItem>
        ))}
      </FadeInStagger>
    </div>
  </section>
);

const features = [
  {
    icon: Book,
    title: "Carta digital completa",
    desc: "Categorías, platos con foto, precios, alérgenos, menú del día, platos agotados en un clic. Siempre actualizada.",
  },
  {
    icon: CalendarCheck,
    title: "Reservas sin comisión",
    desc: "Tus clientes reservan mesa directamente. Sin TheFork, sin comisiones por comensal, sin intermediarios.",
  },
  {
    icon: QrCode,
    title: "QR personalizado",
    desc: "Genera tu QR con los colores de tu restaurante. Descárgalo, imprímelo, ponlo en las mesas.",
  },
  {
    icon: LayoutGrid,
    title: "Gestión de mesas",
    desc: "Plano visual de tu restaurante. Mesas, capacidad, combinables para grupos. Ocupación en tiempo real.",
  },
  {
    icon: BarChart3,
    title: "Panel de métricas",
    desc: "Reservas por día, platos más vistos, horarios pico, tasa de no-show. Datos para tomar decisiones.",
  },
  {
    icon: Globe,
    title: "Multi-idioma automático",
    desc: "Tu carta en español, inglés, francés y catalán. El comensal elige su idioma al entrar.",
  },
];

const Features = () => (
  <section id="features" className="py-20 bg-secondary/50">
    <div className="container">
      <FadeIn className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Características</h2>
        <p className="text-muted-foreground mb-16 max-w-xl mx-auto">
          Todo lo que necesita tu restaurante para digitalizar carta y reservas
        </p>
      </FadeIn>
      <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <FadeInItem
            key={i}
            className="bg-card rounded-2xl p-6 border border-border hover:shadow-warm transition-shadow space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <f.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold font-sans">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </FadeInItem>
        ))}
      </FadeInStagger>
    </div>
  </section>
);

const comparisonRows = [
  { label: "Comisión por comensal", carta: "€0", other: "€0", cartaGood: true, otherGood: true },
  {
    label: "El cliente es tuyo",
    carta: "Datos en tu panel",
    other: "Dispersos por chats",
    cartaGood: true,
    otherGood: false,
  },
  { label: "Carta digital con fotos", carta: true, other: false },
  { label: "Actualiza precios en 2 min", carta: true, other: false },
  { label: "Menú del día editable", carta: true, other: false },
  { label: "Reservas organizadas", carta: true, other: false },
  { label: "Recordatorios automáticos", carta: true, other: false },
  { label: "Coste mensual fijo", carta: "Desde €0", other: "Gratis pero caótico", cartaGood: true, otherGood: false },
];

const Comparison = () => (
  <section className="py-20">
    <div className="container max-w-3xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">¿Por qué Carta y no PDF + WhatsApp?</h2>
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="grid grid-cols-3 text-center font-bold border-b border-border">
          <div className="p-4" />
          <div className="p-4 bg-primary/5 text-primary">Carta</div>
          <div className="p-4 text-muted-foreground">PDF + WhatsApp</div>
        </div>
        {comparisonRows.map((r, i) => (
          <div key={i} className="grid grid-cols-3 text-center border-b border-border last:border-0 text-sm">
            <div className="p-4 text-left font-medium">{r.label}</div>
            <div className="p-4 bg-primary/5 font-medium">
              {typeof r.carta === "boolean" ? (
                r.carta ? (
                  <Check className="h-5 w-5 text-success mx-auto" />
                ) : (
                  <X className="h-5 w-5 text-destructive mx-auto" />
                )
              ) : (
                <span className="text-primary">{r.carta}</span>
              )}
            </div>
            <div className="p-4">
              {typeof r.other === "boolean" ? (
                r.other ? (
                  <Check className="h-5 w-5 text-success mx-auto" />
                ) : (
                  <X className="h-5 w-5 text-muted-foreground mx-auto" />
                )
              ) : (
                <span className="text-muted-foreground">{r.other}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

import restauranteBarrio from "@/assets/cases/restaurante-barrio.jpg";
import cafeteriaBrunch from "@/assets/cases/cafeteria-brunch.jpg";
import fineDining from "@/assets/cases/fine-dining.jpg";

const useCases = [
  {
    title: "Restaurante de barrio",
    desc: "Casa Martín tiene 40 cubiertos. Antes recibía reservas por teléfono y WhatsApp. Ahora sus clientes reservan desde la carta digital. No-shows bajaron un 35%.",
    image: restauranteBarrio,
  },
  {
    title: "Cafetería con brunch",
    desc: "Kokosnöt tiene carta rotatoria cada semana. Con Carta, actualiza los platos en 2 minutos desde el móvil. Sin llamar a nadie, sin depender de un diseñador.",
    image: cafeteriaBrunch,
  },
  {
    title: "Restaurante fine dining",
    desc: "El Racó tiene carta de vinos con 120 referencias. La carta digital permite buscar por tipo, región y maridaje. El sommelier respira tranquilo.",
    image: fineDining,
  },
];

const UseCases = () => (
  <section className="py-20 bg-secondary/50">
    <div className="container">
      <FadeIn>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Casos de uso</h2>
      </FadeIn>
      <FadeInStagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {useCases.map((c, i) => (
          <FadeInItem
            key={i}
            className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-warm transition-shadow"
          >
            <img
              src={c.image}
              alt={c.title}
              className="h-40 w-full object-cover"
              loading="lazy"
              width={800}
              height={544}
            />
            <div className="p-6 space-y-3">
              <h3 className="text-lg font-bold font-sans">{c.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
            </div>
          </FadeInItem>
        ))}
      </FadeInStagger>
    </div>
  </section>
);

const plans = [
  {
    name: "Free",
    price: 0,
    priceAnnual: 0,
    badge: null,
    features: ["1 restaurante", "Hasta 20 platos", "3 categorías", "QR básico", "Branding de Carta"],
    notIncluded: ["Fotos de platos", "Sistema de reservas", "Multi-idioma", "Métricas"],
    cta: "Empezar gratis",
    variant: "outline-primary" as const,
  },
  {
    name: "Pro",
    price: 29,
    priceAnnual: 23,
    badge: "Popular",
    features: [
      "1 restaurante",
      "Platos ilimitados",
      "Categorías ilimitadas",
      "Fotos por plato",
      "Menú del día editable",
      "14 alérgenos EU",
      "Sistema de reservas completo",
      "Gestión de mesas visual",
      "QR personalizado",
      "Multi-idioma (ES, EN, FR, CA)",
      "Métricas básicas",
      "Sin branding de Carta",
    ],
    notIncluded: [],
    cta: "Empezar con Pro",
    variant: "gradient" as const,
  },
  {
    name: "Business",
    price: 59,
    priceAnnual: 47,
    badge: null,
    features: [
      "Todo lo de Pro",
      "Hasta 5 locales",
      "Carta de vinos avanzada",
      "Métricas avanzadas",
      "Dominio personalizado",
      "API completa",
      "Export CSV/PDF",
      "White-label total",
      "Widget embebible",
      "Soporte prioritario",
    ],
    notIncluded: [],
    cta: "Empezar con Business",
    variant: "outline-primary" as const,
  },
];

const Pricing = () => {
  const [annual, setAnnual] = useState(false);
  return (
    <section id="pricing" className="py-20">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Un plan para cada restaurante</h2>
        <p className="text-muted-foreground text-center mb-4 max-w-xl mx-auto">
          Empieza gratis. Sin tarjeta de crédito. Sin comisiones. Nunca.
        </p>
        <p className="text-center text-sm font-medium text-primary mb-8">
          Carta NO cobra comisión por comensal. Nunca. Tu precio mensual es fijo.
        </p>
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-secondary rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!annual ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              Mensual
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${annual ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
            >
              Anual <span className="text-success text-xs">-20%</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((p, i) => (
            <div
              key={i}
              className={`relative bg-card rounded-2xl border-2 p-8 space-y-6 ${p.badge ? "border-primary shadow-warm-lg scale-105" : "border-border"}`}
            >
              {p.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                  {p.badge}
                </span>
              )}
              <div>
                <h3 className="text-xl font-bold font-sans">{p.name}</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold">€{annual ? p.priceAnnual : p.price}</span>
                  <span className="text-muted-foreground">/mes</span>
                </div>
              </div>
              <Button variant={p.variant} size="lg" className="w-full" asChild>
                <Link to={`/register?plan=${p.name.toLowerCase()}`}>{p.cta}</Link>
              </Button>
              {p.name === "Pro" && (
                <p className="text-xs text-center text-muted-foreground">14 días gratis · Sin tarjeta</p>
              )}
              <ul className="space-y-2">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
                {p.notIncluded.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <X className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const testimonials = [
  {
    quote:
      "Teníamos la carta en PDF y las reservas por WhatsApp. Un caos. Con Carta lo montamos en una tarde y ahora los clientes escanean el QR, ven todo y reservan solos. Los no-shows bajaron porque reciben recordatorio automático.",
    name: "Pedro García",
    restaurant: "Restaurant Casa Martín",
    stars: 5,
  },
  {
    quote:
      "Cambio la carta cada semana porque trabajo con producto de temporada. Antes tenía que llamar al diseñador para cada cambio. Ahora lo hago yo en 2 minutos desde el móvil mientras preparo el servicio.",
    name: "Anna Kowalski",
    restaurant: "Cafetería Kokosnöt",
    stars: 5,
  },
  {
    quote:
      "Tenemos 120 referencias de vino. Con Carta, el cliente busca por tipo o región y ve la descripción sin que el camarero tenga que explicar cada botella. El sommelier está encantado.",
    name: "Marta Vega",
    restaurant: "Restaurant El Racó",
    stars: 5,
  },
];

const Testimonials = () => (
  <section id="testimonials" className="py-20 bg-secondary/50">
    <div className="container">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Lo que dicen nuestros clientes</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="bg-card rounded-2xl border border-border p-2 space-y-4 hover:shadow-warm transition-shadow"
          >
            <div className="flex gap-0.5">
              {Array.from({ length: t.stars }).map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-star text-star" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed italic">"{t.quote}"</p>
            <div>
              <p className="font-bold text-sm">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.restaurant}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const faqItems = [
  {
    q: "¿Necesito saber programar?",
    a: "No. Si sabes subir una foto a Instagram, sabes usar Carta. Todo se hace desde un panel visual.",
  },
  {
    q: "¿Cuánto tardo en tener mi carta lista?",
    a: "10 minutos si ya tienes los platos y precios en la cabeza. 30 minutos si quieres fotos y descripciones detalladas.",
  },
  {
    q: "¿Hay comisión por reserva o por comensal?",
    a: "No. Nunca. El precio es fijo mensual. No cobramos por reserva, por comensal, ni por nada variable. Tu negocio, tus márgenes.",
  },
  {
    q: "¿El QR es fijo o cambia?",
    a: "Es fijo. Lo imprimes una vez y sirve para siempre. Si actualizas la carta, el QR sigue funcionando porque apunta a tu URL permanente.",
  },
  {
    q: "¿Puedo tener la carta en varios idiomas?",
    a: "Sí, en el plan Pro y Business. Español, inglés, francés y catalán. El comensal elige su idioma al entrar.",
  },
  {
    q: "¿Funciona sin internet para el comensal?",
    a: "El comensal necesita conexión para escanear el QR y ver la carta. Pero la carta carga muy rápido (menos de 2 segundos) y es una web, no una app que descargar.",
  },
  { q: "¿Puedo cancelar cuando quiera?", a: "Sí. Sin permanencia. Tu carta sigue activa en el plan Free si cancelas." },
];

const FAQ = () => (
  <section className="py-20">
    <div className="container max-w-2xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Preguntas frecuentes</h2>
      <Accordion type="single" collapsible className="space-y-2">
        {faqItems.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-xl px-6">
            <AccordionTrigger className="text-left font-medium hover:no-underline">{item.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

const CTAFinal = () => (
  <section className="py-20 bg-gradient-primary relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
    <div className="container relative text-center space-y-6">
      <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
        Tu próxima reserva está a un QR de distancia
      </h2>
      <p className="text-primary-foreground/80 text-lg max-w-md mx-auto">
        Crea tu carta digital en 10 minutos. Gratis. Sin comisiones. Sin tarjeta.
      </p>
      <Button size="xl" className="bg-card text-primary hover:bg-card/90 rounded-full shadow-warm-lg" asChild>
        <Link to="/register">
          Crear mi carta gratis <ArrowRight className="ml-1" />
        </Link>
      </Button>
      <p className="text-primary-foreground/60 text-sm">800+ restaurantes · 0% comisiones · Para siempre</p>
    </div>
  </section>
);

const Footer = () => {
  const cols: { title: string; links: { label: string; to: string; external?: boolean }[] }[] = [
    { title: "Producto", links: [
      { label: "Características", to: "/caracteristicas" },
      { label: "Pricing", to: "/pricing" },
      { label: "Demo", to: "/demo" },
      { label: "Changelog", to: "/changelog" },
    ]},
    { title: "Recursos", links: [
      { label: "Centro de ayuda", to: "/ayuda" },
      { label: "Guías", to: "/guias" },
      { label: "API Docs", to: "/api-docs" },
    ]},
    { title: "Legal", links: [
      { label: "Privacidad", to: "/privacidad" },
      { label: "Términos", to: "/terminos" },
      { label: "Cookies", to: "/cookies" },
      { label: "GDPR", to: "/gdpr" },
    ]},
    { title: "Compañía", links: [
      { label: "Sobre nosotros", to: "/sobre-nosotros" },
      { label: "Contacto", to: "/contacto" },
      { label: "Twitter", to: "https://twitter.com", external: true },
      { label: "Instagram", to: "https://instagram.com", external: true },
    ]},
  ];
  return (
    <footer className="py-16 border-t border-border">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <UtensilsCrossed className="h-5 w-5 text-primary" />
              <span className="font-serif text-lg font-bold">CARTA</span>
            </div>
            <p className="text-sm text-muted-foreground">Tu carta digital y reservas con un solo QR.</p>
          </div>
          {cols.map((col, i) => (
            <div key={i}>
              <h4 className="font-bold text-sm mb-3 font-sans">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link, j) => (
                  <li key={j}>
                    {link.external ? (
                      <a href={link.to} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link.label}</a>
                    ) : (
                      <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground space-y-1">
          <p>© {new Date().getFullYear()} [Nombre de la Empresa] · [CIF/NIF] · Todos los derechos reservados.</p>
          <p className="text-xs">[Dirección postal de la empresa]</p>
        </div>
      </div>
    </footer>
  );
};

const Landing = () => (
  <div className="min-h-screen">
    <Navbar />
    <Hero />
    <TrustBar />
    <InteractiveDemo />
    <HowItWorks />
    <Features />
    <Comparison />
    <UseCases />
    <Pricing />
    <Testimonials />
    <FAQ />
    <MigrationHelp />
    <CTAFinal />
    <Footer />
  </div>
);

export default Landing;
