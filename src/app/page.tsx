"use client";

import { useEffect, useMemo, useState } from "react";
import { Post } from "@/lib/types";
import { getPosts } from "@/lib/store";
import Header from "@/components/Header";
import KnowledgeCard from "@/components/KnowledgeCard";
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/constants";

function getActivitySummary(posts: Post[]) {
  const totalVerifications = posts.reduce((sum, p) => sum + p.verifications.length, 0);
  const totalBookmarks = posts.reduce((sum, p) => sum + p.bookmarks.length, 0);
  const totalRecs = posts.reduce((sum, p) => sum + p.recommendations.length, 0);
  return { totalVerifications, totalBookmarks, totalRecs, postCount: posts.length };
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");

  useEffect(() => {
    setPosts(getPosts());
    setMounted(true);
  }, []);

  const filtered = useMemo(() => {
    return posts
      .filter((p) => activeCategory === "All" || p.category === activeCategory)
      .sort((a, b) => {
        if (sortBy === "popular") {
          const scoreA = a.verifications.length + a.recommendations.length + a.bookmarks.length;
          const scoreB = b.verifications.length + b.recommendations.length + b.bookmarks.length;
          return scoreB - scoreA;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [posts, activeCategory, sortBy]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent/20 border-t-accent"></div>
          <span className="font-mono text-xs text-muted">Loading feed...</span>
        </div>
      </div>
    );
  }

  const activity = getActivitySummary(posts);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-6">
        {/* Hero section */}
        <div className="mb-8">
          <h1 className="text-gradient text-3xl font-extrabold tracking-tight sm:text-4xl">
            Knowledge Feed
          </h1>
          <p className="mt-2 text-sm text-muted">
            AI techniques verified by real people, right now.
          </p>

          {/* Activity bar */}
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-card-border/60 bg-card-bg/50 px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent"></span>
              </span>
              <span className="font-mono text-[11px] text-muted">
                <span className="font-bold text-foreground">{activity.postCount}</span> posts
              </span>
            </div>
            <span className="text-card-border">|</span>
            <span className="font-mono text-[11px] text-muted">
              <span className="font-bold text-blue">{activity.totalVerifications}</span> verifications
            </span>
            <span className="text-card-border">|</span>
            <span className="font-mono text-[11px] text-muted">
              <span className="font-bold text-accent">{activity.totalRecs}</span> recommendations
            </span>
            <span className="text-card-border">|</span>
            <span className="font-mono text-[11px] text-muted">
              <span className="font-bold text-warning">{activity.totalBookmarks}</span> saves
            </span>
          </div>
        </div>

        {/* Filter & Sort bar */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveCategory("All")}
              className={`rounded-lg border px-2.5 py-1.5 font-mono text-[11px] font-semibold transition-all duration-200 ${
                activeCategory === "All"
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-card-border text-muted hover:border-muted/50 hover:bg-card-hover"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg border px-2.5 py-1.5 font-mono text-[11px] font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? CATEGORY_COLORS[cat]
                    : "border-card-border text-muted hover:border-muted/50 hover:bg-card-hover"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="ml-auto flex gap-1">
            <button
              onClick={() => setSortBy("recent")}
              className={`rounded-lg px-2.5 py-1.5 font-mono text-[11px] transition-all duration-200 ${
                sortBy === "recent"
                  ? "bg-card-hover font-semibold text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              New
            </button>
            <button
              onClick={() => setSortBy("popular")}
              className={`rounded-lg px-2.5 py-1.5 font-mono text-[11px] transition-all duration-200 ${
                sortBy === "popular"
                  ? "bg-card-hover font-semibold text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Popular
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-card-border bg-card-bg p-12 text-center">
            <div className="mb-3 text-4xl">&#128161;</div>
            <p className="font-mono text-sm text-muted">
              {posts.length === 0
                ? "No posts yet. Be the first to share something."
                : `No posts in ${activeCategory} yet.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post, i) => (
              <KnowledgeCard key={post.id} post={post} onUpdate={setPosts} rank={i + 1} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
