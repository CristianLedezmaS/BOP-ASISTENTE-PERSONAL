import { Text, View } from "react-native";

import { colors } from "@/theme/colors";
import { BopStatus } from "@/types/bop";

type Props = {
  status: BopStatus;
};

const labels: Record<BopStatus, string> = {
  IDLE: "Listo",
  THINKING: "Pensando",
  SEARCHING: "Investigando",
  CODING: "Programando",
  TESTING: "Probando"
};

export function StatusPill({ status }: Props) {
  return (
    <View
      className="self-start rounded-full border px-2.5 py-1"
      style={{ backgroundColor: colors.dangerSurface, borderColor: "rgba(255, 26, 26, 0.35)" }}
    >
      <Text className="text-[11px] font-bold uppercase tracking-normal text-bop-red">{labels[status]}</Text>
    </View>
  );
}
