import { Link } from "react-router-dom";
import { UtensilsCrossed, ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const PageLayout = ({ title, subtitle, children }: PageLayoutProps) => (
  <div className="min-h-screen flex flex-col bg-background">
    <header className="border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5 text-primary" strokeWidth={1.5} />
          <span className="font-serif text-lg font-bold tracking-tight">CARTA</span>
        </Link>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> Volver al inicio
        </Link>
      </div>
    </header>
    <main className="flex-1 py-16">
      <div className="container max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight mb-3">{title}</h1>
        {subtitle && <p className="text-muted-foreground text-lg mb-10">{subtitle}</p>}
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed text-foreground/90">
          {children}
        </div>
      </div>
    </main>
    <footer className="border-t border-border py-8">
      <div className="container text-center text-xs text-muted-foreground space-y-1">
        <p>© {new Date().getFullYear()} RETLAW SLU · CIF L721974L</p>
        <p>Camí del Pont del Tarter, s/n, Apartament 108, Edifici Arbres del Tarter, El Tarter, Canillo (Andorra)</p>
      </div>
    </footer>
  </div>
);

export const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="space-y-3">
    <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
    <div className="space-y-3 text-muted-foreground">{children}</div>
  </section>
);
