import { ChatMessage } from "@/types/bop";
import { hasRemoteApi } from "@/config/env";
import { apiRequest } from "@/api/httpClient";

export type LoginPayload = {
  email: string;
  password: string;
};

export type BopSession = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
};

export type BopApiHealth = {
  status: "ok";
  app: string;
  owner: string;
  timezone: string;
  ai_provider: string;
  model: string;
};

export type BopHistoryResponse = {
  conversation_id: string;
  messages: ChatMessage[];
};

type SendMessageOptions = {
  token?: string;
  userId?: string;
  conversationId?: string;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loginToBop(payload: LoginPayload): Promise<BopSession> {
  if (hasRemoteApi) {
    return apiRequest<BopSession>("/auth/login", {
      method: "POST",
      body: {
        email: payload.email.trim().toLowerCase(),
        password: payload.password
      }
    });
  }

  await wait(450);

  if (!payload.email.includes("@") || payload.password.length < 4) {
    throw new Error("Credenciales invalidas. Revisa correo y clave privada.");
  }

  return {
    token: "local-dev-session",
    user: {
      id: "owner",
      email: payload.email.trim().toLowerCase(),
      name: "Cristian"
    }
  };
}

export async function getBopApiHealth(): Promise<BopApiHealth | null> {
  if (!hasRemoteApi) return null;

  return apiRequest<BopApiHealth>("/bop/health");
}

export async function getBopHistory(token?: string, conversationId = "mobile-owner"): Promise<BopHistoryResponse | null> {
  if (!hasRemoteApi) return null;

  return apiRequest<BopHistoryResponse>(`/bop/history?conversation_id=${encodeURIComponent(conversationId)}`, {
    token
  });
}

export async function sendMessageToBop(text: string, options: SendMessageOptions = {}): Promise<ChatMessage> {
  if (hasRemoteApi) {
    return apiRequest<ChatMessage>("/bop/chat", {
      method: "POST",
      token: options.token,
      body: {
        message: text,
        user_id: options.userId,
        conversation_id: options.conversationId ?? options.userId
      }
    });
  }

  await wait(350);

  return {
    id: `b-${Date.now()}`,
    role: "bop",
    status: "IDLE",
    text: `Recibido: "${text}". Primero evaluare intencion, riesgo y siguiente accion antes de ejecutar.`
  };
}
