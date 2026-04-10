import { Brain, DollarSign, Sparkles, Heart } from "lucide-react";

export const MODE_CONFIG = {
  focus: {
    label: "Focus",
    description: "Deep work & cognitively demanding tasks",
    icon: Brain,
    colorClass: "mode-focus",
    textClass: "text-mode-focus",
    bgClass: "bg-mode-focus",
    bgLightClass: "bg-mode-focus/10",
    borderClass: "border-mode-focus",
    glowClass: "mode-glow-focus",
  },
  money: {
    label: "Money",
    description: "Income-generating & financial actions",
    icon: DollarSign,
    colorClass: "mode-money",
    textClass: "text-mode-money",
    bgClass: "bg-mode-money",
    bgLightClass: "bg-mode-money/10",
    borderClass: "border-mode-money",
    glowClass: "mode-glow-money",
  },
  creative: {
    label: "Creative",
    description: "Idea generation, writing & design",
    icon: Sparkles,
    colorClass: "mode-creative",
    textClass: "text-mode-creative",
    bgClass: "bg-mode-creative",
    bgLightClass: "bg-mode-creative/10",
    borderClass: "border-mode-creative",
    glowClass: "mode-glow-creative",
  },
  life: {
    label: "Life",
    description: "Rest, social & everyday tasks",
    icon: Heart,
    colorClass: "mode-life",
    textClass: "text-mode-life",
    bgClass: "bg-mode-life",
    bgLightClass: "bg-mode-life/10",
    borderClass: "border-mode-life",
    glowClass: "mode-glow-life",
  },
};

export const MODES = Object.keys(MODE_CONFIG);

export const EMOTIONAL_TAGS = [
  { value: "planned", label: "Planned", emoji: "📋" },
  { value: "investment", label: "Investment", emoji: "📈" },
  { value: "stress-driven", label: "Stress-driven", emoji: "😰" },
  { value: "impulsive", label: "Impulsive", emoji: "⚡" },
  { value: "neutral", label: "Neutral", emoji: "➖" },
];

export function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
