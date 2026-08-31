import { Text, View } from "react-native";

import { StatusPill } from "@/components/StatusPill";
import { colors } from "@/theme/colors";
import { ChatMessage } from "@/types/bop";

type Props = {
  message: ChatMessage;
};

export function MessageBubble({ message }: Props) {
  const isBop = message.role === "bop";

  return (
    <View className={`mb-3 max-w-[88%] ${isBop ? "self-start" : "self-end"}`}>
      <View
        className="gap-2 rounded-bop border px-4 py-3"
        style={{
          backgroundColor: isBop ? colors.panel : "rgba(255, 26, 26, 0.92)",
          borderColor: isBop ? colors.border : "rgba(255, 26, 26, 0.95)"
        }}
      >
        {message.status ? <StatusPill status={message.status} /> : null}
        <Text className="text-[15px] leading-6 tracking-normal" style={{ color: isBop ? colors.white : colors.black }}>
          {message.text}
        </Text>
      </View>
    </View>
  );
}
