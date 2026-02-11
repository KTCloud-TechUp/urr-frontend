export interface SocialAuthResponse {
  accessToken?: string;
  refreshToken?: string;
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

const getApiUrl = (): string => {
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }
  return apiBaseUrl;
};

const postJson = async <T>(path: string, body: unknown): Promise<T> => {
  const response = await fetch(`${getApiUrl()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const requestGoogleAuth = (
  code: string,
  state: string,
): Promise<SocialAuthResponse> => {
  return postJson<SocialAuthResponse>("/auth/google/callback", { code, state });
};

export const requestKakaoAuth = (
  code: string,
  state?: string,
): Promise<SocialAuthResponse> => {
  return postJson<SocialAuthResponse>("/auth/kakao/callback", { code, state });
};

export const requestNaverAuth = (
  code: string,
  state: string,
): Promise<SocialAuthResponse> => {
  return postJson<SocialAuthResponse>("/auth/naver/callback", { code, state });
};
