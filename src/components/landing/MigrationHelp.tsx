import { FileText, Wand2, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FadeIn, FadeInStagger, FadeInItem } from "./FadeIn";

const steps = [
  { icon: FileText, title: "Envíanos tu carta", desc: "PDF, foto, link de TheFork o Glovo. Lo que tengas." },
  { icon: Wand2, title: "La digitalizamos", desc: "Categorías, precios, alérgenos. En menos de 24h." },
  { icon: CheckCircle2, title: "Tú revisas y publicas", desc: "Ajustas lo que quieras y activas el QR. Sin coste." },
];

export const MigrationHelp = () => (
  <section className="py-20 bg-secondary/50">
    <div className="container max-w-4xl">
      <FadeIn className="text-center mb-12">
        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium mb-3">
          Migración gratis
        </span>
        <h2 className="text-3xl md:text-4xl font-bold">¿Ya tienes carta en PDF, TheFork o Glovo?</h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          La pasamos a Carta por ti. Sin coste, sin formularios eternos.
        </p>
      </FadeIn>
      <FadeInStagger className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {steps.map((s, i) => (
          <FadeInItem key={i}>
            <div className="bg-card border border-border rounded-2xl p-6 h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <s.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-bold text-muted-foreground">PASO {i + 1}</span>
              </div>
              <h3 className="font-bold mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          </FadeInItem>
        ))}
      </FadeInStagger>
      <div className="text-center">
        <Button variant="gradient" size="lg" asChild>
          <Link to="/contacto">
            Solicitar migración gratis <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  </section>
);
