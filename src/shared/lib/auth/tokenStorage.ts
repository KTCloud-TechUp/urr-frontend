import { SocialAuthResponse } from "@/shared/api/auth/social";

export const persistAuthTokens = (tokens: SocialAuthResponse) => {
  const { accessToken, refreshToken } = tokens;

  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  }

  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
};
