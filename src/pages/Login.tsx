import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      toast.success("¡Bienvenido!");
      navigate("/dashboard", { replace: true });
    } else {
      setError(true);
      toast.error("Credenciales incorrectas o cuenta suspendida");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <UtensilsCrossed className="h-8 w-8 text-primary" />
            <span className="font-serif text-2xl font-bold">CARTA</span>
          </div>
          <p className="text-muted-foreground text-sm">Accede al panel de tu restaurante</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <input
              className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(false); }}
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Contraseña</label>
            <input
              className="w-full mt-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false); }}
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-xs text-destructive">Email o contraseña incorrectos</p>}
          <Button variant="gradient" className="w-full" type="submit">Iniciar sesión</Button>
          <div className="text-center space-y-2">
            <button type="button" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              ¿Olvidaste tu contraseña?
            </button>
            <p className="text-xs text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">Crear cuenta gratis</Link>
            </p>
          </div>
        </form>
        <p className="text-xs text-muted-foreground text-center">
          Demo: demo@holacarta.com / demo1234 · Admin: admin@holacarta.com / admin1234
        </p>
      </div>
    </div>
  );
};

export default Login;
