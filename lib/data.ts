export const FEELINGS = [
  "defensive", "not listened to", "feelings got hurt", "totally flooded", "angry", "sad",
  "unloved", "misunderstood", "criticized", "took a complaint personally",
  "like you didn't even like me", "not cared about", "worried", "afraid", "unsafe", "tense",
  "I was right and you were wrong", "both of us were partly right", "out of control",
  "frustrated", "righteously indignant", "morally justified", "unfairly treated",
  "unappreciated", "disliked", "disrespected", "unattractive", "stupid", "morally outraged",
  "taken for granted", "like leaving", "like staying and talking this through",
  "overwhelmed with emotion", "not calm", "stubborn", "powerless", "I had no influence",
  "I wanted to win this one", "my opinions didn't even matter", "there was a lot of give and take",
  "I had no feelings at all", "I had no idea what I was feeling", "lonely", "alienated",
  "ashamed", "guilty", "culpable", "abandoned", "disloyal", "exhausted", "foolish",
  "overwhelmed", "remorseful", "shocked", "tired",
];

export const TRIGGERS = [
  "judged", "excluded", "criticized", "flooded", "ashamed",
  "lonely", "belittled", "disrespected", "powerless", "out of control",
];

export const SETUP = [
  "I've been very stressed and irritable lately",
  "I've not expressed much appreciation toward you lately",
  "I've taken you for granted",
  "I've been overly sensitive lately",
  "I've been overly critical lately",
  "I've not shared very much of my inner world",
  "I've not been emotionally available",
  "I've been turning away more",
  "I've been getting easily upset",
  "I've been depressed lately",
  "I've had a chip on my shoulder lately",
  "I've not been very affectionate",
  "I've not made time for good things between us",
  "I've not been a very good listener lately",
  "I've not asked for what I needed",
  "I've been feeling a bit like a martyr",
  "I've needed to be alone",
  "I've not wanted to take care of anybody",
  "I've been very preoccupied",
  "I haven't felt very much confidence in myself",
  "I've been running on empty",
];

export const APOLOGY = [
  "I over-reacted",
  "I was really grumpy",
  "I was defensive",
  "I was so negative",
];

export const STEPS = ["1", "2", "3", "4", "5", "H"] as const;

export const STEP_LABELS: Record<string, string> = {
  "1": "Feelings",
  "2": "Realities",
  "3": "Triggers",
  "4": "Responsibility",
  "5": "Plans",
  "H": "Horsemen",
};

export const HORSEMEN = [
  {
    name: "Criticism",
    description: "Verbal attacks on partner's personality or character.",
    antidote: "Gentle Start-Up",
    antidoteDesc: "Talk about your feelings. Express a positive need. Complain without blaming.",
  },
  {
    name: "Defensiveness",
    description: "Seeing self as the victim; reversing the blame.",
    antidote: "Take Responsibility",
    antidoteDesc: "Take responsibility, even if only for part of the conflict.",
  },
  {
    name: "Contempt",
    description: "Attacking partner's sense of self; they feel despised or worthless.",
    antidote: "Build a Culture of Appreciation",
    antidoteDesc: "Show respect and appreciation. Focus on what is good about them.",
  },
  {
    name: "Stonewalling",
    description: "Withdrawing; partner shuts down, walls off, doesn't respond.",
    antidote: "Physiological Self-Soothing",
    antidoteDesc: "Stop the conflict. Explain you need a break. Self-soothe, then reconnect.",
  },
];

export const STORAGE_KEY = "aftermath_v1";

export interface AftermathState {
  chips: Record<string, string[]>;
  fields: Record<string, string>;
  step: string;
}

export function loadState(): AftermathState {
  if (typeof window === "undefined") return { chips: {}, fields: {}, step: "1" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { chips: {}, fields: {}, step: "1" };
}

export function saveState(state: AftermathState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function buildExportText(state: AftermathState): string {
  const f = state.fields;
  const c = state.chips;
  const lines: string[] = [];
  lines.push("AFTERMATH OF A FIGHT");
  lines.push("Date: " + new Date().toLocaleString());
  lines.push("");
  lines.push("STEP 1 — FEELINGS");
  lines.push("I felt: " + ((c.feelings || []).join(", ") || "—"));
  if (f.f_other) lines.push("Other: " + f.f_other);
  lines.push("");
  lines.push("STEP 3 — TRIGGERS");
  lines.push("Triggered feelings: " + ((c.triggers || []).join(", ") || "—"));
  lines.push("My story: " + (f.t_story || "—"));
  lines.push("Enduring vulnerabilities: " + (f.t_vuln || "—"));
  lines.push("");
  lines.push("STEP 4 — RESPONSIBILITY");
  lines.push("What set me up: " + ((c.setup || []).join("; ") || "—"));
  lines.push("My contribution: " + (f.re_regret || "—"));
  lines.push("I'm sorry that: " + ((c.apology || []).join("; ") || "—"));
  if (f.re_apology) lines.push("Also sorry for: " + f.re_apology);
  lines.push("Still need: " + (f.re_still_need || "—"));
  lines.push("");
  lines.push("STEP 5 — PLAN");
  lines.push("Partner can: " + (f.p_partner || "—"));
  lines.push("I can: " + (f.p_me || "—"));
  lines.push("To move on I need: " + (f.p_move_on || "—"));
  return lines.join("\n");
}
