export const CATEGORIES = ["Prompting", "Technique", "Tool", "Workflow", "Other"] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  Prompting: "border-purple/40 bg-purple/10 text-purple",
  Technique: "border-blue/40 bg-blue/10 text-blue",
  Tool: "border-accent/40 bg-accent/10 text-accent",
  Workflow: "border-warning/40 bg-warning/10 text-warning",
  Other: "border-muted/40 bg-muted/10 text-muted",
};
