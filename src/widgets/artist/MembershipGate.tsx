"use client";

import { useRouter } from "next/navigation";
import { Crown } from "lucide-react";
import { Button } from "@/shared/ui";

interface MembershipGateProps {
  artistId: string;
  artistName: string;
}

export function MembershipGate({ artistId, artistName }: MembershipGateProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-24 px-6">
      <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-5">
        <Crown size={28} className="text-primary" />
      </div>
      <h3 className="text-lg font-bold text-foreground">멤버십 회원 전용</h3>
      <p className="text-sm text-muted-foreground mt-2 text-center leading-relaxed max-w-[320px]">
        {artistName} 멤버십에 가입하여
        <br />
        다양한 독점 콘텐츠와 혜택을 누려보세요
      </p>
      <Button className="mt-6" onClick={() => router.push(`/membership?artistId=${artistId}`)}>
        멤버십 가입하기
      </Button>
    </div>
  );
}
