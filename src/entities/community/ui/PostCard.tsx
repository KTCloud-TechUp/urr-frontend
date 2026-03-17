import Image from "next/image";
import { Heart, MessageCircle, BadgeCheck } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { formatCompactNumber, formatRelativeTime } from "@/shared/lib/format";
import type { CommunityPost } from "@/shared/types";

interface PostCardProps {
  post: CommunityPost;
  variant?: "default" | "compact";
  artistGradient?: string;
}

export function PostCard({ post, variant = "default", artistGradient }: PostCardProps) {
  const isCompact = variant === "compact";

  return (
    <div className={cn("rounded-xl border border-border bg-card", isCompact ? "p-4" : "p-5")}>
      {/* Header */}
      <div className="flex items-center gap-3">
        {post.authorAvatar ? (
          <div className={cn("shrink-0 rounded-full overflow-hidden relative", isCompact ? "size-8" : "size-10")}>
            <Image
              src={post.authorAvatar}
              alt={post.authorName}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className={cn(
              "shrink-0 rounded-full flex items-center justify-center text-white font-bold",
              isCompact ? "size-8 text-xs" : "size-10 text-sm",
            )}
            style={{ background: artistGradient ?? "linear-gradient(135deg, #374151, #6b7280)" }}
          >
            {post.authorName.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={cn("font-semibold truncate", isCompact ? "text-xs" : "text-sm")}>
              {post.authorName}
            </span>
            {post.isOfficial && (
              <BadgeCheck
                size={isCompact ? 12 : 14}
                className="text-primary fill-primary/20 shrink-0"
              />
            )}
          </div>
          <span className="text-xs text-muted-foreground">{formatRelativeTime(post.createdAt)}</span>
        </div>
      </div>

      {/* Content */}
      <p
        className={cn(
          "text-sm text-foreground/90 leading-relaxed mt-3",
          isCompact ? "line-clamp-2" : "line-clamp-4",
        )}
      >
        {post.content}
      </p>

      {/* Image gallery (default only) */}
      {!isCompact && post.images.length > 0 && (
        <div className="flex gap-2 mt-3">
          {post.images.map((src, idx) => (
            <div
              key={idx}
              className={cn(
                "rounded-lg overflow-hidden relative",
                post.images.length === 1
                  ? "w-full aspect-[16/9]"
                  : "flex-1 aspect-[4/3] min-w-0",
              )}
            >
              <Image
                src={src}
                alt={`${post.authorName} 게시글 이미지 ${idx + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Interaction bar */}
      <div
        className={cn(
          "flex items-center gap-5 text-muted-foreground",
          isCompact ? "mt-2 text-xs" : "mt-3 pt-3 border-t border-border text-sm",
        )}
      >
        <span className="flex items-center gap-1.5">
          <Heart size={isCompact ? 14 : 16} />
          {formatCompactNumber(post.likeCount)}
        </span>
        <span className="flex items-center gap-1.5">
          <MessageCircle size={isCompact ? 14 : 16} />
          {formatCompactNumber(post.commentCount)}
        </span>
      </div>
    </div>
  );
}
