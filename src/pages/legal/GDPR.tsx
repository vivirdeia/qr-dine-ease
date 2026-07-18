import { PageLayout, Section } from "@/components/PageLayout";
import { company } from "@/config/company";

const GDPR = () => (
  <PageLayout title="Cumplimiento RGPD" subtitle="Compromiso con la protección de datos">
    <Section title="Marco normativo">
      <p>Aplicamos los principios del Reglamento (UE) 2016/679 (RGPD) y de la normativa de protección de datos personales aplicable en {company.jurisdiction}.</p>
    </Section>
    <Section title="Principios aplicados">
      <p>Licitud, lealtad y transparencia · limitación de la finalidad · minimización de datos · exactitud · limitación del plazo de conservación · integridad y confidencialidad.</p>
    </Section>
    <Section title="Derechos del interesado">
      <p>Acceso, rectificación, supresión, oposición, limitación del tratamiento, portabilidad y derecho a no ser objeto de decisiones automatizadas. Para ejercerlos: {company.emails.privacy}.</p>
    </Section>
    <Section title="Encargados de tratamiento">
      <p>Trabajamos únicamente con proveedores que ofrecen garantías suficientes en materia de seguridad y protección de datos, mediante contratos de encargo conformes al artículo 28 RGPD.</p>
    </Section>
    <Section title="Autoridad de control">
      <p>La autoridad de control competente será la correspondiente a {company.jurisdiction}.</p>
    </Section>
  </PageLayout>
);

export default GDPR;
