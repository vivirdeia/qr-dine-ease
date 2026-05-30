import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, Smartphone, Zap, Wifi } from "lucide-react";
import { FadeIn } from "./FadeIn";

export const InteractiveDemo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    const target = `${window.location.origin}/r/casa-martin`;
    setUrl(target);
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, target, {
        width: 220,
        margin: 1,
        color: { dark: "#7a2e10", light: "#ffffff" },
      }).catch(() => {});
    }
  }, []);

  const badges = [
    { icon: Smartphone, label: "Sin app" },
    { icon: Zap, label: "< 2s en cargar" },
    { icon: Wifi, label: "Cualquier móvil" },
  ];

  return (
    <section id="demo" className="py-20 bg-secondary/50">
      <div className="container">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Escanea y prueba</h2>
          <p className="text-muted-foreground mt-3 text-lg max-w-md mx-auto">
            Esto es exactamente lo que verán tus clientes
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
          {/* QR card */}
          <FadeIn className="flex justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-card border border-border rounded-2xl p-6 shadow-warm-lg"
            >
              <canvas ref={canvasRef} className="rounded-lg" />
              <p className="mt-4 text-center text-xs text-muted-foreground break-all">{url}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {badges.map((b, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-xs bg-secondary px-2 py-1 rounded-full text-muted-foreground"
                  >
                    <b.icon className="h-3 w-3" strokeWidth={1.5} /> {b.label}
                  </span>
                ))}
              </div>
            </motion.div>
          </FadeIn>

          {/* Phone preview */}
          <FadeIn delay={0.15} className="flex justify-center">
            <div className="relative w-56 h-[440px] rounded-[2.5rem] border-8 border-foreground/90 bg-foreground/90 shadow-warm-lg overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-foreground rounded-b-2xl z-10" />
              <div className="absolute inset-0 bg-background overflow-hidden">
                <div className="h-24 bg-gradient-primary p-4 flex items-end">
                  <div>
                    <div className="text-primary-foreground font-serif font-bold text-lg">Casa Martín</div>
                    <div className="text-primary-foreground/80 text-xs">Cocina de mercado</div>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex gap-1 overflow-hidden">
                    {["Entrantes", "Carnes", "Postres"].map((c, i) => (
                      <span
                        key={i}
                        className={`text-xs px-2 py-1 rounded-full ${i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                      className="flex gap-2 p-2 bg-card border border-border rounded-lg"
                    >
                      <div className="w-12 h-12 rounded bg-gradient-primary opacity-30 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="h-2 w-3/4 bg-foreground/15 rounded mb-1.5" />
                        <div className="h-1.5 w-full bg-foreground/8 rounded mb-1" />
                        <div className="h-2 w-10 bg-primary/40 rounded mt-1.5" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="text-center mt-12">
          <Button variant="gradient" size="lg" asChild>
            <Link to="/r/casa-martin">
              Explorar la demo <ChevronRight className="ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
