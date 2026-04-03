import { Car, Users, Wind, Trees } from "lucide-react";
import type { CityData } from "@/data/cities";

interface MapSummaryCardsProps {
  city: CityData;
}

const MapSummaryCards = ({ city }: MapSummaryCardsProps) => {
  const cards = [
    {
      icon: Car,
      label: "Traffic Index",
      value: `${city.trafficIndex}/100`,
      color: city.trafficIndex > 80 ? "text-destructive" : city.trafficIndex > 60 ? "text-yellow-400" : "text-success",
      bgColor: city.trafficIndex > 80 ? "bg-destructive/10" : city.trafficIndex > 60 ? "bg-yellow-400/10" : "bg-success/10",
    },
    {
      icon: Wind,
      label: "Avg AQI",
      value: city.aqi.toString(),
      color: city.aqi > 150 ? "text-destructive" : city.aqi > 100 ? "text-yellow-400" : "text-success",
      bgColor: city.aqi > 150 ? "bg-destructive/10" : city.aqi > 100 ? "bg-yellow-400/10" : "bg-success/10",
    },
    {
      icon: Users,
      label: "Density",
      value: `${(city.populationDensity / 1000).toFixed(1)}K/km²`,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Trees,
      label: "Green Cover",
      value: `${city.greenCover}%`,
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  return (
    <div className="absolute top-20 left-4 z-[400] flex flex-col gap-1.5">
      {cards.map((card) => (
        <div key={card.label} className={`glass-strong rounded-xl px-3 py-2 flex items-center gap-2 min-w-[140px] ${card.bgColor}`}>
          <card.icon size={14} className={card.color} />
          <div>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{card.label}</p>
            <p className={`text-sm font-bold ${card.color}`}>{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MapSummaryCards;
