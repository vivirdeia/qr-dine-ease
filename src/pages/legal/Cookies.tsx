import { PageLayout, Section } from "@/components/PageLayout";

const Cookies = () => (
  <PageLayout title="Política de Cookies" subtitle="Última actualización: 30 de mayo de 2026">
    <Section title="1. ¿Qué son las cookies?">
      <p>Las cookies son pequeños archivos de texto que los sitios web almacenan en el dispositivo del usuario para recordar información sobre su visita.</p>
    </Section>
    <Section title="2. Cookies que utilizamos">
      <p><strong>Técnicas:</strong> imprescindibles para el funcionamiento de la plataforma (sesión, preferencias).</p>
      <p><strong>Analíticas:</strong> nos ayudan a entender el uso del servicio de forma agregada y anónima.</p>
      <p>No utilizamos cookies publicitarias ni de terceros con fines de perfilado.</p>
    </Section>
    <Section title="3. Gestión">
      <p>El usuario puede configurar su navegador para aceptar, bloquear o eliminar las cookies. Bloquear las cookies técnicas puede afectar al funcionamiento del servicio.</p>
    </Section>
    <Section title="4. Responsable">
      <p>RETLAW SLU, CIF L721974L, El Tarter, Canillo (Andorra).</p>
    </Section>
  </PageLayout>
);

export default Cookies;
