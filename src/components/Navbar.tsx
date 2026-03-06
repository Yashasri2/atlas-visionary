import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Map, BarChart3, Rocket, Sun, Moon, Download, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FutureModal from "./FutureModal";

const Navbar = () => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(true);
  const [showFuture, setShowFuture] = useState(false);
  const [rocketLaunching, setRocketLaunching] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const handleRocketClick = () => {
    setRocketLaunching(true);
    setTimeout(() => {
      setRocketLaunching(false);
      setShowFuture(true);
    }, 1200);
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Map },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/scenario", label: "Scenario", icon: Layers },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/50">
        <div className="flex items-center justify-between px-6 h-14">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Map size={16} className="text-accent-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">
              Urban<span className="text-accent">Atlas</span>
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-accent/15 text-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon size={16} />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Demo Mode Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
              <div className="w-2 h-2 rounded-full bg-accent neon-pulse" />
              <span className="text-xs font-medium text-accent">Demo Mode</span>
            </div>

            {/* Rocket / What-If */}
            <motion.button
              onClick={handleRocketClick}
              className="w-9 h-9 rounded-lg bg-accent/10 hover:bg-accent/20 flex items-center justify-center transition-colors"
              animate={rocketLaunching ? { y: -60, opacity: 0, scale: 0.5 } : { y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeIn" }}
              title="What-If Mode"
            >
              <Rocket size={16} className="text-accent" />
            </motion.button>

            {/* Export */}
            <button className="w-9 h-9 rounded-lg hover:bg-muted/50 flex items-center justify-center transition-colors" title="Export">
              <Download size={16} className="text-muted-foreground" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg hover:bg-muted/50 flex items-center justify-center transition-colors"
              title="Toggle theme"
            >
              {isDark ? <Sun size={16} className="text-muted-foreground" /> : <Moon size={16} className="text-muted-foreground" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Rocket Launch Overlay */}
      <AnimatePresence>
        {rocketLaunching && (
          <motion.div
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: -200, scale: 1.5 }}
              transition={{ duration: 1, ease: "easeIn" }}
              className="text-6xl"
            >
              🚀
            </motion.div>
            <motion.p
              className="text-xl font-light text-muted-foreground mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Leaving the present behind...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <FutureModal open={showFuture} onClose={() => setShowFuture(false)} />
    </>
  );
};

export default Navbar;
