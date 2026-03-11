"use client";

import { Verification } from "@/lib/types";

interface VerificationBarProps {
  verifications: Verification[];
  showLabels?: boolean;
}

export default function VerificationBar({ verifications, showLabels = false }: VerificationBarProps) {
  if (verifications.length === 0) return null;

  const worked = verifications.filter((v) => v.result === "worked").length;
  const partial = verifications.filter((v) => v.result === "partially_worked").length;
  const failed = verifications.filter((v) => v.result === "didnt_work").length;
  const total = verifications.length;

  return (
    <div>
      <div className="flex h-1.5 w-full overflow-hidden rounded-full">
        {worked > 0 && (
          <div
            className="bg-success transition-all duration-300"
            style={{ width: `${(worked / total) * 100}%`, minWidth: "2px" }}
          />
        )}
        {partial > 0 && (
          <div
            className="bg-warning transition-all duration-300"
            style={{ width: `${(partial / total) * 100}%`, minWidth: "2px" }}
          />
        )}
        {failed > 0 && (
          <div
            className="bg-danger transition-all duration-300"
            style={{ width: `${(failed / total) * 100}%`, minWidth: "2px" }}
          />
        )}
      </div>
      {showLabels && (
        <div className="mt-1.5 flex gap-3 font-mono text-[10px]">
          {worked > 0 && <span className="text-success">{worked} worked</span>}
          {partial > 0 && <span className="text-warning">{partial} partial</span>}
          {failed > 0 && <span className="text-danger">{failed} failed</span>}
        </div>
      )}
    </div>
  );
}
