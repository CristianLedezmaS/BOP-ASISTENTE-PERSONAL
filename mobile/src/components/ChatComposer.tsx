import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { Mic, Paperclip, Send } from "lucide-react-native";

import { colors } from "@/theme/colors";

type Props = {
  onSend: (text: string) => Promise<void> | void;
  disabled?: boolean;
};

export function ChatComposer({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");

  const submit = async () => {
    const text = value.trim();
    if (!text || disabled) return;
    await onSend(text);
    setValue("");
  };

  return (
    <View
      className="flex-row items-end gap-2 border-t px-4 pb-4 pt-3"
      style={{ backgroundColor: colors.black, borderColor: colors.border }}
    >
      <Pressable className="h-11 w-11 items-center justify-center rounded-bop border" style={{ borderColor: colors.border }}>
        <Paperclip size={19} color={colors.silver} />
      </Pressable>
      <View className="max-h-28 min-h-11 flex-1 rounded-bop border px-3" style={{ borderColor: colors.border, backgroundColor: colors.panel }}>
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder="Ordena, pregunta o pide construir..."
          placeholderTextColor={colors.muted}
          selectionColor={colors.red}
          multiline
          className="py-3 text-[15px] leading-5 text-bop-white"
          editable={!disabled}
        />
      </View>
      <Pressable className="h-11 w-11 items-center justify-center rounded-bop border" style={{ borderColor: colors.border }}>
        <Mic size={19} color={colors.silver} />
      </Pressable>
      <Pressable disabled={disabled} onPress={submit} className="h-11 w-11 items-center justify-center rounded-bop bg-bop-red" style={{ opacity: disabled ? 0.55 : 1 }}>
        <Send size={18} color={colors.black} />
      </Pressable>
    </View>
  );
}
