import tintoRioja from "@/assets/wines/tinto-rioja.jpg";
import tintoRibera from "@/assets/wines/tinto-ribera.jpg";
import tintoPriorat from "@/assets/wines/tinto-priorat.jpg";
import blancoAlbarino from "@/assets/wines/blanco-albarino.jpg";
import blancoVerdejo from "@/assets/wines/blanco-verdejo.jpg";
import rosadoNavarra from "@/assets/wines/rosado-navarra.jpg";
import espumosoCava from "@/assets/wines/espumoso-cava.jpg";
import dulceMoscatel from "@/assets/wines/dulce-moscatel.jpg";

// Map by wine type for fallback, and by ID for exact match
export const wineImageById: Record<string, string> = {
  w1: tintoRibera,
  w2: tintoRioja,
  w3: tintoRioja,
  w4: blancoAlbarino,
  w5: blancoVerdejo,
  w6: rosadoNavarra,
  w7: espumosoCava,
  w8: dulceMoscatel,
  w9: tintoPriorat,
  w10: tintoPriorat,
};

export const wineImageByType: Record<string, string> = {
  tinto: tintoRioja,
  blanco: blancoAlbarino,
  rosado: rosadoNavarra,
  espumoso: espumosoCava,
  dulce: dulceMoscatel,
};

export const getWineImage = (id: string, type?: string): string => {
  return wineImageById[id] || (type ? wineImageByType[type] : tintoRioja) || tintoRioja;
};
