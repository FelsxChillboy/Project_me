"use client";

import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  function getUrl() {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/berita/${slug}`;
    }
    return `/berita/${slug}`;
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  }

  function openShare(platform: "wa" | "x") {
    const url = encodeURIComponent(getUrl());
    const text = encodeURIComponent(title);
    const shareUrl =
      platform === "wa"
        ? `https://wa.me/?text=${text}%20${url}`
        : `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mt-8 flex flex-wrap items-center gap-2.5 border-t border-[#D8D1C3] pt-6 text-sm">
      <span className="inline-flex items-center gap-1.5 font-medium text-[#475467]">
        <Share2 className="h-4 w-4 text-[#1E3A5F]" aria-hidden="true" />
        Bagikan tulisan:
      </span>
      <button
        type="button"
        onClick={() => openShare("wa")}
        className="min-h-11 rounded-md bg-[#166534] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#14532d]"
      >
        WhatsApp
      </button>
      <button
        type="button"
        onClick={() => openShare("x")}
        className="min-h-11 rounded-md bg-[#14263D] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E3A5F]"
      >
        X / Twitter
      </button>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-[#8C8272] bg-[#FFFDF9] px-3.5 py-2 text-xs font-semibold text-[#14263D] transition-colors hover:bg-[#EFECE4]"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-[#166534]" aria-hidden="true" />
            Tautan Tersalin
          </>
        ) : (
          <>
            <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
            Salin Tautan
          </>
        )}
      </button>
    </div>
  );
}
