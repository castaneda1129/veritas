"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/store";
import { useToast } from "@/components/ToastProvider";
import Header from "@/components/Header";
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/constants";

export default function SubmitPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Prompting");
  const [submitted, setSubmitted] = useState(false);

  const isValid = title.trim().length > 0 && content.trim().length >= 20;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    createPost(title.trim(), content.trim(), category);
    setSubmitted(true);
    showToast("Post published! The community can now verify it.", "success");
    setTimeout(() => router.push("/"), 1200);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-6">
          <div className="animate-fade-in-up flex flex-col items-center justify-center py-24">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-3xl text-accent">
              &#10003;
            </div>
            <h2 className="mb-2 text-xl font-bold text-foreground">Published!</h2>
            <p className="font-mono text-sm text-muted">Redirecting to feed...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-8">
          <h1 className="text-gradient text-3xl font-extrabold tracking-tight">
            Submit Knowledge
          </h1>
          <p className="mt-2 text-sm text-muted">
            Share an AI technique. The community will verify it.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-card-border bg-card-bg p-6"
        >
          {/* Title */}
          <div>
            <label className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-widest text-muted">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A clear, concise title for the technique"
              className="w-full rounded-lg border border-card-border bg-background px-4 py-3 text-[15px] font-medium text-foreground placeholder:text-muted/40 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-widest text-muted">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
                    category === cat
                      ? CATEGORY_COLORS[cat]
                      : "border-card-border text-muted hover:border-muted/50 hover:bg-card-hover"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="font-mono text-[10px] font-semibold uppercase tracking-widest text-muted">
                Content
              </label>
              <span
                className={`font-mono text-[10px] ${
                  content.trim().length >= 20 ? "text-accent" : "text-muted/50"
                }`}
              >
                {Math.min(content.trim().length, 20)}/20
              </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe the technique in detail. What does it do? How should someone use it? Why does it work?"
              rows={6}
              className="w-full resize-none rounded-lg border border-card-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted/40 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20"
            />
            <div className="mt-1.5 h-0.5 w-full overflow-hidden rounded-full bg-card-border/50">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  content.trim().length >= 20 ? "bg-accent" : "bg-muted/40"
                }`}
                style={{ width: `${Math.min((content.trim().length / 20) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between border-t border-card-border/60 pt-5">
            <p className="text-[11px] text-muted/50">
              Others will verify this by trying it out.
            </p>
            <button
              type="submit"
              disabled={!isValid}
              className="rounded-lg bg-accent px-6 py-2.5 font-mono text-sm font-bold text-background transition-all hover:bg-accent-dim hover:shadow-[0_0_20px_-4px_rgba(0,229,176,0.4)] disabled:cursor-not-allowed disabled:opacity-20 disabled:hover:shadow-none"
            >
              Publish
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
