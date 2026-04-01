import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  UtensilsCrossed, ArrowRight, ArrowLeft, Check, CreditCard,
  Store, Clock, Plus, Loader2,
} from "lucide-react";

type Step = "signup" | "plan" | "checkout" | "onboarding";
type OnboardingStep = 1 | 2 | 3;

const STEPS: Step[] = ["signup", "plan", "checkout", "onboarding"];

const plans = [
  {
    id: "free" as const, name: "Free", price: 0,
    features: ["1 restaurante", "Hasta 20 platos", "3 categorías", "QR básico"],
  },
  {
    id: "pro" as const, name: "Pro", price: 29, badge: "Popular",
    features: ["Platos ilimitados", "Categorías ilimitadas", "Fotos por plato", "Sistema de reservas", "QR personalizado", "Multi-idioma", "Sin branding"],
  },
  {
    id: "business" as const, name: "Business", price: 59,
    features: ["Todo lo de Pro", "Hasta 5 locales", "Carta de vinos avanzada", "Dominio personalizado", "API completa", "Soporte prioritario"],
  },
];

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, setUserPlan, updateRestaurant, addCategory, addDish } = useApp();

  const preselectedPlan = searchParams.get("plan") as "free" | "pro" | "business" | null;

  const [step, setStep] = useState<Step>("signup");
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>(1);

  // Signup form
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "" });

  // Plan
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro" | "business">(preselectedPlan || "pro");

  // Checkout
  const [cardForm, setCardForm] = useState({ number: "", expiry: "", cvv: "" });
  const [processing, setProcessing] = useState(false);

  // Onboarding
  const [restaurantForm, setRestaurantForm] = useState({ name: "", address: "", phone: "", cuisine: "" });
  const [scheduleForm, setScheduleForm] = useState({
    lunchOpen: "13:00", lunchClose: "16:00",
    dinnerOpen: "20:00", dinnerClose: "23:30",
    closedDays: [] as string[],
  });
  const [firstCategory, setFirstCategory] = useState({ name: "", icon: "🍽️" });
  const [firstDish, setFirstDish] = useState({ name: "", price: "", description: "" });

  useEffect(() => {
    if (preselectedPlan) {
      setSelectedPlan(preselectedPlan);
    }
  }, [preselectedPlan]);

  const stepIndex = STEPS.indexOf(step);
  const totalSteps = selectedPlan === "free" ? 3 : 4;
  const currentStepNum = step === "checkout" ? 3 : step === "onboarding" ? (selectedPlan === "free" ? 3 : 4) : stepIndex + 1;
  const progress = (currentStepNum / totalSteps) * 100;

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.name || !signupForm.email || !signupForm.password) {
      toast.error("Completa todos los campos");
      return;
    }
    if (signupForm.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    register(signupForm.email, signupForm.password, signupForm.name);
    setRestaurantForm(prev => ({ ...prev, name: signupForm.name }));
    setStep("plan");
  };

  const handlePlanSelect = () => {
    setUserPlan(selectedPlan);
    if (selectedPlan === "free") {
      setStep("onboarding");
    } else {
      setStep("checkout");
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardForm.number || !cardForm.expiry || !cardForm.cvv) {
      toast.error("Completa los datos de la tarjeta");
      return;
    }
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    setProcessing(false);
    toast.success("¡Pago procesado correctamente!");
    setStep("onboarding");
  };

  const handleOnboardingFinish = () => {
    // Save restaurant data
    const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    const hours = days.map(day => ({
      day,
      closed: scheduleForm.closedDays.includes(day),
      continuous: false,
      morning: { open: scheduleForm.lunchOpen, close: scheduleForm.lunchClose },
      evening: { open: scheduleForm.dinnerOpen, close: scheduleForm.dinnerClose },
    }));

    updateRestaurant({
      name: restaurantForm.name || signupForm.name,
      address: restaurantForm.address,
      phone: restaurantForm.phone,
      cuisine: restaurantForm.cuisine ? [restaurantForm.cuisine] : [],
      hours,
    });

    if (firstCategory.name) {
      const newCategoryId = addCategory(firstCategory.name, firstCategory.icon);
      if (firstDish.name && firstDish.price) {
        setTimeout(() => {
          addDish({
            name: firstDish.name,
            description: firstDish.description,
            price: parseFloat(firstDish.price),
            categoryId: newCategoryId,
            allergens: [],
            dietary: [],
            isNew: true,
            available: true,
            position: 1,
          });
        }, 100);
      }
    }

    toast.success("🎉 ¡Tu restaurante está listo!");
    navigate("/dashboard");
  };

  const toggleDay = (day: string) => {
    setScheduleForm(prev => ({
      ...prev,
      closedDays: prev.closedDays.includes(day)
        ? prev.closedDays.filter(d => d !== day)
        : [...prev.closedDays, day],
    }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            <span className="font-serif text-lg font-bold">CARTA</span>
          </div>
          <span className="text-xs text-muted-foreground">
            Paso {currentStepNum} de {totalSteps}
          </span>
        </div>
        <Progress value={progress} className="h-1 rounded-none" />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center p-4 pt-8 sm:pt-16">
        <div className="w-full max-w-lg space-y-6">

          {/* ── STEP 1: Signup ── */}
          {step === "signup" && (
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold">Crea tu cuenta</h1>
                <p className="text-muted-foreground text-sm">Empieza a configurar la carta de tu restaurante</p>
              </div>
              <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Nombre del restaurante</label>
                  <input className="w-full mt-1 px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm"
                    placeholder="Ej: Casa Martín" value={signupForm.name}
                    onChange={e => setSignupForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Email</label>
                  <input className="w-full mt-1 px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm"
                    type="email" placeholder="tu@email.com" value={signupForm.email}
                    onChange={e => setSignupForm(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Contraseña</label>
                  <input className="w-full mt-1 px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm"
                    type="password" placeholder="Mínimo 6 caracteres" value={signupForm.password}
                    onChange={e => setSignupForm(p => ({ ...p, password: e.target.value }))} />
                </div>
                <Button variant="gradient" className="w-full" type="submit">
                  Continuar <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  ¿Ya tienes cuenta?{" "}
                  <button type="button" onClick={() => navigate("/dashboard")} className="text-primary hover:underline">
                    Iniciar sesión
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ── STEP 2: Plan ── */}
          {step === "plan" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold">Elige tu plan</h1>
                <p className="text-muted-foreground text-sm">Sin compromiso. Puedes cambiar en cualquier momento.</p>
              </div>
              <div className="space-y-3">
                {plans.map(p => (
                  <button key={p.id} onClick={() => setSelectedPlan(p.id)}
                    className={`w-full text-left bg-card rounded-2xl border-2 p-5 transition-all ${selectedPlan === p.id ? 'border-primary shadow-warm' : 'border-border hover:border-primary/30'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{p.name}</h3>
                        {p.badge && <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">{p.badge}</span>}
                      </div>
                      <div>
                        <span className="text-2xl font-bold">€{p.price}</span>
                        <span className="text-muted-foreground text-sm">/mes</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {p.features.slice(0, 4).map((f, i) => (
                        <span key={i} className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-full flex items-center gap-1">
                          <Check className="h-3 w-3 text-primary" /> {f}
                        </span>
                      ))}
                      {p.features.length > 4 && (
                        <span className="text-xs text-primary font-medium px-2 py-1">+{p.features.length - 4} más</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("signup")} className="flex-shrink-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button variant="gradient" className="flex-1" onClick={handlePlanSelect}>
                  {selectedPlan === "free" ? "Continuar gratis" : `Continuar con ${selectedPlan === "pro" ? "Pro" : "Business"}`}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Checkout ── */}
          {step === "checkout" && (
            <form onSubmit={handleCheckout} className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold">Datos de pago</h1>
                <p className="text-muted-foreground text-sm">14 días de prueba gratis. Cancela cuando quieras.</p>
              </div>
              <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-xl">
                  <span className="text-sm font-medium">Plan {selectedPlan === "pro" ? "Pro" : "Business"}</span>
                  <span className="font-bold">€{selectedPlan === "pro" ? 29 : 59}/mes</span>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Número de tarjeta</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input className="w-full mt-1 pl-10 pr-3 py-2.5 bg-secondary border border-border rounded-lg text-sm font-mono"
                      placeholder="4242 4242 4242 4242" value={cardForm.number}
                      onChange={e => setCardForm(p => ({ ...p, number: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Fecha</label>
                    <input className="w-full mt-1 px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm font-mono"
                      placeholder="MM/AA" value={cardForm.expiry}
                      onChange={e => setCardForm(p => ({ ...p, expiry: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">CVV</label>
                    <input className="w-full mt-1 px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm font-mono"
                      placeholder="123" value={cardForm.cvv}
                      onChange={e => setCardForm(p => ({ ...p, cvv: e.target.value }))} />
                  </div>
                </div>
                <Button variant="gradient" className="w-full" type="submit" disabled={processing}>
                  {processing ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Procesando...</>
                  ) : (
                    <>Pagar €{selectedPlan === "pro" ? 29 : 59}/mes</>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  🔒 Pago seguro simulado · Demo sin cargos reales
                </p>
              </div>
              <Button variant="ghost" onClick={() => setStep("plan")} className="w-full text-muted-foreground">
                <ArrowLeft className="h-4 w-4 mr-1" /> Volver a planes
              </Button>
            </form>
          )}

          {/* ── STEP 4: Onboarding ── */}
          {step === "onboarding" && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {onboardingStep === 1 && "Tu restaurante"}
                  {onboardingStep === 2 && "Horarios"}
                  {onboardingStep === 3 && "Tu primera carta"}
                </h1>
                <p className="text-muted-foreground text-sm">
                  Paso {onboardingStep} de 3 — {onboardingStep === 1 ? "Datos básicos" : onboardingStep === 2 ? "Horarios de apertura" : "Crea tu primera categoría"}
                </p>
              </div>

              {/* Onboarding Step 1: Restaurant basics */}
              {onboardingStep === 1 && (
                <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Nombre del restaurante</label>
                    <input className="w-full mt-1 px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm"
                      value={restaurantForm.name}
                      onChange={e => setRestaurantForm(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Dirección</label>
                    <input className="w-full mt-1 px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm"
                      placeholder="Calle, número, ciudad" value={restaurantForm.address}
                      onChange={e => setRestaurantForm(p => ({ ...p, address: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Teléfono</label>
                    <input className="w-full mt-1 px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm"
                      placeholder="+34 600 000 000" value={restaurantForm.phone}
                      onChange={e => setRestaurantForm(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Tipo de cocina</label>
                    <select className="w-full mt-1 px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm"
                      value={restaurantForm.cuisine}
                      onChange={e => setRestaurantForm(p => ({ ...p, cuisine: e.target.value }))}>
                      <option value="">Selecciona...</option>
                      <option value="Mediterránea">Mediterránea</option>
                      <option value="Italiana">Italiana</option>
                      <option value="Japonesa">Japonesa</option>
                      <option value="Mexicana">Mexicana</option>
                      <option value="Americana">Americana</option>
                      <option value="Fusión">Fusión</option>
                      <option value="Vegana">Vegana</option>
                      <option value="Tapas">Tapas</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <Button variant="gradient" className="w-full" onClick={() => setOnboardingStep(2)}>
                    Continuar <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Onboarding Step 2: Schedule */}
              {onboardingStep === 2 && (
                <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Comida — Apertura
                      </label>
                      <input type="time" className="w-full mt-1 px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm"
                        value={scheduleForm.lunchOpen}
                        onChange={e => setScheduleForm(p => ({ ...p, lunchOpen: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Comida — Cierre</label>
                      <input type="time" className="w-full mt-1 px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm"
                        value={scheduleForm.lunchClose}
                        onChange={e => setScheduleForm(p => ({ ...p, lunchClose: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Cena — Apertura
                      </label>
                      <input type="time" className="w-full mt-1 px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm"
                        value={scheduleForm.dinnerOpen}
                        onChange={e => setScheduleForm(p => ({ ...p, dinnerOpen: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Cena — Cierre</label>
                      <input type="time" className="w-full mt-1 px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm"
                        value={scheduleForm.dinnerClose}
                        onChange={e => setScheduleForm(p => ({ ...p, dinnerClose: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Días de cierre</label>
                    <div className="flex flex-wrap gap-2">
                      {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map(day => (
                        <button key={day} onClick={() => toggleDay(day)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                            scheduleForm.closedDays.includes(day)
                              ? 'bg-destructive/10 text-destructive border border-destructive/30'
                              : 'bg-secondary text-foreground border border-border'
                          }`}>
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setOnboardingStep(1)} className="flex-shrink-0">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="gradient" className="flex-1" onClick={() => setOnboardingStep(3)}>
                      Continuar <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Onboarding Step 3: First category + dish */}
              {onboardingStep === 3 && (
                <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
                  <div>
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                      <Store className="h-4 w-4 text-primary" /> Primera categoría
                    </h3>
                    <div className="flex gap-2">
                      <select className="px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm w-20"
                        value={firstCategory.icon}
                        onChange={e => setFirstCategory(p => ({ ...p, icon: e.target.value }))}>
                        {["🍽️", "🥗", "🍝", "🍖", "🐟", "🍰", "🥤", "🍷"].map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                      <input className="flex-1 px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm"
                        placeholder="Ej: Entrantes, Ensaladas, Carnes..."
                        value={firstCategory.name}
                        onChange={e => setFirstCategory(p => ({ ...p, name: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                      <Plus className="h-4 w-4 text-primary" /> Primer plato (opcional)
                    </h3>
                    <div className="space-y-2">
                      <input className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm"
                        placeholder="Nombre del plato" value={firstDish.name}
                        onChange={e => setFirstDish(p => ({ ...p, name: e.target.value }))} />
                      <div className="flex gap-2">
                        <input className="flex-1 px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm"
                          placeholder="Descripción breve" value={firstDish.description}
                          onChange={e => setFirstDish(p => ({ ...p, description: e.target.value }))} />
                        <input className="w-24 px-3 py-2.5 bg-secondary border border-border rounded-lg text-sm"
                          placeholder="€ Precio" type="number" step="0.5" value={firstDish.price}
                          onChange={e => setFirstDish(p => ({ ...p, price: e.target.value }))} />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setOnboardingStep(2)} className="flex-shrink-0">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="gradient" className="flex-1" onClick={handleOnboardingFinish}>
                      🎉 ¡Listo! Ir al panel
                    </Button>
                  </div>
                  <button onClick={handleOnboardingFinish} className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Saltar y configurar después →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
