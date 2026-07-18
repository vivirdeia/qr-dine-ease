import { PageLayout, Section } from "@/components/PageLayout";
import { company } from "@/config/company";

const SobreNosotros = () => (
  <PageLayout title="Sobre nosotros" subtitle="La historia detrás de Carta">
    <Section title="Quiénes somos">
      <p>Carta es un producto de <strong>{company.legalName}</strong>, enfocado en construir herramientas digitales sencillas para la hostelería independiente.</p>
    </Section>
    <Section title="Nuestra misión">
      <p>Liberar a los restaurantes pequeños y medianos de la dependencia de plataformas con altas comisiones, ofreciéndoles una carta digital y un sistema de reservas que sea suyo, no de un intermediario.</p>
    </Section>
    <Section title="Nuestros valores">
      <p><strong>Simplicidad:</strong> menos clics, más servicio.</p>
      <p><strong>Transparencia:</strong> sin comisiones ocultas, sin sorpresas.</p>
      <p><strong>Propiedad:</strong> los datos del restaurante son del restaurante.</p>
    </Section>
    <Section title="Datos de la empresa">
      <p>{company.legalName} · {company.taxId}</p>
      <p>{company.address}</p>
    </Section>
  </PageLayout>
);

export default SobreNosotros;
