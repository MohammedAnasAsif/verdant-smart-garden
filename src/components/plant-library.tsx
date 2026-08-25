"use client";

import { motion, useReducedMotion } from "motion/react";
import { memo, useState } from "react";
import {
  Leaf,
  Sun,
  Drop,
  Clock,
  MagnifyingGlass,
  ArrowRight,
} from "@phosphor-icons/react";

interface PlantEntry {
  id: string;
  name: string;
  category: "vegetable" | "herb" | "fruit" | "flower";
  difficulty: "easy" | "moderate" | "expert";
  waterNeeds: "low" | "medium" | "high";
  sunNeeds: "shade" | "partial" | "full";
  growthTime: string;
  description: string;
  tags: string[];
}

const PLANTS: PlantEntry[] = [
  { id: "1", name: "Cherry Tomato", category: "vegetable", difficulty: "easy", waterNeeds: "medium", sunNeeds: "full", growthTime: "60–85 days", description: "Compact, prolific producer perfect for containers and raised beds. Sweet, bite-sized fruits.", tags: ["beginner-friendly", "container"] },
  { id: "2", name: "Sweet Basil", category: "herb", difficulty: "easy", waterNeeds: "medium", sunNeeds: "full", growthTime: "50–75 days", description: "Aromatic culinary essential. Pinch flowers to extend leaf production.", tags: ["kitchen", "aromatic"] },
  { id: "3", name: "Lavender", category: "flower", difficulty: "moderate", waterNeeds: "low", sunNeeds: "full", growthTime: "90–120 days", description: "Fragrant perennial attracting pollinators. Drought-tolerant once established.", tags: ["pollinator", "drought-tolerant"] },
  { id: "4", name: "Strawberry", category: "fruit", difficulty: "moderate", waterNeeds: "medium", sunNeeds: "full", growthTime: "60–90 days", description: "Perennial ground cover producing sweet berries. Everbearing varieties yield twice yearly.", tags: ["perennial", "ground-cover"] },
  { id: "5", name: "Cilantro", category: "herb", difficulty: "easy", waterNeeds: "medium", sunNeeds: "partial", growthTime: "45–70 days", description: "Fast-growing herb for salsas and Asian cuisine. Bolts in heat — succession plant.", tags: ["kitchen", "fast-growing"] },
  { id: "6", name: "Bell Pepper", category: "vegetable", difficulty: "moderate", waterNeeds: "medium", sunNeeds: "full", growthTime: "60–90 days", description: "Colorful, vitamin-rich peppers. Start indoors 8–10 weeks before last frost.", tags: ["vitamin-rich", "indoor-start"] },
  { id: "7", name: "Sunflower", category: "flower", difficulty: "easy", waterNeeds: "low", sunNeeds: "full", growthTime: "70–100 days", description: "Tall, cheerful blooms that attract bees and produce edible seeds.", tags: ["pollinator", "edible-seeds"] },
  { id: "8", name: "Blueberry", category: "fruit", difficulty: "expert", waterNeeds: "medium", sunNeeds: "full", growthTime: "2–3 years", description: "Acid-loving shrub with antioxidant-rich berries. Requires acidic soil (pH 4.5–5.5).", tags: ["perennial", "acidic-soil"] },
];

export const PlantLibrary = memo(function PlantLibrary() {
  const reduce = useReducedMotion();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { key: "all", label: "All Plants" },
    { key: "vegetable", label: "Vegetables" },
    { key: "herb", label: "Herbs" },
    { key: "fruit", label: "Fruits" },
    { key: "flower", label: "Flowers" },
  ];

  const filtered = PLANTS.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const difficultyColor = {
    easy: "text-sensor-good bg-sensor-good/10",
    moderate: "text-sensor-warn bg-sensor-warn/10",
    expert: "text-sensor-danger bg-sensor-danger/10",
  };

  const waterIcon = {
    low: "text-blue-300",
    medium: "text-blue-400",
    high: "text-blue-500",
  };

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden rounded-card border border-line bg-surface"
    >
      <div className="border-b border-line px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent-muted">
              <Leaf size={18} className="text-accent" weight="fill" />
            </div>
            <div>
              <h3 className="font-display text-[14px] font-semibold text-ink">Plant Library</h3>
              <p className="text-[11px] text-ink-muted">{PLANTS.length} species in your collection</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-3">
          <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            placeholder="Search plants, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface-2 py-2 pl-9 pr-3 text-[12px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />
        </div>

        {/* Category tabs */}
        <div className="mt-3 flex gap-1.5 overflow-x-auto rail-scroll pb-1">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`pressable shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
                activeCategory === cat.key
                  ? "bg-accent text-on-accent"
                  : "bg-surface-2 text-ink-muted hover:bg-line"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-line max-h-[480px] overflow-y-auto rail-scroll">
        {filtered.map((plant, i) => (
          <motion.div
            key={plant.id}
            initial={reduce ? false : { opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
            className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface-2/50 cursor-pointer"
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-muted text-accent">
              <Leaf size={20} weight="fill" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-medium text-ink">{plant.name}</p>
                <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase ${difficultyColor[plant.difficulty]}`}>
                  {plant.difficulty}
                </span>
              </div>
              <p className="text-[11px] text-ink-muted truncate">{plant.description}</p>
              <div className="mt-1.5 flex items-center gap-3 text-[10px] text-ink-faint">
                <span className="flex items-center gap-1">
                  <Drop size={10} className={waterIcon[plant.waterNeeds]} weight="fill" />
                  {plant.waterNeeds}
                </span>
                <span className="flex items-center gap-1">
                  <Sun size={10} className="text-amber-400" weight="fill" />
                  {plant.sunNeeds}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  {plant.growthTime}
                </span>
              </div>
            </div>
            <ArrowRight size={14} className="shrink-0 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});
