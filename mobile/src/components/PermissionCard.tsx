import { useState } from "react";
import { Text, View } from "react-native";
import { CheckCircle2, ShieldAlert, XCircle } from "lucide-react-native";

import { Button } from "@/components/Button";
import { colors } from "@/theme/colors";
import { PermissionRequest } from "@/types/bop";

type Props = {
  item: PermissionRequest;
};

export function PermissionCard({ item }: Props) {
  const sensitive = item.risk === "ACCION_SENSIBLE";
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(null);

  return (
    <View className="mb-3 rounded-bop border p-4" style={{ backgroundColor: colors.panel, borderColor: colors.border }}>
      <View className="mb-3 flex-row items-start gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-bop" style={{ backgroundColor: colors.dangerSurface }}>
          <ShieldAlert size={20} color={colors.red} />
        </View>
        <View className="flex-1">
          <Text className="text-base font-bold tracking-normal text-bop-white">{item.title}</Text>
          <Text className="mt-1 text-sm leading-5 tracking-normal text-bop-silver">{item.description}</Text>
        </View>
      </View>
      {decision ? (
        <View className="flex-row items-center gap-2 rounded-bop border px-3 py-2" style={{ borderColor: colors.border }}>
          {decision === "approved" ? <CheckCircle2 size={17} color={colors.red} /> : <XCircle size={17} color={colors.silver} />}
          <Text className="text-sm font-bold tracking-normal text-bop-white">
            {decision === "approved" ? "Permiso aprobado" : "Permiso rechazado"}
          </Text>
        </View>
      ) : (
        <View className="flex-row gap-2">
          <View className="flex-1">
            <Button label={sensitive ? "Confirmar" : "Permitir"} variant={sensitive ? "danger" : "secondary"} onPress={() => setDecision("approved")} />
          </View>
          <View className="flex-1">
            <Button label="Rechazar" variant="secondary" onPress={() => setDecision("rejected")} />
          </View>
        </View>
      )}
    </View>
  );
}
