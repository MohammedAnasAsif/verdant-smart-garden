import type { Metadata } from "next";
import { CaptionWorkspace } from "@/components/caption-writer/caption-workspace";

export const metadata: Metadata = {
  title: "Captionly — AI Social Media Caption Writer",
  description:
    "Generate scroll-stopping social media captions with AI. Choose your tone, style, platform, and call to action.",
};

export default function CaptionsPage() {
  return <CaptionWorkspace />;
}
