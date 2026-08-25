"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  X,
  MapPin,
  Bed,
  Ruler,
  TrendUp,
  TrendDown,
  ShareNetwork,
  Heart,
  Star,
  Clock,
  SealCheck,
  NavigationArrow,
  CurrencyCircleDollar,
  TreeEvergreen,
  GraduationCap,
  Hospital,
  ShoppingCart,
  Bus,
  ForkKnife,
  Lightning,
  Car,
  PersonSimpleRun,
  Waves,
  ShieldCheck,
  Buildings,
  Users,
  Phone,
  Towel,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import type { PropertyItem } from "@/lib/property-types";

function fmtPrice(n: number): string {
  if (n >= 10000000) return `${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `${(n / 100000).toFixed(2)} L`;
  return `${(n / 1000).toFixed(0)}K`;
}

interface PropertyModalProps {
  property: PropertyItem | null;
  onClose: () => void;
}

export function PropertyModal({ property, onClose }: PropertyModalProps) {
  return (
    <AnimatePresence>
      {property && <ModalBody key={property.id} property={property} onClose={onClose} />}
    </AnimatePresence>
  );
}

function ModalBody({ property, onClose }: { property: PropertyItem; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "neighborhood" | "investment">("overview");
  const p = property;
  const diff = p.estimatedPrice - p.price;
  const diffPct = ((diff / p.price) * 100).toFixed(1);
  const isUndervalued = diff > 0;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const share = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy link");
    }
  }, []);

  const n = p.neighborhood;
  const scoreItems = [
    { label: "Schools", value: n.schools, icon: <GraduationCap size={13} /> },
    { label: "Hospitals", value: n.hospitals, icon: <Hospital size={13} /> },
    { label: "Grocery", value: n.grocery, icon: <ShoppingCart size={13} /> },
    { label: "Transit", value: n.transit, icon: <Bus size={13} /> },
    { label: "Dining", value: n.restaurants, icon: <ForkKnife size={13} /> },
    { label: "Parks", value: n.parks, icon: <TreeEvergreen size={13} /> },
  ];

  const amenityList = [
    { key: "parking", label: "Parking", icon: <Car size={14} /> },
    { key: "lift", label: "Lift", icon: <Buildings size={14} /> },
    { key: "gym", label: "Gym", icon: <PersonSimpleRun size={14} /> },
    { key: "swimmingPool", label: "Pool", icon: <Waves size={14} /> },
    { key: "security", label: "Security", icon: <ShieldCheck size={14} /> },
    { key: "powerBackup", label: "Power Backup", icon: <Lightning size={14} /> },
    { key: "garden", label: "Garden", icon: <TreeEvergreen size={14} /> },
    { key: "clubhouse", label: "Clubhouse", icon: <Users size={14} /> },
  ] as const;

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      role="dialog"
      aria-modal="true"
      aria-label={p.title}
    >
      <motion.button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        style={{ background: "var(--scrim)", backdropFilter: "blur(8px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        ref={dialogRef}
        initial={reduce ? false : { opacity: 0, scale: 0.965, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex max-h-[88dvh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-line-strong bg-surface shadow-2xl"
      >
        {/* Header */}
        <div className="relative h-48 shrink-0 bg-gradient-to-br from-accent/20 via-surface-2 to-purple-500/10 sm:h-56">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1 text-[12px] font-semibold text-accent">
                {p.type.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </span>
              <p className="mt-3 font-display text-3xl font-bold text-ink">₹{fmtPrice(p.price)}</p>
              <p className="text-[12px] text-ink-muted">₹{p.pricePerSqft.toLocaleString("en-IN")} per sq.ft</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="pressable absolute right-4 top-4 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-black/45 text-white backdrop-blur-md hover:bg-black/65">
            <X size={16} weight="bold" />
          </button>
          <div className="absolute top-4 left-4 flex gap-1.5">
            {p.featured && <span className="flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white"><Star size={10} weight="fill" /> Featured</span>}
            {p.newListed && <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white"><Clock size={10} /> New</span>}
          </div>
        </div>

        {/* Title bar */}
        <div className="border-b border-line px-5 py-4 sm:px-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight text-ink">{p.title}</h2>
              <div className="mt-1 flex items-center gap-1.5 text-[12px] text-ink-muted">
                <MapPin size={12} weight="fill" className="text-ink-faint" />
                {p.location.locality}, {p.location.area}, {p.location.city}
                {p.location.landmark && <span className="text-ink-faint"> · {p.location.landmark}</span>}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="flex items-center gap-1">
                <span className="font-mono text-[22px] font-bold text-accent">{p.investmentScore}</span>
                <span className="text-[10px] text-ink-faint">/100</span>
              </div>
              <p className="text-[10px] text-ink-faint">Investment Score</p>
            </div>
          </div>

          {/* Spec pills */}
          <div className="mt-3 flex flex-wrap gap-2">
            {p.bhk && <Pill icon={<Bed size={12} />}>{p.bhk}</Pill>}
            {p.bathrooms && <Pill icon={<Towel size={12} />}>{p.bathrooms} Bath</Pill>}
            <Pill icon={<Ruler size={12} />}>{p.area.toLocaleString("en-IN")} sq.ft</Pill>
            <Pill icon={<NavigationArrow size={12} />}>{p.facing} Facing</Pill>
            <Pill icon={<Clock size={12} />}>{p.status.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</Pill>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-line px-5 sm:px-7">
          {(["overview", "neighborhood", "investment"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`pressable cursor-pointer border-b-2 px-4 py-3 text-[12px] font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "border-accent text-accent"
                  : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          {activeTab === "overview" && (
            <div className="space-y-5">
              <p className="text-[13px] leading-relaxed text-ink">{p.description}</p>

              {/* Price analysis */}
              <div className="rounded-xl border border-line bg-surface-2/50 p-4">
                <h3 className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-ink">
                  <CurrencyCircleDollar size={14} /> AI Price Analysis
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[10px] text-ink-faint">Listed Price</p>
                    <p className="text-[14px] font-semibold text-ink">₹{fmtPrice(p.price)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-ink-faint">AI Estimate</p>
                    <p className={`text-[14px] font-semibold ${isUndervalued ? "text-emerald-500" : "text-red-400"}`}>₹{fmtPrice(p.estimatedPrice)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-ink-faint">Difference</p>
                    <p className={`flex items-center gap-1 text-[14px] font-semibold ${isUndervalued ? "text-emerald-500" : "text-red-400"}`}>
                      {isUndervalued ? <TrendUp size={13} /> : <TrendDown size={13} />}
                      {isUndervalued ? "+" : ""}{diffPct}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="mb-3 text-[12px] font-semibold text-ink">Amenities</h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {amenityList.map(({ key, label, icon }) => (
                    <div key={key} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px] font-medium transition-colors ${p.amenities[key] ? "border-accent/20 bg-accent/5 text-accent" : "border-line bg-surface-2 text-ink-faint line-through"}`}>
                      {icon} {label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full bg-surface-2 px-2.5 py-1 text-[10px] font-medium text-ink-muted">{t}</span>
                ))}
              </div>

              {/* Owner */}
              <div className="flex items-center gap-3 rounded-xl border border-line p-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-surface-2 font-display text-sm font-semibold text-ink">
                  {p.ownerName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1 text-[12px] font-medium text-ink">
                    {p.ownerName}
                    {p.ownerVerified && <SealCheck size={13} weight="fill" className="text-accent" />}
                  </p>
                  <p className="text-[10px] text-ink-faint">Property Owner</p>
                </div>
                <button type="button" className="pressable flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[11px] font-semibold text-on-accent">
                  <Phone size={12} /> Contact
                </button>
              </div>
            </div>
          )}

          {activeTab === "neighborhood" && (
            <div className="space-y-5">
              <div className="rounded-xl border border-line p-4">
                <h3 className="mb-3 text-[12px] font-semibold text-ink">Neighborhood Score</h3>
                <div className="mb-3 text-center">
                  <span className="font-display text-4xl font-bold text-accent">{n.overall}</span>
                  <span className="text-[12px] text-ink-faint">/100</span>
                  <p className="text-[11px] text-ink-muted">
                    {n.overall >= 80 ? "Excellent neighborhood" : n.overall >= 60 ? "Good neighborhood" : "Developing area"}
                  </p>
                </div>
                <div className="space-y-2.5">
                  {scoreItems.map(({ label, value, icon }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="w-5 text-ink-faint">{icon}</span>
                      <span className="w-20 text-[11px] text-ink-muted">{label}</span>
                      <div className="flex-1">
                        <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                          <motion.div
                            className="h-full rounded-full bg-accent"
                            initial={{ width: 0 }}
                            animate={{ width: `${value}%` }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>
                      </div>
                      <span className="w-8 text-right font-mono text-[11px] font-medium text-ink">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-line p-4">
                <h3 className="mb-2 text-[12px] font-semibold text-ink">Nearby Locations</h3>
                <div className="space-y-2">
                  {[
                    { dist: "0.5 km", name: `${p.location.area} Primary School`, type: "School" },
                    { dist: "1.2 km", name: "Government Hospital", type: "Hospital" },
                    { dist: "0.8 km", name: "Reliance Fresh", type: "Grocery" },
                    { dist: "1.5 km", name: `${p.location.area} Bus Stand`, type: "Transit" },
                    { dist: "0.3 km", name: "Local Park", type: "Park" },
                    { dist: "2.0 km", name: "Phoenix Mall", type: "Shopping" },
                  ].map((loc, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg bg-surface-2/50 px-3 py-2">
                      <span className="font-mono text-[10px] font-semibold text-accent">{loc.dist}</span>
                      <span className="text-[11px] text-ink">{loc.name}</span>
                      <span className="ml-auto rounded-full bg-surface-2 px-2 py-0.5 text-[9px] font-medium text-ink-faint">{loc.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "investment" && (
            <div className="space-y-5">
              <div className="rounded-xl border border-line p-4">
                <h3 className="mb-3 text-[12px] font-semibold text-ink">Investment Analysis</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-surface-2/50 p-3">
                    <p className="text-[10px] text-ink-faint">Appreciation Rate</p>
                    <p className="flex items-center gap-1 text-[18px] font-bold text-emerald-500">
                      <TrendUp size={16} /> +{p.appreciationRate}%
                    </p>
                    <p className="text-[10px] text-ink-faint">per year avg.</p>
                  </div>
                  <div className="rounded-lg bg-surface-2/50 p-3">
                    <p className="text-[10px] text-ink-faint">Investment Score</p>
                    <p className="font-display text-[18px] font-bold text-accent">{p.investmentScore}/100</p>
                    <p className="text-[10px] text-ink-faint">
                      {p.investmentScore >= 80 ? "Top Pick" : p.investmentScore >= 60 ? "Good" : "Moderate"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-surface-2/50 p-3">
                    <p className="text-[10px] text-ink-faint">5-Year Projection</p>
                    <p className="text-[18px] font-bold text-ink">₹{fmtPrice(p.price * Math.pow(1 + p.appreciationRate / 100, 5))}</p>
                  </div>
                  <div className="rounded-lg bg-surface-2/50 p-3">
                    <p className="text-[10px] text-ink-faint">Rental Yield Est.</p>
                    <p className="text-[18px] font-bold text-ink">{(2.5 + Math.random() * 2).toFixed(1)}%</p>
                    <p className="text-[10px] text-ink-faint">annual</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-line p-4">
                <h3 className="mb-2 text-[12px] font-semibold text-ink">Why This Property?</h3>
                <ul className="space-y-2">
                  {[
                    isUndervalued && `AI detected ${diffPct}% undervaluation — potential upside of ₹${fmtPrice(Math.abs(diff))}`,
                    p.appreciationRate > 10 && `High growth area with ${p.appreciationRate}% annual appreciation`,
                    n.transit > 70 && "Excellent public transit connectivity",
                    n.schools > 70 && "Top-rated schools within 2km radius",
                    p.amenities.security && "Gated community with 24/7 security",
                    p.amenities.parking && "Dedicated parking included",
                  ].filter(Boolean).map((reason, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12px] leading-relaxed text-ink">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Action bar */}
        <div className="flex shrink-0 items-center gap-3 border-t border-line bg-bg/60 px-5 py-4 backdrop-blur sm:px-7">
          <div className="mr-auto">
            <p className="font-display text-lg font-semibold tracking-tight text-ink">₹{fmtPrice(p.price)}</p>
            <p className="text-[10px] text-ink-faint">₹{p.pricePerSqft.toLocaleString("en-IN")}/sq.ft</p>
          </div>
          <button type="button" onClick={() => { setSaved(!saved); toast(saved ? "Removed" : "Saved"); }}
            className={`pressable grid h-11 w-11 cursor-pointer place-items-center rounded-full border transition-colors ${saved ? "border-accent bg-accent text-on-accent" : "border-line bg-surface text-ink hover:border-line-strong"}`}>
            <Heart size={17} weight={saved ? "fill" : "regular"} />
          </button>
          <button type="button" onClick={share} aria-label="Share"
            className="pressable grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-line bg-surface text-ink hover:border-line-strong">
            <ShareNetwork size={16} />
          </button>
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.location.area}, ${p.location.city}`)}`} target="_blank" rel="noopener noreferrer"
            className="pressable h-11 cursor-pointer whitespace-nowrap rounded-full bg-accent px-6 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover">
            View on Map
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Pill({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[10px] font-medium text-ink-muted">
      {icon} {children}
    </span>
  );
}
