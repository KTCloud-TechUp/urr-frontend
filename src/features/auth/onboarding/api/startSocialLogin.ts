export type SocialProvider = "kakao" | "naver";

interface StartSocialLoginParams {
  provider: SocialProvider;
  redirectUri: string;
}

interface SocialLoginResponse {
  redirectUrl?: string;
  data?: {
    redirectUrl?: string;
  };
}

export async function startSocialLogin({
  provider,
  redirectUri,
}: StartSocialLoginParams): Promise<string | null> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

  const response = await fetch(`${apiBaseUrl}/api/auth/oauth/${provider}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ redirectUri }),
  });

  if (!response.ok) {
    throw new Error(`Social login failed: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  const result = (await response.json()) as SocialLoginResponse;
  return result.redirectUrl ?? result.data?.redirectUrl ?? null;
}
