import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Code2, Image, Search, Settings2 } from "lucide-react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { BopLogo } from "@/components/BopLogo";
import { ChatComposer } from "@/components/ChatComposer";
import { MessageBubble } from "@/components/MessageBubble";
import { getBopHistory, sendMessageToBop } from "@/api/bopApi";
import { initialMessages } from "@/data/initialMessages";
import { useAuth } from "@/hooks/useAuth";
import { loadStoredConversationId, loadStoredMessages, saveStoredConversationId, saveStoredMessages } from "@/storage/chatStorage";
import { colors } from "@/theme/colors";
import { ChatMessage } from "@/types/bop";
import { RootStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

const tools = [
  { label: "Investigar", icon: Search },
  { label: "Codigo", icon: Code2 },
  { label: "Diseno", icon: Image },
  { label: "Manager", icon: Settings2 }
];

export function ChatScreen({ navigation }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isSending, setIsSending] = useState(false);
  const { logout, session } = useAuth();
  const [conversationId, setConversationId] = useState(session?.user.id);

  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      const storedConversationId = (await loadStoredConversationId()) ?? session?.user.id ?? "mobile-owner";
      const storedMessages = await loadStoredMessages();

      if (!isMounted) return;

      setConversationId(storedConversationId);
      if (storedMessages?.length) setMessages(storedMessages);

      if (!session?.token) return;

      try {
        const remoteHistory = await getBopHistory(session.token, storedConversationId);
        if (!isMounted || !remoteHistory?.messages.length) return;

        setConversationId(remoteHistory.conversation_id);
        setMessages(remoteHistory.messages);
        await saveStoredConversationId(remoteHistory.conversation_id);
        await saveStoredMessages(remoteHistory.messages);
      } catch {
        // Si Laravel no responde, mantenemos el historial local para no bloquear el chat.
      }
    }

    void loadHistory();

    return () => {
      isMounted = false;
    };
  }, [session?.token, session?.user.id]);

  const send = async (text: string) => {
    const timestamp = Date.now();
    const userMessage: ChatMessage = { id: `u-${Date.now()}`, role: "user", text };
    const thinkingId = `b-thinking-${timestamp}`;

    setMessages((current) => [
      ...current,
      userMessage,
      {
        id: thinkingId,
        role: "bop",
        status: "THINKING",
        text: "Analizando intencion, riesgo y siguiente accion..."
      }
    ]);

    setIsSending(true);

    try {
      const response = await sendMessageToBop(text, {
        token: session?.token,
        userId: session?.user.id,
        conversationId
      });

      if (response.conversation_id) setConversationId(response.conversation_id);
      if (response.conversation_id) void saveStoredConversationId(response.conversation_id);

      setMessages((current) => {
        const nextMessages = [...current.filter((item) => item.id !== thinkingId), response];
        void saveStoredMessages(nextMessages);
        return nextMessages;
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo obtener respuesta de BOP.";
      setMessages((current) => {
        const nextMessages: ChatMessage[] = [
          ...current.filter((item) => item.id !== thinkingId),
          {
            id: `b-error-${Date.now()}`,
            role: "bop",
            status: "IDLE",
            text: message
          }
        ];
        void saveStoredMessages(nextMessages);
        return nextMessages;
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.black }}>
      <View className="border-b px-4 pb-3 pt-12" style={{ borderColor: colors.border }}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <BopLogo size="sm" />
            <View>
              <Text className="text-lg font-black tracking-normal text-bop-white">BOP</Text>
              <Text className="text-xs tracking-normal text-bop-silver">{session?.user.email ?? "Agente tecnico personal"}</Text>
            </View>
          </View>
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => navigation.navigate("Permissions")}
              className="h-10 w-10 items-center justify-center rounded-bop border"
              style={{ borderColor: colors.border }}
            >
              <Settings2 size={18} color={colors.silver} />
            </Pressable>
            <Pressable onPress={logout} className="h-10 rounded-bop border px-3 items-center justify-center" style={{ borderColor: colors.border }}>
              <Text className="text-xs font-bold tracking-normal text-bop-silver">Salir</Text>
            </Pressable>
          </View>
        </View>

        <View className="mt-4 flex-row gap-2">
          {tools.map((tool) => (
            <View key={tool.label} className="flex-1 items-center rounded-bop border py-2" style={{ borderColor: colors.border }}>
              <tool.icon size={16} color={tool.label === "Codigo" ? colors.red : colors.silver} />
              <Text className="mt-1 text-[11px] font-semibold tracking-normal text-bop-silver">{tool.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
      />

      <ChatComposer onSend={send} disabled={isSending} />
    </View>
  );
}
