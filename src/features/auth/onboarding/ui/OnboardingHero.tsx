interface OnboardingHeroProps {
  step: number;
}

const stepContent: Record<
  number,
  {
    title: string;
    subtitle: string;
    bgClass: string;
    emoji: string;
    features?: string[];
  }
> = {
  1: {
    title: "공정한 티켓팅의\n새로운 시작",
    subtitle: "봇과 매크로 없는, 진짜 팬을 위한 플랫폼",
    bgClass: "bg-primary",
    emoji: "🎵",
    features: ["1인 1계정 인증", "실시간 대기열 시스템", "AI 기반 봇 탐지"],
  },
  2: {
    title: "안전한 본인인증으로\n공정한 기회를",
    subtitle: "1인 1계정, 모든 팬에게 동등한 기회를 보장합니다",
    bgClass: "bg-secondary",
    emoji: "🛡️",
    features: ["실명 인증", "중복 가입 방지", "개인정보 암호화"],
  },
};

export function OnboardingHero({ step }: OnboardingHeroProps) {
  const content = stepContent[step] ?? stepContent[1];

  return (
    <div
      className={`relative h-full w-full flex flex-col justify-center items-center px-12 overflow-hidden ${content.bgClass}`}
    >
      {/* Background decorative circles */}
      <div className="absolute top-[-10%] right-[-10%] size-[400px] rounded-full bg-white/5" />
      <div className="absolute bottom-[-15%] left-[-10%] size-[300px] rounded-full bg-white/5" />
      <div className="absolute top-[40%] left-[60%] size-[200px] rounded-full bg-white/5" />

      {/* Content */}
      <div className="relative z-10 max-w-[400px] text-center space-y-6">
        <span className="text-6xl block">{content.emoji}</span>

        <h2 className="text-3xl font-bold text-white leading-snug whitespace-pre-line">
          {content.title}
        </h2>

        <p className="text-white/80 text-base leading-relaxed">
          {content.subtitle}
        </p>

        {content.features && (
          <div className="pt-4 space-y-3">
            {content.features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 text-white text-sm"
              >
                <div className="size-2 rounded-full bg-white shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* URR branding */}
      <div className="absolute bottom-8 flex items-center gap-2">
        <img
          src="logos/URR_Logo.png"
          alt="URR"
          className="h-10 opacity-40 brightness-0 invert"
        />
        <span className="text-white/40 text-sm font-medium tracking-wider">
          — 우르르
        </span>
      </div>
    </div>
  );
}
