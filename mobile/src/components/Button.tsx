import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { LucideIcon } from "lucide-react-native";

import { colors } from "@/theme/colors";

type Props = {
  label: string;
  onPress: () => void;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  disabled?: boolean;
};

export function Button({ label, onPress, icon: Icon, variant = "primary", loading, disabled }: Props) {
  const isPrimary = variant === "primary";
  const isDanger = variant === "danger";
  const backgroundColor = isPrimary ? colors.red : isDanger ? colors.dangerSurface : colors.graphite;
  const textColor = isPrimary ? colors.black : colors.white;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      className="min-h-12 flex-row items-center justify-center gap-2 rounded-bop px-4"
      style={{
        backgroundColor,
        borderColor: isPrimary ? colors.red : colors.border,
        borderWidth: 1,
        opacity: disabled ? 0.55 : 1
      }}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {Icon ? <Icon size={18} color={textColor} /> : null}
          <Text className="text-sm font-bold tracking-normal" style={{ color: textColor }}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
