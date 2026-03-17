export function buildKakaoAuthUrl(redirectUri: string): string {
  const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID ?? "";
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
  });
  return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
}
