// Edita este archivo con los datos de tu empresa.
// Es el único lugar donde se definen los datos legales que aparecen
// en el footer y las páginas legales (Privacidad, Términos, Cookies, GDPR,
// Contacto, Sobre nosotros, etc.).

export const company = {
  legalName: "[Nombre de la Empresa]",
  taxId: "[CIF/NIF]",
  address: "[Dirección postal de la empresa]",
  jurisdiction: "[Jurisdicción aplicable]",
  emails: {
    support: "hola@ejemplo.com",
    sales: "ventas@ejemplo.com",
    privacy: "privacidad@ejemplo.com",
  },
  supportHours: "Lunes a viernes, de 9:00 a 18:00 (CET).",
} as const;

// Créditos del proyecto. Se muestran de forma discreta en el footer.
export const credits = {
  productOf: "Vivir de IA",
  productOfUrl: "https://vivirdeia.com",
  createdBy: "Isaac Wesley",
  createdByUrl: "https://www.linkedin.com/in/isaacwesleey/",
} as const;
