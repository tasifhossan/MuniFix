"use client";

import React, { useState, useEffect } from "react";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { toggleVote } from "@/lib/api";

interface VoteSectionProps {
  complaintId: string;
  initialUpvotes?: number;
  initialDownvotes?: number;
  initialUserVote?: "upvote" | "downvote" | 1 | -1 | null;
}

export default function VoteSection({
  complaintId,
  initialUpvotes = 0,
  initialDownvotes = 0,
  initialUserVote = null,
}: VoteSectionProps) {
  const parseInitialVote = (vote: any): "upvote" | "downvote" | null => {
    if (vote === 1 || vote === "upvote") return "upvote";
    if (vote === -1 || vote === "downvote") return "downvote";
    return null;
  };

  const [upvotes, setUpvotes] = useState<number>(initialUpvotes);
  const [downvotes, setDownvotes] = useState<number>(initialDownvotes);
  const [userVote, setUserVote] = useState<"upvote" | "downvote" | null>(
    parseInitialVote(initialUserVote)
  );
  const [loading, setLoading] = useState(false);

  // Sync state with props on data refresh or load
  useEffect(() => {
    setUpvotes(initialUpvotes);
    setDownvotes(initialDownvotes);
    setUserVote(parseInitialVote(initialUserVote));
  }, [initialUpvotes, initialDownvotes, initialUserVote]);

  const handleVote = async (type: "upvote" | "downvote") => {
    if (loading) return;

    const previousVote = userVote;
    const previousUpvotes = upvotes;
    const previousDownvotes = downvotes;

    let newVote: "upvote" | "downvote" | null = userVote === type ? null : type;
    let newUpvotes = upvotes;
    let newDownvotes = downvotes;

    // Calculate optimistic counts
    if (type === "upvote") {
      if (previousVote === "upvote") {
        newUpvotes = Math.max(0, newUpvotes - 1);
      } else {
        newUpvotes += 1;
        if (previousVote === "downvote") {
          newDownvotes = Math.max(0, newDownvotes - 1);
        }
      }
    } else {
      if (previousVote === "downvote") {
        newDownvotes = Math.max(0, newDownvotes - 1);
      } else {
        newDownvotes += 1;
        if (previousVote === "upvote") {
          newUpvotes = Math.max(0, newUpvotes - 1);
        }
      }
    }

    setUserVote(newVote);
    setUpvotes(newUpvotes);
    setDownvotes(newDownvotes);
    setLoading(true);

    try {
      const res = await toggleVote(complaintId, type);
      const returnedUpvote = res.upvote_count;
      const returnedDownvote = res.downvote_count;
      const rawVote = res.user_vote;

      if (typeof returnedUpvote === "number") {
        setUpvotes(returnedUpvote);
      }
      if (typeof returnedDownvote === "number") {
        setDownvotes(returnedDownvote);
      }
      setUserVote(parseInitialVote(rawVote));
    } catch (err) {
      setUserVote(previousVote);
      setUpvotes(previousUpvotes);
      setDownvotes(previousDownvotes);
      console.error("Failed to register vote:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2 w-fit">
      {/* Upvote Button Badge */}
      <button
        onClick={() => handleVote("upvote")}
        disabled={loading}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-bold transition-all shadow-2xs active:scale-[0.98] cursor-pointer disabled:opacity-50 ${
          userVote === "upvote"
            ? "bg-teal-50 border-brand-teal/30 text-brand-teal"
            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
        }`}
        aria-label="Upvote"
      >
        <ArrowBigUp className={`w-4 h-4 ${userVote === "upvote" ? "fill-current text-brand-teal" : "text-slate-400"}`} />
        <span>Upvotes ({upvotes})</span>
      </button>

      {/* Downvote Button Badge */}
      <button
        onClick={() => handleVote("downvote")}
        disabled={loading}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-bold transition-all shadow-2xs active:scale-[0.98] cursor-pointer disabled:opacity-50 ${
          userVote === "downvote"
            ? "bg-rose-50 border-rose-200 text-rose-600"
            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
        }`}
        aria-label="Downvote"
      >
        <ArrowBigDown className={`w-4 h-4 ${userVote === "downvote" ? "fill-current text-rose-500" : "text-slate-400"}`} />
        <span>Downvotes ({downvotes})</span>
      </button>
    </div>
  );
}