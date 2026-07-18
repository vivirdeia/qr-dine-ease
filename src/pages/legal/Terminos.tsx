import { PageLayout, Section } from "@/components/PageLayout";
import { company } from "@/config/company";

const Terminos = () => (
  <PageLayout title="Términos y Condiciones" subtitle="Última actualización: 30 de mayo de 2026">
    <Section title="1. Identificación del prestador">
      <p><strong>{company.legalName}</strong>, {company.taxId}, con domicilio social en {company.address}, titular del servicio Carta.</p>
    </Section>
    <Section title="2. Objeto">
      <p>Estos términos regulan el acceso y uso de la plataforma Carta, que permite a restaurantes crear cartas digitales accesibles mediante código QR y gestionar reservas.</p>
    </Section>
    <Section title="3. Registro y cuenta">
      <p>El usuario es responsable de la veracidad de los datos facilitados y de la custodia de sus credenciales de acceso.</p>
    </Section>
    <Section title="4. Uso del servicio">
      <p>El usuario se compromete a no utilizar la plataforma con fines ilícitos, a no introducir contenidos que infrinjan derechos de terceros y a no realizar acciones que puedan dañar el funcionamiento del servicio.</p>
    </Section>
    <Section title="5. Propiedad intelectual">
      <p>Todos los elementos del servicio (software, diseño, marca) son propiedad de {company.legalName} o de sus licenciantes. El contenido cargado por el restaurante sigue siendo de su propiedad.</p>
    </Section>
    <Section title="6. Responsabilidad">
      <p>{company.legalName} no se hace responsable de los daños derivados del uso indebido del servicio o de la indisponibilidad puntual del mismo por causas técnicas o de fuerza mayor.</p>
    </Section>
    <Section title="7. Legislación y jurisdicción">
      <p>Estos términos se rigen por la legislación aplicable en {company.jurisdiction}. Para cualquier controversia, las partes se someten a los tribunales competentes de dicha jurisdicción.</p>
    </Section>
  </PageLayout>
);

export default Terminos;
