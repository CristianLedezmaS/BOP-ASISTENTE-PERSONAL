import { TextInput, TextInputProps, View } from "react-native";
import { LucideIcon } from "lucide-react-native";

import { colors } from "@/theme/colors";

type Props = TextInputProps & {
  icon?: LucideIcon;
};

export function Input({ icon: Icon, ...props }: Props) {
  return (
    <View
      className="min-h-12 flex-row items-center gap-3 rounded-bop border px-3"
      style={{ backgroundColor: colors.panel, borderColor: colors.border }}
    >
      {Icon ? <Icon size={18} color={colors.silver} /> : null}
      <TextInput
        placeholderTextColor={colors.muted}
        selectionColor={colors.red}
        className="flex-1 py-3 text-base text-bop-white"
        autoCapitalize="none"
        {...props}
      />
    </View>
  );
}
