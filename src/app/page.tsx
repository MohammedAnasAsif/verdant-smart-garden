"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Drop,
  Thermometer,
  Sun,
  Wind,
} from "@phosphor-icons/react";
import { Sidebar } from "@/components/sidebar";
import { GardenHeader } from "@/components/garden-header";
import { GardenStats } from "@/components/garden-stats";
import { SensorCard } from "@/components/sensor-card";
import { PlantCard } from "@/components/plant-card";
import { GrowthChart } from "@/components/growth-chart";
import { GardenZones } from "@/components/garden-zones";
import { WateringSchedule } from "@/components/watering-schedule";
import { AIInsights } from "@/components/ai-insights";
import { PlantLibrary } from "@/components/plant-library";
import { PropertyFinderPage } from "@/components/property-finder";

type NavSection = "dashboard" | "plants" | "schedule" | "analytics" | "settings" | "properties";

const MOISTURE_HISTORY = [45, 48, 52, 55, 50, 47, 42, 38, 35, 32, 30, 28, 31, 34, 38, 42, 45, 48, 50, 52];
const TEMP_HISTORY = [22, 23, 24, 25, 26, 27, 28, 27, 26, 25, 24, 23, 22, 21, 22, 23, 24, 25, 26, 27];
const HUMIDITY_HISTORY = [65, 62, 60, 58, 55, 52, 50, 48, 45, 43, 42, 40, 42, 45, 48, 50, 52, 55, 58, 60];
const LIGHT_HISTORY = [0, 0, 0, 120, 340, 560, 780, 920, 980, 1020, 1050, 1080, 1050, 980, 820, 600, 350, 120, 0, 0];

const GROWTH_DATA = [
  { day: "Mon", value: 4.2 },
  { day: "Tue", value: 4.5 },
  { day: "Wed", value: 4.3 },
  { day: "Thu", value: 4.8 },
  { day: "Fri", value: 5.1 },
  { day: "Sat", value: 5.4 },
  { day: "Sun", value: 5.8 },
];

const WATER_DATA = [
  { day: "Mon", value: 12 },
  { day: "Tue", value: 15 },
  { day: "Wed", value: 10 },
  { day: "Thu", value: 18 },
  { day: "Fri", value: 14 },
  { day: "Sat", value: 20 },
  { day: "Sun", value: 16 },
];

const YIELD_DATA = [
  { day: "Mon", value: 2.1 },
  { day: "Tue", value: 2.3 },
  { day: "Wed", value: 2.2 },
  { day: "Thu", value: 2.8 },
  { day: "Fri", value: 3.1 },
  { day: "Sat", value: 3.4 },
  { day: "Sun", value: 3.8 },
];

const PLANTS = [
  { id: "1", name: "Cherry Tomato", species: "Solanum lycopersicum", health: 92, lastWatered: "2h ago", nextWatering: "In 4h", sunlight: "high" as const, temperature: 24, status: "thriving" as const, growthStage: "fruiting" as const },
  { id: "2", name: "Sweet Basil", species: "Ocimum basilicum", health: 88, lastWatered: "4h ago", nextWatering: "In 6h", sunlight: "high" as const, temperature: 22, status: "healthy" as const, growthStage: "vegetative" as const },
  { id: "3", name: "Lavender", species: "Lavandula angustifolia", health: 45, lastWatered: "18h ago", nextWatering: "Overdue", sunlight: "high" as const, temperature: 26, status: "needs-attention" as const, growthStage: "flowering" as const },
  { id: "4", name: "Strawberry", species: "Fragaria × ananassa", health: 78, lastWatered: "6h ago", nextWatering: "In 2h", sunlight: "medium" as const, temperature: 21, status: "healthy" as const, growthStage: "flowering" as const },
  { id: "5", name: "Bell Pepper", species: "Capsicum annuum", health: 85, lastWatered: "3h ago", nextWatering: "In 5h", sunlight: "high" as const, temperature: 25, status: "healthy" as const, growthStage: "vegetative" as const },
  { id: "6", name: "Lettuce", species: "Lactuca sativa", health: 35, lastWatered: "24h ago", nextWatering: "Now", sunlight: "medium" as const, temperature: 20, status: "critical" as const, growthStage: "seedling" as const },
];

export default function SmartGardenPage() {
  const [activeSection, setActiveSection] = useState<NavSection>("dashboard");
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("verdant.theme");
    if (stored) {
      setIsDark(stored === "dark");
    } else {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("verdant.theme", next ? "dark" : "light");
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <GardenHeader isDark={isDark} onToggleTheme={toggleTheme} />

        <main className="flex-1 overflow-y-auto rail-scroll">
          <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
            {activeSection === "properties" ? (
              <PropertyFinderPage />
            ) : (
              <>
                {/* Stats row */}
                <GardenStats
              totalPlants={47}
              healthyPlants={38}
              waterSaved="340L"
              co2Absorbed="12.4kg"
              sensorUptime="99.8%"
              batteryLevel={82}
            />

            {/* Sensors grid */}
            <section className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-display text-[16px] font-semibold text-ink">Live Sensors</h2>
                  <p className="text-[12px] text-ink-muted">Real-time environmental monitoring</p>
                </div>
                <span className="rounded-full bg-accent-muted px-2.5 py-1 text-[10px] font-semibold text-accent">
                  Updated 12s ago
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SensorCard
                  label="Soil Moisture"
                  value={42}
                  unit="%"
                  min={0}
                  max={100}
                  icon={<Drop size={18} weight="fill" />}
                  status="warn"
                  trend="down"
                  history={MOISTURE_HISTORY}
                />
                <SensorCard
                  label="Temperature"
                  value={24}
                  unit="°C"
                  min={0}
                  max={50}
                  icon={<Thermometer size={18} weight="fill" />}
                  status="good"
                  trend="stable"
                  history={TEMP_HISTORY}
                />
                <SensorCard
                  label="Humidity"
                  value={58}
                  unit="%"
                  min={0}
                  max={100}
                  icon={<Wind size={18} weight="fill" />}
                  status="good"
                  trend="up"
                  history={HUMIDITY_HISTORY}
                />
                <SensorCard
                  label="Light Intensity"
                  value={842}
                  unit=" lux"
                  min={0}
                  max={1200}
                  icon={<Sun size={18} weight="fill" />}
                  status="good"
                  trend="stable"
                  history={LIGHT_HISTORY}
                />
              </div>
            </section>

            {/* Charts row */}
            <section className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <GrowthChart
                title="Growth Rate"
                subtitle="Avg. daily growth (cm)"
                data={GROWTH_DATA}
                color="#22c55e"
                trend="up"
                trendValue="+12% this week"
                currentValue="5.8 cm"
              />
              <GrowthChart
                title="Water Usage"
                subtitle="Daily consumption (L)"
                data={WATER_DATA}
                color="#3b82f6"
                trend="down"
                trendValue="-8% vs last week"
                currentValue="16 L"
              />
              <GrowthChart
                title="Yield Estimate"
                subtitle="Projected harvest (kg)"
                data={YIELD_DATA}
                color="#a855f7"
                trend="up"
                trendValue="+22% projected"
                currentValue="3.8 kg"
              />
            </section>

            {/* Plants grid */}
            <section className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-display text-[16px] font-semibold text-ink">My Plants</h2>
                  <p className="text-[12px] text-ink-muted">{PLANTS.length} plants tracked across 4 zones</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PLANTS.map((plant) => (
                  <PlantCard key={plant.id} {...plant} />
                ))}
              </div>
            </section>

            {/* Zones + Schedule + Insights */}
            <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <GardenZones />
                <WateringSchedule />
              </div>
              <div className="flex flex-col gap-4">
                <AIInsights />
                <PlantLibrary />
              </div>
            </section>

            {/* Footer spacer */}
            <div className="h-8" />
            </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
