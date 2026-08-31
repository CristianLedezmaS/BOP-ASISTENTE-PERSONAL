import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors } from "@/theme/colors";

type Props = {
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: { box: "h-11 w-11", text: "text-sm", eye: "h-1.5 w-1.5" },
  md: { box: "h-16 w-16", text: "text-lg", eye: "h-2 w-2" },
  lg: { box: "h-24 w-24", text: "text-2xl", eye: "h-3 w-3" }
};

export function BopLogo({ size = "md" }: Props) {
  const current = sizes[size];

  return (
    <LinearGradient
      colors={[colors.graphite, colors.black, colors.wine]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className={`${current.box} items-center justify-center rounded-bop border`}
      style={{ borderColor: colors.border }}
    >
      <View className="mb-1 flex-row gap-2">
        <View className={`${current.eye} rounded-full bg-bop-red`} />
        <View className={`${current.eye} rounded-full bg-bop-red`} />
      </View>
      <Text className={`${current.text} font-black tracking-normal text-bop-white`}>BOP</Text>
    </LinearGradient>
  );
}
