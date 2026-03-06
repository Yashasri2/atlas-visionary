import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import DisclaimerModal from "@/components/DisclaimerModal";
import DataUnavailableModal from "@/components/DataUnavailableModal";
import MapComponent from "@/components/MapComponent";
import LeftPanel from "@/components/LeftPanel";
import RightPanel from "@/components/RightPanel";
import { CITIES, getCityByName, CITY_NAMES, type CityData } from "@/data/cities";

const DashboardPage = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(() => {
    // Only show if not previously accepted in this session
    const accepted = sessionStorage.getItem("disclaimerAccepted") === "true";
    if (accepted) return false;
    // Mark as shown so it doesn't reappear on re-navigation
    return true;
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCity, setCurrentCity] = useState<CityData>(CITIES.hyderabad);
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [unavailableName, setUnavailableName] = useState("");
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    traffic: true,
    population: false,
    landUse: true,
    pollution: false,
  });
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (showDisclaimer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showDisclaimer]);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    const city = getCityByName(searchQuery.trim());
    if (city) {
      setCurrentCity(city);
      setShowSuggestions(false);
    } else {
      setUnavailableName(searchQuery.trim());
      setShowUnavailable(true);
      setShowSuggestions(false);
    }
    setSearchQuery("");
  }, [searchQuery]);

  const filteredSuggestions = searchQuery.trim()
    ? CITY_NAMES.filter((k) => CITIES[k].name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6)
    : [];

  const toggleLayer = (layer: string) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <DisclaimerModal open={showDisclaimer} onAgree={() => {
        sessionStorage.setItem("disclaimerAccepted", "true");
        setShowDisclaimer(false);
      }} />
      <DataUnavailableModal
        open={showUnavailable}
        cityName={unavailableName}
        onClose={() => setShowUnavailable(false)}
      />

      <Navbar />

      {/* Search Bar */}
      <div className="fixed top-14 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4 pt-3">
        <div className="relative">
          <div className="glass-strong flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg">
            <Search size={16} className="text-muted-foreground" />
            <input
              type="text"
              placeholder={`Search cities... (Current: ${currentCity.name})`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>

          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute top-full mt-1 w-full glass-strong rounded-xl overflow-hidden shadow-xl">
              {filteredSuggestions.map((key) => (
                <button
                  key={key}
                  onMouseDown={() => {
                    setCurrentCity(CITIES[key]);
                    setSearchQuery("");
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-accent/10 transition-colors flex justify-between"
                >
                  <span>{CITIES[key].name}</span>
                  <span className="text-xs text-muted-foreground">{CITIES[key].state}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-14 flex">
        {/* Left Panel - 20% */}
        <div className="w-[20%] min-w-[260px] h-[calc(100vh-56px)] glass border-r border-border/50 overflow-hidden">
          <LeftPanel city={currentCity} activeLayers={activeLayers} onToggleLayer={toggleLayer} />
        </div>

        {/* Map - 55% */}
        <div className="flex-1 h-[calc(100vh-56px)] relative overflow-hidden z-0">
          <MapComponent city={currentCity} activeLayers={activeLayers} />
          {/* City label overlay */}
          <div className="absolute bottom-4 left-4 z-[10] glass px-4 py-2 rounded-xl">
            <p className="text-sm font-semibold text-foreground">{currentCity.name}</p>
            <p className="text-xs text-muted-foreground">{currentCity.state} · Pop: {(currentCity.population / 1000000).toFixed(1)}M</p>
          </div>
        </div>

        {/* Right Panel - 25% */}
        <div className="w-[25%] min-w-[300px] h-[calc(100vh-56px)] glass border-l border-border/50 overflow-hidden">
          <RightPanel city={currentCity} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
