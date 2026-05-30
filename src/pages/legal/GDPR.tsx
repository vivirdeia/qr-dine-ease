import { PageLayout, Section } from "@/components/PageLayout";

const GDPR = () => (
  <PageLayout title="Cumplimiento RGPD" subtitle="Compromiso con la protección de datos">
    <Section title="Marco normativo">
      <p>Aunque RETLAW SLU está domiciliada en Andorra, aplicamos los principios del Reglamento (UE) 2016/679 (RGPD) y de la Ley Qualificada 29/2021 de protección de datos personales de Andorra.</p>
    </Section>
    <Section title="Principios aplicados">
      <p>Licitud, lealtad y transparencia · limitación de la finalidad · minimización de datos · exactitud · limitación del plazo de conservación · integridad y confidencialidad.</p>
    </Section>
    <Section title="Derechos del interesado">
      <p>Acceso, rectificación, supresión, oposición, limitación del tratamiento, portabilidad y derecho a no ser objeto de decisiones automatizadas. Para ejercerlos: privacidad@carta.app.</p>
    </Section>
    <Section title="Encargados de tratamiento">
      <p>Trabajamos únicamente con proveedores que ofrecen garantías suficientes en materia de seguridad y protección de datos, mediante contratos de encargo conformes al artículo 28 RGPD.</p>
    </Section>
    <Section title="Autoridad de control">
      <p>Agència Andorrana de Protecció de Dades (APDA) — www.apda.ad</p>
    </Section>
  </PageLayout>
);

export default GDPR;
