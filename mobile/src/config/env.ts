export const env = {
  apiUrl: process.env.EXPO_PUBLIC_BOP_API_URL?.replace(/\/$/, "") ?? "",
  requestTimeoutMs: 15000
};

export const hasRemoteApi = Boolean(env.apiUrl);
