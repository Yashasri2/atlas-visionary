import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BarChart3, Brain, Globe, Layers } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DisclaimerModal from "@/components/DisclaimerModal";

// Animated city grid canvas
function CityGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const cols = 24;
    const rows = 14;
    const cellW = canvas.offsetWidth / cols;
    const cellH = canvas.offsetHeight / rows;

    const buildings = Array.from({ length: cols * rows }, (_, i) => ({
      col: i % cols,
      row: Math.floor(i / cols),
      height: Math.random() * 0.7 + 0.1,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.7,
      lit: Math.random() > 0.6,
    }));

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      buildings.forEach((b) => {
        const x = b.col * cellW;
        const y = b.row * cellH;
        const pulse = Math.sin(t * 0.001 * b.speed + b.phase) * 0.3 + 0.7;
        const alpha = 0.04 + (b.lit ? 0.08 * pulse : 0.02);

        ctx.fillStyle = `hsla(191, 100%, 50%, ${alpha})`;
        ctx.fillRect(x + 2, y + 2, cellW - 4, cellH - 4);

        ctx.strokeStyle = `hsla(191, 100%, 50%, ${alpha * 0.6})`;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x + 2, y + 2, cellW - 4, cellH - 4);

        if (b.lit && pulse > 0.8) {
          ctx.fillStyle = `hsla(191, 100%, 70%, ${0.3 * pulse})`;
          ctx.fillRect(x + cellW * 0.3, y + cellH * 0.3, 2, 2);
          ctx.fillRect(x + cellW * 0.6, y + cellH * 0.5, 2, 2);
        }
      });

      const scanY = ((t * 0.03) % (canvas.offsetHeight + 40)) - 20;
      const grad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      grad.addColorStop(0, "hsla(191, 100%, 50%, 0)");
      grad.addColorStop(0.5, "hsla(191, 100%, 50%, 0.08)");
      grad.addColorStop(1, "hsla(191, 100%, 50%, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 20, canvas.offsetWidth, 40);

      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

const LandingPage = () => {
  const navigate = useNavigate();
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const handleLaunch = () => {
    const accepted = sessionStorage.getItem("disclaimerAccepted") === "true";

    if (accepted) {
      navigate("/dashboard");
      return;
    }

    setShowDisclaimer(true);
  };

  const handleAgree = () => {
    sessionStorage.setItem("disclaimerAccepted", "true");
    setShowDisclaimer(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <CityGrid />

      {/* Grid lines overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--accent)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[300px] opacity-10"
          style={{ background: "linear-gradient(to top, hsl(var(--accent)), transparent)" }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
            <Globe size={18} className="text-accent-foreground" />
          </div>
          <span className="font-bold text-xl text-foreground">
            Urban<span className="text-accent">Atlas</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLaunch}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-semibold hover:bg-accent/20 transition-colors"
          >
            Explore <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 pt-20 pb-28">
        <motion.h1
          className="text-6xl md:text-8xl font-black text-foreground text-center mb-4 leading-[1.05] max-w-5xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Design{" "}
          <span className="text-gradient">Smarter Cities</span>
        </motion.h1>

        <motion.p
          className="text-muted-foreground text-lg md:text-xl text-center max-w-xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          AI-driven urban intelligence for sustainable city planning.
        </motion.p>

        <motion.button
          onClick={handleLaunch}
          className="bg-accent text-accent-foreground font-bold text-lg px-10 py-4 rounded-full glow-accent transition-all duration-300 flex items-center gap-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 40px hsl(191, 100%, 50%, 0.5)" }}
          whileTap={{ scale: 0.98 }}
        >
          Launch the Atlas <ArrowRight size={20} />
        </motion.button>

        {/* Stats row */}
        <motion.div
          className="flex items-center gap-8 md:gap-14 mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {[
            { icon: Layers, label: "9 Urban Zones" },
            { icon: BarChart3, label: "Real-time Analytics" },
            { icon: Brain, label: "ML-Powered Insights" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2 text-muted-foreground">
              <s.icon size={18} className="text-accent/70" />
              <span className="text-sm font-medium">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <DisclaimerModal open={showDisclaimer} onAgree={handleAgree} />
    </div>
  );
};

export default LandingPage;
