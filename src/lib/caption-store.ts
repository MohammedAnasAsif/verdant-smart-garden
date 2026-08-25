import { create } from "zustand";
import type {
  CaptionTone,
  CaptionStyle,
  Platform,
  GeneratedCaption,
  CTAType,
} from "./caption-types";

interface CaptionState {
  topic: string;
  brief: string;
  tone: CaptionTone;
  style: CaptionStyle;
  platform: Platform;
  ctaType: CTAType;
  customCta: string;
  isGenerating: boolean;
  generatedCaptions: GeneratedCaption[];
  savedCaptions: GeneratedCaption[];
  editingId: string | null;
  editingText: string;

  setTopic: (topic: string) => void;
  setBrief: (brief: string) => void;
  setTone: (tone: CaptionTone) => void;
  setStyle: (style: CaptionStyle) => void;
  setPlatform: (platform: Platform) => void;
  setCtaType: (ctaType: CTAType) => void;
  setCustomCta: (cta: string) => void;
  setIsGenerating: (v: boolean) => void;
  setGeneratedCaptions: (captions: GeneratedCaption[]) => void;
  addGeneratedCaptions: (captions: GeneratedCaption[]) => void;
  saveCaption: (caption: GeneratedCaption) => void;
  removeSavedCaption: (id: string) => void;
  startEditing: (id: string, text: string) => void;
  updateEditingText: (text: string) => void;
  saveEdit: () => void;
  cancelEdit: () => void;
  clearGenerated: () => void;
}

export const useCaptionStore = create<CaptionState>((set, get) => ({
  topic: "",
  brief: "",
  tone: "Professional",
  style: "Storytelling",
  platform: "Instagram",
  ctaType: "None",
  customCta: "",
  isGenerating: false,
  generatedCaptions: [],
  savedCaptions: [],
  editingId: null,
  editingText: "",

  setTopic: (topic) => set({ topic }),
  setBrief: (brief) => set({ brief }),
  setTone: (tone) => set({ tone }),
  setStyle: (style) => set({ style }),
  setPlatform: (platform) => set({ platform }),
  setCtaType: (ctaType) => set({ ctaType }),
  setCustomCta: (customCta) => set({ customCta }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setGeneratedCaptions: (generatedCaptions) => set({ generatedCaptions }),
  addGeneratedCaptions: (newCaptions) =>
    set((s) => ({
      generatedCaptions: [...s.generatedCaptions, ...newCaptions],
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
    const { editingId, editingText, generatedCaptions, savedCaptions } = get();
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
      editingId: null,
      editingText: "",
    });
  },
  cancelEdit: () => set({ editingId: null, editingText: "" }),
  clearGenerated: () => set({ generatedCaptions: [] }),
}));
