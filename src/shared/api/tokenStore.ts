import { registerTokenGetter } from "./client";

let accessToken: string | null = null;

export const tokenStore = {
  getToken: (): string | null => accessToken,
  setToken: (token: string): void => {
    accessToken = token;
  },
  clearToken: (): void => {
    accessToken = null;
  },
};

// client.ts에 getter 자동 연결 — 이 모듈을 import하는 순간 등록됨
registerTokenGetter(tokenStore.getToken);
