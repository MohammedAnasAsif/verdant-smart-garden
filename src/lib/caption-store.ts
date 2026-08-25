import { create } from "zustand";
import type {
  CaptionTone,
  CaptionStyle,
  Platform,
  Language,
  GeneratedCaption,
  CTAType,
} from "./caption-types";

interface CaptionState {
  topic: string;
  brief: string;
  tone: CaptionTone;
  style: CaptionStyle;
  platform: Platform;
  language: Language;
  ctaType: CTAType;
  customCta: string;
  count: number;
  abMode: boolean;
  isGenerating: boolean;
  generatedCaptions: GeneratedCaption[];
  savedCaptions: GeneratedCaption[];
  history: GeneratedCaption[];
  editingId: string | null;
  editingText: string;

  setTopic: (topic: string) => void;
  setBrief: (brief: string) => void;
  setTone: (tone: CaptionTone) => void;
  setStyle: (style: CaptionStyle) => void;
  setPlatform: (platform: Platform) => void;
  setLanguage: (language: Language) => void;
  setCtaType: (ctaType: CTAType) => void;
  setCustomCta: (cta: string) => void;
  setCount: (count: number) => void;
  setAbMode: (abMode: boolean) => void;
  setIsGenerating: (v: boolean) => void;
  addGeneratedCaptions: (captions: GeneratedCaption[]) => void;
  saveCaption: (caption: GeneratedCaption) => void;
  removeSavedCaption: (id: string) => void;
  startEditing: (id: string, text: string) => void;
  updateEditingText: (text: string) => void;
  saveEdit: () => void;
  cancelEdit: () => void;
  clearGenerated: () => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

export const useCaptionStore = create<CaptionState>((set, get) => ({
  topic: "",
  brief: "",
  tone: "Professional",
  style: "Storytelling",
  platform: "Instagram",
  language: "English",
  ctaType: "None",
  customCta: "",
  count: 3,
  abMode: false,
  isGenerating: false,
  generatedCaptions: [],
  savedCaptions: [],
  history: [],
  editingId: null,
  editingText: "",

  setTopic: (topic) => set({ topic }),
  setBrief: (brief) => set({ brief }),
  setTone: (tone) => set({ tone }),
  setStyle: (style) => set({ style }),
  setPlatform: (platform) => set({ platform }),
  setLanguage: (language) => set({ language }),
  setCtaType: (ctaType) => set({ ctaType }),
  setCustomCta: (customCta) => set({ customCta }),
  setCount: (count) => set({ count }),
  setAbMode: (abMode) => set({ abMode }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),

  addGeneratedCaptions: (newCaptions) =>
    set((s) => ({
      generatedCaptions: [...s.generatedCaptions, ...newCaptions],
      history: [...newCaptions, ...s.history],
    })),

  saveCaption: (caption) =>
    set((s) => {
      if (s.savedCaptions.some((c) => c.id === caption.id)) return s;
      return { savedCaptions: [caption, ...s.savedCaptions] };
    }),

  removeSavedCaption: (id) =>
    set((s) => ({
      savedCaptions: s.savedCaptions.filter((c) => c.id !== id),
    })),

  startEditing: (id, text) => set({ editingId: id, editingText: text }),
  updateEditingText: (editingText) => set({ editingText }),
  saveEdit: () => {
    const { editingId, editingText, generatedCaptions, savedCaptions, history } = get();
    if (!editingId) return;
    const update = (list: GeneratedCaption[]) =>
      list.map((c) =>
        c.id === editingId
          ? { ...c, text: editingText, charCount: editingText.length }
          : c
      );
    set({
      generatedCaptions: update(generatedCaptions),
      savedCaptions: update(savedCaptions),
      history: update(history),
      editingId: null,
      editingText: "",
    });
  },
  cancelEdit: () => set({ editingId: null, editingText: "" }),
  clearGenerated: () => set({ generatedCaptions: [] }),

  removeFromHistory: (id) =>
    set((s) => ({
      history: s.history.filter((c) => c.id !== id),
    })),

  clearHistory: () => set({ history: [] }),
}));
