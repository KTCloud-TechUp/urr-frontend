"use client";

import { useState } from "react";
import Image from "next/image";
import { XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { checkAnswer, pickRandomQuestions } from "@/shared/lib/mocks/vqa";
import type { VQAQuestion } from "@/shared/types";

interface VQAQuizModalProps {
  open: boolean;
  onPass: () => void;
  onCancel: () => void;
}

export function VQAQuizModal({ open, onPass, onCancel }: VQAQuizModalProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>보안 퀴즈</DialogTitle>
        </DialogHeader>
        {open && <VQAQuizBody onPass={onPass} />}
      </DialogContent>
    </Dialog>
  );
}

type Phase = "asking" | "wrong";

function VQAQuizBody({ onPass }: { onPass: () => void }) {
  const [question, setQuestion] = useState<VQAQuestion | null>(
    () => pickRandomQuestions(1)[0] ?? null,
  );
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("asking");

  const handleSubmit = () => {
    if (!question) return;
    if (checkAnswer(question, input)) {
      onPass();
      return;
    }
    setPhase("wrong");
  };

  const handleRetry = () => {
    setQuestion(pickRandomQuestions(1)[0] ?? null);
    setInput("");
    setPhase("asking");
  };

  if (phase === "wrong") {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <XCircle size={64} className="text-destructive" strokeWidth={2} />
        <p className="text-sm font-medium">오답입니다. 다시 시도해보세요.</p>
        <Button variant="outline" onClick={handleRetry}>
          다시 풀기
        </Button>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="space-y-5">
      <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-border bg-muted">
        <Image
          src={question.imageUrl}
          alt={question.question}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 440px"
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold">
          <span aria-hidden="true" className="mr-1">❓</span>
          {question.question}
        </p>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) handleSubmit();
          }}
          placeholder="답을 입력하세요"
          autoFocus
        />
      </div>

      <Button
        className="w-full"
        size="lg"
        disabled={!input.trim()}
        onClick={handleSubmit}
      >
        확인
      </Button>
    </div>
  );
}
