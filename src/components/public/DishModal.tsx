import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import type { Dish } from "@/data/mockData";
import { ALLERGENS } from "@/data/mockData";
import { dishImages } from "@/data/dishImages";

type Props = {
  dish: Dish | null;
  onClose: () => void;
};

const dietaryLabels: Record<string, { label: string; icon: string }> = {
  vegetarian: { label: "Vegetariano", icon: "🌿" },
  vegan: { label: "Vegano", icon: "🌱" },
  "gluten-free": { label: "Sin gluten", icon: "🚫🌾" },
  spicy: { label: "Picante", icon: "🔥" },
};

export default function DishModal({ dish, onClose }: Props) {
  const open = !!dish;
  if (!dish) return null;

  const img = dish.photoUrl || dishImages[dish.id];

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-lg p-0 overflow-hidden gap-0">
        <DialogTitle className="sr-only">{dish.name}</DialogTitle>
        <DialogDescription className="sr-only">Detalle del plato</DialogDescription>

        <div className="aspect-[16/10] w-full bg-gradient-to-br from-primary/10 to-gold/10 overflow-hidden">
          {img ? (
            <img src={img} alt={dish.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">🍽️</div>
          )}
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-lg font-bold">{dish.name}</h2>
                {dish.featured && <span className="bg-primary/15 text-primary text-[10px] px-1.5 py-0.5 rounded-full font-bold">★ Destacado</span>}
                {dish.isNew && <span className="bg-gold text-gold-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">Nuevo</span>}
                {!dish.available && <span className="bg-muted text-muted-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">Agotado</span>}
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className={`font-bold text-lg ${!dish.available ? 'line-through text-muted-foreground' : 'text-primary'}`}>€{dish.price.toFixed(2)}</span>
              {dish.oldPrice && <span className="block text-xs text-muted-foreground line-through">€{dish.oldPrice.toFixed(2)}</span>}
            </div>
          </div>

          {dish.description && (
            <p className="text-sm text-muted-foreground">{dish.description}</p>
          )}

          {dish.chefNote && (
            <div className="text-sm text-primary/80 italic bg-primary/5 rounded-lg px-3 py-2">
              👨‍🍳 {dish.chefNote}
            </div>
          )}

          {dish.variants && dish.variants.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Variantes</h3>
              <div className="space-y-1">
                {dish.variants.map((v, i) => (
                  <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0">
                    <span>{v.name}</span>
                    <span className="font-medium text-primary">€{v.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {dish.dietary && dish.dietary.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Etiquetas</h3>
              <div className="flex flex-wrap gap-1.5">
                {dish.dietary.map(d => dietaryLabels[d] && (
                  <span key={d} className="text-xs px-2 py-1 bg-secondary rounded-full">
                    {dietaryLabels[d].icon} {dietaryLabels[d].label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {dish.allergens && dish.allergens.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">Alérgenos</h3>
              <div className="flex flex-wrap gap-1.5">
                {dish.allergens.map(a => {
                  const al = ALLERGENS.find(x => x.id === a);
                  if (!al) return null;
                  return (
                    <span key={a} className="text-xs px-2 py-1 bg-secondary rounded-full">
                      {al.emoji} {al.name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button variant="outline" className="w-full" onClick={onClose}>Cerrar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
