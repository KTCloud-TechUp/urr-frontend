"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth/model/useCurrentUser";
import { HomeWidget } from "@/widgets/home";

export default function Home() {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/landing");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;
  return <HomeWidget />;
}
