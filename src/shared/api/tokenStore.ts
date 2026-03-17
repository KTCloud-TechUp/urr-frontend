import { registerTokenGetter } from "./client";

let accessToken: string | null = null;

function setClientCookie(name: string, value: string, maxAge: number) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export const tokenStore = {
  getToken: (): string | null => accessToken,
  setToken: (token: string): void => {
    accessToken = token;
    setClientCookie("is_authenticated", "1", 60 * 60 * 24); // 24h
  },
  clearToken: (): void => {
    accessToken = null;
    setClientCookie("is_authenticated", "", 0);
  },
};

// client.ts에 getter 자동 연결 — 이 모듈을 import하는 순간 등록됨
registerTokenGetter(tokenStore.getToken);
