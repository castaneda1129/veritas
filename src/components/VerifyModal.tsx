"use client";

import { useState } from "react";
import { Verification } from "@/lib/types";

interface VerifyModalProps {
  postTitle: string;
  onSubmit: (model: string, result: Verification["result"], comment: string) => void;
  onClose: () => void;
}

const RESULT_OPTIONS: { value: Verification["result"]; label: string; icon: string; activeClass: string }[] = [
  {
    value: "worked",
    label: "Worked",
    icon: "\u2713",
    activeClass: "border-success/50 bg-success/10 text-success shadow-[0_0_12px_-4px_rgba(0,229,176,0.3)]",
  },
  {
    value: "partially_worked",
    label: "Partial",
    icon: "\u223C",
    activeClass: "border-warning/50 bg-warning/10 text-warning shadow-[0_0_12px_-4px_rgba(255,194,51,0.3)]",
  },
  {
    value: "didnt_work",
    label: "Didn't Work",
    icon: "\u2717",
    activeClass: "border-danger/50 bg-danger/10 text-danger shadow-[0_0_12px_-4px_rgba(255,77,106,0.3)]",
  },
];

export default function VerifyModal({ postTitle, onSubmit, onClose }: VerifyModalProps) {
  const [model, setModel] = useState("");
  const [result, setResult] = useState<Verification["result"] | null>(null);
  const [comment, setComment] = useState("");

  const isValid = model.trim() && result !== null && comment.trim().length >= 50;
  const progress = Math.min(comment.trim().length, 50);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || result === null) return;
    onSubmit(model.trim(), result, comment.trim());
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-slide-in w-full max-w-lg rounded-2xl border border-card-border bg-card-bg p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-sm text-accent">
              &#9889;
            </div>
            <h2 className="font-mono text-base font-bold text-foreground">Verify Knowledge</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition hover:bg-card-hover hover:text-foreground"
          >
            &times;
          </button>
        </div>

        <div className="mb-5 rounded-lg bg-background/60 px-3 py-2">
          <p className="text-[13px] font-medium text-foreground">&ldquo;{postTitle}&rdquo;</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Model */}
          <div>
            <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-widest text-muted">
              Model Used
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. Claude Sonnet 4, GPT-4o, Gemini Pro"
              className="w-full rounded-lg border border-card-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted/40 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20"
            />
          </div>

          {/* Result */}
          <div>
            <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-widest text-muted">
              Result
            </label>
            <div className="grid grid-cols-3 gap-2">
              {RESULT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setResult(opt.value)}
                  className={`flex flex-col items-center gap-1 rounded-lg border px-3 py-3 text-xs font-medium transition-all duration-200 ${
                    result === opt.value
                      ? opt.activeClass
                      : "border-card-border text-muted hover:border-muted/50 hover:bg-card-hover"
                  }`}
                >
                  <span className="text-base">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted">
                Your Experience
              </label>
              <span className={`font-mono text-[10px] ${progress >= 50 ? "text-accent" : "text-muted/50"}`}>
                {progress}/50
              </span>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What happened when you tried this? Be specific about context and outcome..."
              rows={4}
              className="w-full resize-none rounded-lg border border-card-border bg-background px-3 py-2.5 text-sm leading-relaxed text-foreground placeholder:text-muted/40 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20"
            />
            {/* Progress bar */}
            <div className="mt-1.5 h-0.5 w-full overflow-hidden rounded-full bg-card-border/50">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  progress >= 50 ? "bg-accent" : "bg-muted/40"
                }`}
                style={{ width: `${(progress / 50) * 100}%` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-card-border/60 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-muted transition hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="rounded-lg bg-accent px-5 py-2 font-mono text-sm font-semibold text-background transition-all hover:bg-accent-dim hover:shadow-[0_0_20px_-4px_rgba(0,229,176,0.4)] disabled:cursor-not-allowed disabled:opacity-20 disabled:hover:shadow-none"
            >
              Submit Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
