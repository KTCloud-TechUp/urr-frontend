"use client";

import { useRouter } from "next/navigation";
import { MessageCircle, ChevronRight, Lock } from "lucide-react";
import { Button } from "@/shared/ui";
import { PostCard } from "@/entities/community";
import { getArtistGradient } from "@/shared/lib/mocks/home";
import type { Artist, Membership, CommunityPost } from "@/shared/types";

interface CommunitySectionProps {
  artist: Artist;
  membership?: Membership;
  communityPosts: CommunityPost[];
  onNavigateTab: (tab: string) => void;
}

export function CommunitySection({
  artist,
  membership,
  communityPosts,
  onNavigateTab,
}: CommunitySectionProps) {
  const router = useRouter();

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageCircle size={20} className="text-muted-foreground" />
          소통
        </h2>
        {membership?.isActive && communityPosts.length > 0 && (
          <button
            onClick={() => onNavigateTab("community")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5 cursor-pointer"
          >
            전체 보기
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {membership?.isActive ? (
        communityPosts.length > 0 ? (
          <div className="space-y-3">
            {[...communityPosts]
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .slice(0, 2)
              .map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  variant="compact"
                  artistGradient={getArtistGradient(artist.id)}
                />
              ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              아직 소통 게시글이 없습니다
            </p>
          </div>
        )
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center space-y-3">
          <Lock size={24} className="mx-auto text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            멤버십 회원만 소통 콘텐츠를 이용할 수 있습니다
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/membership?artistId=${artist.id}`)}
          >
            멤버십 가입하기
          </Button>
        </div>
      )}
    </section>
  );
}
