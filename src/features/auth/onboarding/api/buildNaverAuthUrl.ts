export function buildNaverAuthUrl(redirectUri: string): string {
  const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID ?? "";
  // state is required by Naver for CSRF protection
  const state = Math.random().toString(36).substring(2);
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
  });
  return `https://nid.naver.com/oauth2.0/authorize?${params.toString()}`;
}
