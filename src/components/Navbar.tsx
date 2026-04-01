import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Map, BarChart3, Layers, Sun, Moon, Download } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Map },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/scenario", label: "Scenario", icon: Layers },
  ];

  return (
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
  );
};

export default Navbar;
