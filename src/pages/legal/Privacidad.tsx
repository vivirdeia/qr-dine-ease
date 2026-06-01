import { PageLayout, Section } from "@/components/PageLayout";

const Privacidad = () => (
  <PageLayout title="Política de Privacidad" subtitle="Última actualización: 30 de mayo de 2026">
    <Section title="1. Responsable del tratamiento">
      <p>El responsable del tratamiento de los datos personales es <strong>RETLAW SLU</strong>, con CIF L721974L y domicilio social en Camí del Pont del Tarter, s/n, Apartament 108, Edifici Arbres del Tarter, El Tarter, Canillo (Andorra).</p>
      <p>Contacto: privacidad@holacarta.com</p>
    </Section>
    <Section title="2. Datos que recopilamos">
      <p>Recopilamos datos de identificación (nombre, email), datos del restaurante (nombre comercial, dirección, carta), datos de uso del servicio y datos técnicos (IP, navegador) necesarios para prestar el servicio.</p>
    </Section>
    <Section title="3. Finalidad">
      <p>Tratamos los datos para gestionar la cuenta, prestar el servicio de carta digital y reservas, atender consultas y cumplir obligaciones legales.</p>
    </Section>
    <Section title="4. Base legal">
      <p>La ejecución del contrato de prestación de servicios, el consentimiento del usuario y el cumplimiento de obligaciones legales aplicables.</p>
    </Section>
    <Section title="5. Conservación">
      <p>Conservamos los datos mientras la cuenta esté activa y durante los plazos legales aplicables tras su cancelación.</p>
    </Section>
    <Section title="6. Derechos">
      <p>Puede ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad enviando un email a privacidad@holacarta.com acompañado de copia de un documento identificativo.</p>
    </Section>
    <Section title="7. Transferencias internacionales">
      <p>RETLAW SLU está domiciliada en Andorra. Los datos pueden tratarse mediante proveedores ubicados en la Unión Europea bajo garantías adecuadas.</p>
    </Section>
  </PageLayout>
);

export default Privacidad;
