import * as SecureStore from "expo-secure-store";

import { ChatMessage } from "@/types/bop";

const CHAT_MESSAGES_KEY = "bop.chat.messages.v1";
const CHAT_CONVERSATION_KEY = "bop.chat.conversation.v1";

export async function loadStoredMessages(): Promise<ChatMessage[] | null> {
  const rawMessages = await SecureStore.getItemAsync(CHAT_MESSAGES_KEY);
  if (!rawMessages) return null;

  try {
    return JSON.parse(rawMessages) as ChatMessage[];
  } catch {
    await clearStoredChat();
    return null;
  }
}

export async function saveStoredMessages(messages: ChatMessage[]): Promise<void> {
  await SecureStore.setItemAsync(CHAT_MESSAGES_KEY, JSON.stringify(messages.slice(-80)));
}

export async function loadStoredConversationId(): Promise<string | null> {
  return SecureStore.getItemAsync(CHAT_CONVERSATION_KEY);
}

export async function saveStoredConversationId(conversationId: string): Promise<void> {
  await SecureStore.setItemAsync(CHAT_CONVERSATION_KEY, conversationId);
}

export async function clearStoredChat(): Promise<void> {
  await SecureStore.deleteItemAsync(CHAT_MESSAGES_KEY);
  await SecureStore.deleteItemAsync(CHAT_CONVERSATION_KEY);
}
