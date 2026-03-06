import { useState } from "react";
import { Download, FileText, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import Navbar from "@/components/Navbar";
import { CITIES, CITY_NAMES, type CityData } from "@/data/cities";

const CHART_COLORS = ["hsl(191, 100%, 50%)", "hsl(0, 100%, 71%)", "hsl(142, 71%, 45%)", "hsl(262, 80%, 65%)", "hsl(40, 95%, 60%)"];

const AnalyticsPage = () => {
  const [selectedCity, setSelectedCity] = useState<string>("hyderabad");
  const city: CityData = CITIES[selectedCity];

  const scenarioTraffic = city.trafficByHour.map((d) => ({
    hour: `${d.hour}:00`,
    current: d.index,
    optimized: Math.max(5, d.index - 15 - Math.floor(Math.random() * 10)),
    evScenario: Math.max(3, d.index - 20 - Math.floor(Math.random() * 8)),
  }));

  const metricsTable = [
    { metric: "Population Density", current: `${city.populationDensity}/km²`, projected: `${Math.round(city.populationDensity * 1.12)}/km²`, change: 12 },
    { metric: "Average AQI", current: city.aqi.toString(), projected: Math.round(city.aqi * 0.82).toString(), change: -18 },
    { metric: "Green Cover", current: `${city.greenCover}%`, projected: `${(city.greenCover + 4.5).toFixed(1)}%`, change: 33 },
    { metric: "Traffic Index", current: `${city.trafficIndex}`, projected: `${Math.round(city.trafficIndex * 0.75)}`, change: -25 },
    { metric: "Property Value (₹/sqft)", current: city.economicData.avgPropertyValue.toLocaleString(), projected: Math.round(city.economicData.avgPropertyValue * 1.18).toLocaleString(), change: 18 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 px-6 pb-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics & Forecasts</h1>
            <p className="text-sm text-muted-foreground">Data-driven insights for urban planning</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-surface border border-border rounded-xl px-4 py-2 text-sm text-foreground"
            >
              {CITY_NAMES.map((key) => (
                <option key={key} value={key}>{CITIES[key].name}</option>
              ))}
            </select>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm font-medium hover:bg-accent/20 transition-colors">
              <Download size={14} /> Download CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:scale-[1.02] transition-transform">
              <FileText size={14} /> Generate Report
            </button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Population Forecast */}
          <div className="hud-card">
            <h3 className="text-sm font-semibold text-foreground mb-4">Population Forecast (2020–2040)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={city.populationForecast}>
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: "hsl(215, 20%, 65%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(215, 20%, 65%)" }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => (v / 1000000).toFixed(0) + "M"} />
                  <Tooltip
                    contentStyle={{ background: "hsl(220, 39%, 12%)", border: "1px solid hsl(191, 100%, 50%, 0.2)", borderRadius: "8px", fontSize: "12px" }}
                    formatter={(v: number) => [(v / 1000000).toFixed(2) + "M", "Population"]}
                  />
                  <Line type="monotone" dataKey="value" stroke="hsl(191, 100%, 50%)" strokeWidth={2.5} dot={{ fill: "hsl(191, 100%, 50%)", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Traffic Congestion */}
          <div className="hud-card">
            <h3 className="text-sm font-semibold text-foreground mb-4">Traffic Congestion Index (by Scenario)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scenarioTraffic}>
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "hsl(215, 20%, 65%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(215, 20%, 65%)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(220, 39%, 12%)", border: "1px solid hsl(191, 100%, 50%, 0.2)", borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="current" fill="hsl(0, 100%, 71%)" radius={[4, 4, 0, 0]} name="Current" />
                  <Bar dataKey="optimized" fill="hsl(191, 100%, 50%)" radius={[4, 4, 0, 0]} name="Optimized" />
                  <Bar dataKey="evScenario" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} name="100% EV" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Emissions Donut */}
          <div className="hud-card">
            <h3 className="text-sm font-semibold text-foreground mb-4">Area-wise Emissions Breakdown</h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={city.emissions}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="sector"
                  >
                    {city.emissions.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(220, 39%, 12%)", border: "1px solid hsl(191, 100%, 50%, 0.2)", borderRadius: "8px", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {city.emissions.map((e, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS[i] }} />
                  <span className="text-xs text-muted-foreground">{e.sector} ({e.value}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics Table */}
          <div className="hud-card">
            <h3 className="text-sm font-semibold text-foreground mb-4">Projected Impact Metrics</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left text-xs font-medium text-muted-foreground py-2">Metric</th>
                    <th className="text-right text-xs font-medium text-muted-foreground py-2">Current</th>
                    <th className="text-right text-xs font-medium text-muted-foreground py-2">Projected</th>
                    <th className="text-right text-xs font-medium text-muted-foreground py-2">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {metricsTable.map((row, i) => (
                    <tr key={i} className="border-b border-border/20">
                      <td className="text-sm text-foreground py-3">{row.metric}</td>
                      <td className="text-sm text-muted-foreground text-right py-3">{row.current}</td>
                      <td className="text-sm text-foreground font-medium text-right py-3">{row.projected}</td>
                      <td className="text-right py-3">
                        <span className={`inline-flex items-center gap-1 text-sm font-semibold ${row.change > 0 ? "text-success" : "text-accent-2"}`}>
                          {row.change > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {row.change > 0 ? "+" : ""}{row.change}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
