"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Post, Verification } from "@/lib/types";
import {
  getPostById,
  getPosts,
  toggleBookmark,
  addVerification,
  toggleRecommendation,
  isBookmarked,
  isRecommended,
  hasUserVerified,
  markUserVerified,
} from "@/lib/store";
import { useToast } from "@/components/ToastProvider";
import Header from "@/components/Header";
import VerifyModal from "@/components/VerifyModal";
import VerificationBar from "@/components/VerificationBar";

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const RESULT_LABELS: Record<Verification["result"], { label: string; color: string; icon: string }> = {
  worked: { label: "Worked", color: "text-success", icon: "\u2713" },
  partially_worked: { label: "Partial", color: "text-warning", icon: "\u223C" },
  didnt_work: { label: "Didn't Work", color: "text-danger", icon: "\u2717" },
};

export default function KnowledgeDetailPage() {
  const params = useParams();
  const { showToast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const id = params.id as string;

  useEffect(() => {
    setPost(getPostById(id));
    setMounted(true);
  }, [id]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent/20 border-t-accent"></div>
          <span className="font-mono text-xs text-muted">Loading...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-6">
          <div className="rounded-xl border border-dashed border-card-border bg-card-bg p-12 text-center">
            <div className="mb-3 text-4xl">&#128566;</div>
            <p className="mb-4 font-mono text-sm text-muted">Post not found.</p>
            <Link href="/" className="font-mono text-sm text-accent hover:text-accent-dim">
              &larr; Back to Feed
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const bookmarked = isBookmarked(post);
  const recommended = isRecommended(post);
  const verified = hasUserVerified(post);

  function refreshPost() {
    setPost(getPostById(id));
  }

  function handleBookmark() {
    const wasBookmarked = bookmarked;
    toggleBookmark(post!.id);
    refreshPost();
    showToast(wasBookmarked ? "Removed from saved" : "Saved for later", "success");
  }

  function handleVerify(model: string, result: Verification["result"], comment: string) {
    markUserVerified(post!.id);
    addVerification(post!.id, model, result, comment);
    refreshPost();
    setShowModal(false);
    showToast("Verification submitted", "success");
  }

  function handleRecommend() {
    if (!verified) return;
    const wasRecommended = recommended;
    toggleRecommendation(post!.id);
    refreshPost();
    showToast(wasRecommended ? "Recommendation removed" : "Recommended!", "success");
  }

  // Group verifications by model
  const modelGroups: Record<string, Verification[]> = {};
  for (const v of post.verifications) {
    if (!modelGroups[v.model]) modelGroups[v.model] = [];
    modelGroups[v.model].push(v);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-6">
        {/* Back link */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 font-mono text-xs text-muted transition hover:text-accent"
        >
          &larr; Back to Feed
        </Link>

        {/* Post content */}
        <div className="animate-fade-in-up rounded-2xl border border-card-border bg-card-bg p-6">
          {/* Meta row */}
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full bg-purple/10 px-2 py-0.5 font-mono text-[10px] font-medium text-purple">
              {post.category}
            </span>
            <span className="flex items-center gap-1 font-mono text-[10px] text-muted/60">
              <span className="inline-block h-1 w-1 rounded-full bg-muted/40"></span>
              {timeAgo(post.createdAt)}
            </span>
          </div>

          {/* Title */}
          <h1 className="mb-4 text-xl font-bold leading-snug tracking-tight text-foreground">
            {post.title}
          </h1>

          {/* Full content */}
          <p className="mb-6 whitespace-pre-wrap text-sm leading-relaxed text-muted/80">
            {post.content}
          </p>

          {/* Action buttons */}
          <div className="flex gap-2 border-t border-card-border/60 pt-4">
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                bookmarked
                  ? "bg-warning/10 text-warning shadow-[inset_0_0_0_1px_rgba(255,194,51,0.2)]"
                  : "text-muted hover:bg-card-hover hover:text-warning"
              }`}
            >
              <span className="text-sm">{bookmarked ? "\u2605" : "\u2606"}</span>
              Save
            </button>

            <button
              onClick={() => setShowModal(true)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                verified
                  ? "bg-success/10 text-success shadow-[inset_0_0_0_1px_rgba(0,229,176,0.2)]"
                  : "text-muted hover:bg-accent/5 hover:text-accent"
              }`}
            >
              <span className="text-sm">{verified ? "\u2713" : "\u26A1"}</span>
              {verified ? "Verified" : "Verify"}
            </button>

            <button
              onClick={handleRecommend}
              disabled={!verified}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                recommended
                  ? "bg-accent/10 text-accent shadow-[inset_0_0_0_1px_rgba(0,229,176,0.2)]"
                  : verified
                    ? "text-muted hover:bg-accent/5 hover:text-accent"
                    : "cursor-not-allowed text-muted/20"
              }`}
              title={!verified ? "Verify first to recommend" : ""}
            >
              <span className="text-sm">{recommended ? "\u25B2" : "\u25B3"}</span>
              Rec
            </button>
          </div>
        </div>

        {/* Verification section */}
        <div className="mt-6">
          <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-widest text-muted">
            Verifications ({post.verifications.length})
          </h2>

          {post.verifications.length > 0 ? (
            <>
              {/* Summary bar */}
              <div className="mb-4 rounded-xl border border-card-border bg-card-bg p-4">
                <VerificationBar verifications={post.verifications} showLabels />
              </div>

              {/* Model breakdown */}
              {Object.keys(modelGroups).length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {Object.entries(modelGroups).map(([model, verifs]) => {
                    const worked = verifs.filter((v) => v.result === "worked").length;
                    const total = verifs.length;
                    return (
                      <div
                        key={model}
                        className="rounded-lg border border-card-border bg-card-bg px-3 py-2"
                      >
                        <span className="font-mono text-[11px] font-semibold text-foreground">{model}</span>
                        <span className="ml-2 font-mono text-[10px] text-muted">
                          {worked}/{total} worked
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Individual verifications */}
              <div className="space-y-3">
                {post.verifications.map((v) => {
                  const resultInfo = RESULT_LABELS[v.result];
                  return (
                    <div
                      key={v.id}
                      className="rounded-xl border border-card-border bg-card-bg p-4"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span className="rounded-md bg-card-hover px-2 py-0.5 font-mono text-[11px] font-medium text-foreground">
                          {v.model}
                        </span>
                        <span className={`font-mono text-[11px] font-semibold ${resultInfo.color}`}>
                          {resultInfo.icon} {resultInfo.label}
                        </span>
                        <span className="ml-auto font-mono text-[10px] text-muted/50">
                          {timeAgo(v.createdAt)}
                        </span>
                      </div>
                      <p className="text-[13px] leading-relaxed text-muted/70">{v.comment}</p>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-card-border bg-card-bg p-8 text-center">
              <div className="mb-2 text-2xl">&#9889;</div>
              <p className="font-mono text-sm text-muted">
                No verifications yet. Be the first to test this technique.
              </p>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <VerifyModal postTitle={post.title} onSubmit={handleVerify} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
