"use client";

import { useState } from "react";
import { Post } from "@/lib/types";
import {
  toggleBookmark,
  addVerification,
  toggleRecommendation,
  isBookmarked,
  isRecommended,
  hasUserVerified,
  markUserVerified,
} from "@/lib/store";
import { Verification } from "@/lib/types";
import VerifyModal from "./VerifyModal";

interface KnowledgeCardProps {
  post: Post;
  onUpdate: (posts: Post[]) => void;
  rank: number;
}

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

function getMomentumLevel(post: Post): "hot" | "rising" | "warm" | null {
  const total = post.verifications.length + post.recommendations.length + post.bookmarks.length;
  if (total >= 6) return "hot";
  if (total >= 3) return "rising";
  if (total >= 1) return "warm";
  return null;
}

export default function KnowledgeCard({ post, onUpdate, rank }: KnowledgeCardProps) {
  const [showModal, setShowModal] = useState(false);
  const bookmarked = isBookmarked(post);
  const recommended = isRecommended(post);
  const verified = hasUserVerified(post);

  const momentum = getMomentumLevel(post);
  const triedCount = post.verifications.length;
  const recommendedCount = post.recommendations.length;
  const bookmarkedCount = post.bookmarks.length;

  function handleBookmark() {
    onUpdate(toggleBookmark(post.id));
  }

  function handleVerify(model: string, result: Verification["result"], comment: string) {
    markUserVerified(post.id);
    onUpdate(addVerification(post.id, model, result, comment));
    setShowModal(false);
  }

  function handleRecommend() {
    if (!verified) return;
    onUpdate(toggleRecommendation(post.id));
  }

  const isHot = momentum === "hot";

  return (
    <>
      <div
        className={`card-enter group relative rounded-xl border p-5 transition-all duration-300 ${
          isHot
            ? "border-hot/20 bg-gradient-to-br from-card-bg to-hot/[0.03] hover:border-hot/40 hover:shadow-[0_0_30px_-8px_rgba(255,107,53,0.15)]"
            : momentum === "rising"
              ? "border-accent/15 bg-gradient-to-br from-card-bg to-accent/[0.02] hover:border-accent/30 hover:shadow-[0_0_30px_-8px_rgba(0,229,176,0.1)]"
              : "border-card-border bg-card-bg hover:border-card-border hover:bg-card-hover"
        }`}
      >
        {/* Top row: rank + badges + time */}
        <div className="mb-3 flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-muted/40">#{rank}</span>

          {momentum === "hot" && (
            <span className="badge-hot inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              HOT
            </span>
          )}
          {momentum === "rising" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
              RISING
            </span>
          )}

          <span className="rounded-full bg-purple/10 px-2 py-0.5 font-mono text-[10px] font-medium text-purple">
            {post.category}
          </span>

          <span className="ml-auto flex items-center gap-1 font-mono text-[10px] text-muted/60">
            <span className="inline-block h-1 w-1 rounded-full bg-muted/40"></span>
            {timeAgo(post.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`mb-2 text-[15px] font-semibold leading-snug tracking-tight transition-colors ${
            isHot
              ? "text-foreground group-hover:text-hot"
              : "text-foreground group-hover:text-accent"
          }`}
        >
          {post.title}
        </h3>

        {/* Content */}
        <p className="mb-4 text-[13px] leading-relaxed text-muted/80 line-clamp-2">
          {post.content}
        </p>

        {/* Stats bar */}
        <div className="mb-4 flex items-center gap-4">
          <StatPill
            icon="&#9889;"
            count={triedCount}
            label="tried"
            active={triedCount > 0}
            color="text-blue"
            bgColor="bg-blue/8"
          />
          <StatPill
            icon="&#9650;"
            count={recommendedCount}
            label="rec"
            active={recommendedCount > 0}
            color="text-accent"
            bgColor="bg-accent/8"
          />
          <StatPill
            icon="&#9733;"
            count={bookmarkedCount}
            label="saved"
            active={bookmarkedCount > 0}
            color="text-warning"
            bgColor="bg-warning/8"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-card-border/60 pt-3">
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

      {showModal && (
        <VerifyModal postTitle={post.title} onSubmit={handleVerify} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

function StatPill({
  icon,
  count,
  label,
  active,
  color,
  bgColor,
}: {
  icon: string;
  count: number;
  label: string;
  active: boolean;
  color: string;
  bgColor: string;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[11px] transition ${
        active ? `${bgColor} ${color}` : "text-muted/40"
      }`}
    >
      <span dangerouslySetInnerHTML={{ __html: icon }} />
      <span className="font-bold tabular-nums">{count}</span>
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
}
