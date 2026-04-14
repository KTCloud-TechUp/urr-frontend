"use client";

import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

export type ErrorViewVariant = "not-found" | "runtime";

interface ErrorViewProps {
  variant: ErrorViewVariant;
  onRetry?: () => void;
  title?: string;
  description?: string;
  className?: string;
}

const DEFAULT_COPY: Record<
  ErrorViewVariant,
  { title: string; description: string }
> = {
  "not-found": {
    title: "페이지를 찾을 수 없어요",
    description:
      "요청하신 페이지가 존재하지 않거나 이동됐어요.\n주소를 다시 확인해 주세요.",
  },
  runtime: {
    title: "문제가 발생했어요",
    description: "일시적인 오류가 발생했어요.\n잠시 후 다시 시도해 주세요.",
  },
};

export function ErrorView({
  variant,
  onRetry,
  title,
  description,
  className,
}: ErrorViewProps) {
  const router = useRouter();
  const copy = DEFAULT_COPY[variant];
  const resolvedTitle = title ?? copy.title;
  const resolvedDescription = description ?? copy.description;

  const handleHome = () => router.push("/");
  const handleRetry = () => {
    if (onRetry) onRetry();
    else window.location.reload();
  };

  return (
    <div
      className={cn(
        "flex min-h-[calc(100vh-8rem)] w-full flex-col items-center justify-center px-6 py-16",
        className,
      )}
    >
      <div className="flex w-full max-w-md flex-col items-center text-center">
        {variant === "not-found" ? (
          <div
            aria-hidden
            className="select-none text-7xl font-black tracking-tight text-primary md:text-8xl"
          >
            404
          </div>
        ) : (
          <div className="flex size-20 items-center justify-center rounded-full bg-accent">
            <AlertTriangle size={40} className="text-danger" />
          </div>
        )}

        <h1 className="mt-6 text-2xl font-bold text-foreground">
          {resolvedTitle}
        </h1>
        <p className="mt-2 whitespace-pre-line text-base text-muted-foreground">
          {resolvedDescription}
        </p>

        <div className="mt-8 flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-3">
          {variant === "runtime" ? (
            <>
              <Button onClick={handleRetry} className="sm:min-w-36">
                <RotateCcw />
                다시 시도
              </Button>
              <Button
                variant="outline"
                onClick={handleHome}
                className="sm:min-w-36"
              >
                <Home />
                홈으로
              </Button>
            </>
          ) : (
            <Button onClick={handleHome} className="sm:min-w-40">
              <Home />
              홈으로 돌아가기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
