import { PageLayout, Section } from "@/components/PageLayout";

const faqs = [
  { q: "¿Cómo creo mi carta?", a: "Regístrate, completa los datos de tu restaurante y empieza a añadir categorías y platos desde el dashboard." },
  { q: "¿Cómo genero el QR?", a: "Una vez creada la carta, en el dashboard tienes un apartado de QR donde puedes descargarlo en PNG y compartirlo." },
  { q: "¿Puedo personalizar la URL pública?", a: "Sí, en los ajustes del restaurante puedes editar el slug de la URL." },
  { q: "¿Cómo gestiono las reservas?", a: "Las reservas entran directamente al panel y puedes confirmarlas o cancelarlas desde ahí." },
  { q: "¿Cómo cambio mi contraseña?", a: "Desde la pantalla de inicio de sesión, usa el enlace ¿olvidaste tu contraseña?" },
];

const Ayuda = () => (
  <PageLayout title="Centro de ayuda" subtitle="Resolvemos las dudas más comunes">
    <Section title="Preguntas frecuentes">
      <div className="space-y-5">
        {faqs.map((f) => (
          <div key={f.q}>
            <h3 className="font-semibold text-foreground mb-1">{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </div>
    </Section>
    <Section title="¿No encuentras lo que buscas?">
      <p>Escríbenos a <strong>hola@carta.app</strong> y te responderemos lo antes posible.</p>
    </Section>
  </PageLayout>
);

export default Ayuda;
