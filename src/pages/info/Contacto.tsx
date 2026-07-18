import { PageLayout, Section } from "@/components/PageLayout";
import { Mail, MapPin, Building2 } from "lucide-react";

const Contacto = () => (
  <PageLayout title="Contacto" subtitle="Estamos aquí para ayudarte">
    <div className="grid sm:grid-cols-2 gap-6 not-prose">
      <div className="border border-border rounded-lg p-6 space-y-2">
        <Mail className="h-5 w-5 text-primary" strokeWidth={1.5} />
        <h3 className="font-semibold">Soporte</h3>
        <p className="text-sm text-muted-foreground">hola@ejemplo.com</p>
      </div>
      <div className="border border-border rounded-lg p-6 space-y-2">
        <Mail className="h-5 w-5 text-primary" strokeWidth={1.5} />
        <h3 className="font-semibold">Comercial</h3>
        <p className="text-sm text-muted-foreground">ventas@ejemplo.com</p>
      </div>
      <div className="border border-border rounded-lg p-6 space-y-2">
        <Mail className="h-5 w-5 text-primary" strokeWidth={1.5} />
        <h3 className="font-semibold">Privacidad</h3>
        <p className="text-sm text-muted-foreground">privacidad@ejemplo.com</p>
      </div>
      <div className="border border-border rounded-lg p-6 space-y-2">
        <Building2 className="h-5 w-5 text-primary" strokeWidth={1.5} />
        <h3 className="font-semibold">Empresa</h3>
        <p className="text-sm text-muted-foreground">[Nombre de la Empresa] · [CIF/NIF]</p>
      </div>
    </div>
    <Section title="Dirección">
      <p className="flex items-start gap-2">
        <MapPin className="h-4 w-4 mt-1 shrink-0" strokeWidth={1.5} />
        <span>[Dirección postal de la empresa]</span>
      </p>
    </Section>
    <Section title="Horario de atención">
      <p>Lunes a viernes, de 9:00 a 18:00 (CET).</p>
    </Section>
  </PageLayout>
);

export default Contacto;
