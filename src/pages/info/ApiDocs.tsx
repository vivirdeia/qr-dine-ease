import { PageLayout, Section } from "@/components/PageLayout";

const ApiDocs = () => (
  <PageLayout title="API Docs" subtitle="Integra Carta en tus propios sistemas">
    <Section title="Próximamente">
      <p>Estamos trabajando en una API REST pública para que puedas integrar Carta con tu TPV, tu web o tus propias herramientas internas.</p>
      <p>Si quieres estar entre los primeros en probarla, escríbenos a <strong>api@carta.app</strong>.</p>
    </Section>
    <Section title="Qué podrás hacer">
      <p>· Consultar la carta y categorías de un restaurante.</p>
      <p>· Crear, modificar y eliminar platos.</p>
      <p>· Recibir webhooks de reservas en tiempo real.</p>
      <p>· Gestionar la disponibilidad y el aforo.</p>
    </Section>
  </PageLayout>
);

export default ApiDocs;
