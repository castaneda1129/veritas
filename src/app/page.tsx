"use client";

import { useEffect, useState } from "react";
import { Post } from "@/lib/types";
import { getPosts } from "@/lib/store";
import Header from "@/components/Header";
import KnowledgeCard from "@/components/KnowledgeCard";

function getActivitySummary(posts: Post[]) {
  const totalVerifications = posts.reduce((sum, p) => sum + p.verifications.length, 0);
  const totalBookmarks = posts.reduce((sum, p) => sum + p.bookmarks.length, 0);
  const totalRecs = posts.reduce((sum, p) => sum + p.recommendations.length, 0);
  return { totalVerifications, totalBookmarks, totalRecs, postCount: posts.length };
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPosts(getPosts());
    setMounted(true);
  }, []);

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

        {posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-card-border bg-card-bg p-12 text-center">
            <div className="mb-3 text-4xl">&#128161;</div>
            <p className="font-mono text-sm text-muted">No posts yet. Be the first to share something.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post, i) => (
              <KnowledgeCard key={post.id} post={post} onUpdate={setPosts} rank={i + 1} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
