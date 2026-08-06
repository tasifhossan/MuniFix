"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Send, Trash2, Loader2, Image, X, ThumbsUp, ThumbsDown, Pin, PinOff } from "lucide-react";
import { getComments, addComment, deleteComment, toggleCommentVote, pinComment, Comment } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";

interface CommentSectionProps {
  complaintId: string;
}

interface InteractiveComment extends Comment {
  upvotes: number;
  downvotes: number;
  userVote: "upvote" | "downvote" | null;
}

export default function CommentSection({ complaintId }: CommentSectionProps) {
  const { user } = useAuth();
  const currentUserId = user?.id;
  const isAdmin = user?.role === "super_admin" || user?.role === "dept_admin";

  const [comments, setComments] = useState<InteractiveComment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Image Upload states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { socket } = useSocket();

  useEffect(() => {
    fetchComments();
    return () => {
      // Clean up object URL on unmount
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [complaintId]);

  useEffect(() => {
    if (!socket || !complaintId) return;

    const handleNewCommentEvent = (data: any) => {
      console.log("[Socket] Live new comment received:", data);
      setComments((prev) => {
        if (prev.some((c) => c.id === data.id)) {
          return prev;
        }
        return [data, ...prev];
      });
    };

    const handleCommentVotedEvent = (data: any) => {
      console.log("[Socket] Live comment vote received:", data);
      setComments((prev) =>
        prev.map((c) =>
          c.id === data.comment_id
            ? {
                ...c,
                upvote_count: data.upvote_count,
                downvote_count: data.downvote_count,
              }
            : c
        )
      );
    };

    socket.on("new_comment", handleNewCommentEvent);
    socket.on("comment_voted", handleCommentVotedEvent);

    return () => {
      socket.off("new_comment", handleNewCommentEvent);
      socket.off("comment_voted", handleCommentVotedEvent);
    };
  }, [socket, complaintId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getComments(complaintId);
      let rawComments: Comment[] = [];
      if (data && Array.isArray(data.data)) {
        rawComments = data.data;
      } else if (Array.isArray(data)) {
        rawComments = data;
      } else if (data && Array.isArray(data.comments)) {
        rawComments = data.comments;
      } else {
        rawComments = [];
      }

      const mapped: InteractiveComment[] = rawComments.map((c) => {
        // Seed mock upvotes/downvotes deterministically using the comment id
        const commentIdString = c.id ? String(c.id) : "";
        const seed = commentIdString.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const upvotes = (seed % 6); // 0 to 5 upvotes
        const downvotes = (seed % 2); // 0 to 1 downvotes
        return {
          ...c,
          upvotes,
          downvotes,
          userVote: null,
        };
      });
      setComments(mapped);
    } catch (err) {
      console.error("Error loading comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Revoke old URL if it exists
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !selectedImage) return;

    try {
      setSubmitting(true);
      const res = await addComment(complaintId, text.trim(), selectedImage);
      if (res && res.success && res.data) {
        // Hydrate details that the insert query RETURNING statement lacks
        const newCommentObj: InteractiveComment = {
          ...res.data,
          author_id: user?.id || "",
          author_name: user?.name || "Citizen",
          author_role: user?.role || "citizen",
          upvotes: 0,
          downvotes: 0,
          userVote: null,
        };
        setComments((prev) => [newCommentObj, ...prev]);
        setText("");
        handleClearImage();
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(complaintId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  const handleTogglePin = async (commentId: string, currentPinStatus: boolean) => {
    try {
      const newPinStatus = !currentPinStatus;
      const res = await pinComment(commentId, newPinStatus);
      if (res && res.success) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === commentId ? { ...c, is_pinned: newPinStatus } : c
          )
        );
      }
    } catch (err) {
      console.error("Failed to pin comment:", err);
    }
  };

  const handleVote = (commentId: string, type: "upvote" | "downvote") => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id !== commentId) return comment;

        const currentVote = comment.userVote;
        let newVote: "upvote" | "downvote" | null = currentVote === type ? null : type;
        let newUpvotes = comment.upvotes;
        let newDownvotes = comment.downvotes;

        if (type === "upvote") {
          if (currentVote === "upvote") {
            newUpvotes = Math.max(0, newUpvotes - 1);
          } else {
            newUpvotes += 1;
            if (currentVote === "downvote") {
              newDownvotes = Math.max(0, newDownvotes - 1);
            }
          }
        } else {
          if (currentVote === "downvote") {
            newDownvotes = Math.max(0, newDownvotes - 1);
          } else {
            newDownvotes += 1;
            if (currentVote === "upvote") {
              newUpvotes = Math.max(0, newUpvotes - 1);
            }
          }
        }

        return {
          ...comment,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          userVote: newVote,
        };
      })
    );
  };

  // Sort comments: top score (upvotes - downvotes) first, fall back to created_at descending
  const sortedComments = [...comments].sort((a, b) => {
    const scoreA = a.upvotes - a.downvotes;
    const scoreB = b.upvotes - b.downvotes;
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="pt-6 border-t border-gray-150 space-y-4">
      <div className="flex items-center space-x-2 text-gray-800">
        <MessageSquare className="w-4 h-4 text-brand-teal stroke-[2.5]" />
        <h3 className="font-extrabold text-sm tracking-tight">
          Discussion & Comments ({comments.length})
        </h3>
      </div>

      {/* Input Field with Image Attachment Preview */}
      <form onSubmit={handlePost} className="space-y-2">
        {imagePreview && (
          <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shadow-2xs shrink-0">
            <img src={imagePreview} className="w-full h-full object-cover" alt="Upload preview" />
            <button
              type="button"
              onClick={handleClearImage}
              className="absolute top-1 right-1 p-0.5 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment or update..."
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-gray-205 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-brand-teal font-medium"
          />

          {/* Image File Selector Button */}
          <label className="flex items-center justify-center p-2.5 rounded-xl border border-gray-205 bg-white hover:bg-slate-50 cursor-pointer transition-all active:scale-[0.98]" title="Attach an image">
            <Image className="w-4 h-4 text-gray-400" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>

          <button
            type="submit"
            disabled={submitting || (!text.trim() && !selectedImage)}
            className="bg-brand-teal hover:bg-brand-teal-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            {submitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Comment List */}
      {loading ? (
        <div className="flex items-center justify-center py-6 text-gray-400 text-xs font-bold gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-brand-teal" />
          <span>Loading discussion...</span>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-6 bg-slate-50/50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-xs text-gray-400 font-semibold">
            No comments yet. Be the first to comment on this issue.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {sortedComments.map((comment, index) => {
            const commentId = comment.id;
            const authorName = comment.author_name || "Citizen";
            const authorId = comment.author_id;
            const commentText = comment.content || "";
            const createdAt = comment.created_at || new Date().toISOString();
            const isPinned = comment.is_pinned === true;
            
            // Highlight the comment with the highest score if that score is positive (> 0)
            const isMostHelpful = index === 0 && (comment.upvotes - comment.downvotes) > 0;

            // Check delete authorization (Author or Admin)
            const canDelete =
              currentUserId &&
              (authorId === currentUserId ||
                user?.role === "super_admin" ||
                user?.role === "dept_admin");

            const userVote = comment.user_vote;

            return (
              <div
                key={commentId}
                className={`p-3.5 rounded-2xl border flex justify-between items-start gap-3 transition-all ${
                  isMostHelpful
                    ? "bg-gradient-to-br from-emerald-50/20 via-white to-white border-emerald-200 shadow-xs ring-1 ring-emerald-500/5"
                    : "bg-white border-gray-150 shadow-2xs"
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[9px] font-black flex items-center justify-center border border-gray-200 uppercase">
                        {authorName[0]}
                      </div>
                      <span className="text-xs font-bold text-gray-900">{authorName}</span>
                    </div>
                    
                    <span className="text-[10px] font-semibold text-gray-400">
                      • {new Date(createdAt).toLocaleDateString()}
                    </span>

                    {isMostHelpful && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-tight">
                        🏆 Most Helpful
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 font-semibold leading-relaxed pl-7">
                    {commentText}
                  </p>
                  
                  {/* Cloudinary Image Attachment Render Support */}
                  {comment.image_url && (
                    <div className="pl-7 pt-2">
                      <img
                        src={comment.image_url}
                        alt="Comment attachment"
                        className="max-w-xs max-h-48 object-cover rounded-xl border border-gray-150 shadow-2xs"
                      />
                    </div>
                  )}

                  {/* Interactive Upvote & Downvote Buttons for comments */}
                  <div className="flex items-center gap-2 pl-7 pt-2 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => handleVote(commentId, "upvote")}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                        comment.userVote === "upvote"
                          ? "text-emerald-600 bg-emerald-50 border-emerald-200 font-bold"
                          : "text-gray-400 hover:text-emerald-600 border-transparent hover:bg-slate-50"
                      }`}
                      title="Upvote comment"
                    >
                      <ThumbsUp className={`w-3 h-3 transition-transform active:-translate-y-0.5 ${
                        comment.userVote === "upvote" ? "fill-emerald-500 text-emerald-600" : ""
                      }`} />
                      <span>Helpful ({comment.upvotes})</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleVote(commentId, "downvote")}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                        comment.userVote === "downvote"
                          ? "text-rose-600 bg-rose-50 border-rose-200 font-bold"
                          : "text-gray-400 hover:text-rose-600 border-transparent hover:bg-slate-50"
                      }`}
                      title="Downvote comment"
                    >
                      <ThumbsDown className={`w-3 h-3 transition-transform active:translate-y-0.5 ${
                        comment.userVote === "downvote" ? "fill-rose-500 text-rose-600" : ""
                      }`} />
                      <span>Not Helpful ({comment.downvotes})</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Pin comment toggle for admin/dept admins */}
                  {isAdmin && (
                    <button
                      onClick={() => handleTogglePin(commentId, isPinned)}
                      className={`p-1 rounded-lg transition-colors cursor-pointer ${
                        isPinned 
                          ? "text-emerald-600 hover:text-red-500 bg-emerald-50" 
                          : "text-gray-300 hover:text-brand-teal"
                      }`}
                      title={isPinned ? "Unpin comment" : "Pin solution"}
                    >
                      {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                    </button>
                  )}

                  {canDelete && (
                    <button
                      onClick={() => handleDelete(commentId)}
                      className="text-gray-300 hover:text-red-500 p-1 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}