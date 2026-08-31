import { ScrollView, Text, View } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Button } from "@/components/Button";
import { PermissionCard } from "@/components/PermissionCard";
import { permissionRequests } from "@/data/initialMessages";
import { colors } from "@/theme/colors";
import { RootStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Permissions">;

export function PermissionsScreen({ navigation }: Props) {
  return (
    <ScrollView className="flex-1 px-5 pt-14" style={{ backgroundColor: colors.black }} contentContainerStyle={{ paddingBottom: 32 }}>
      <Button label="Volver" icon={ArrowLeft} variant="secondary" onPress={() => navigation.goBack()} />

      <Text className="mt-8 text-3xl font-black tracking-normal text-bop-white">Control de permisos</Text>
      <Text className="mt-3 text-base leading-6 tracking-normal text-bop-silver">
        BOP distingue entre informar, proponer, preparar, ejecutar y acciones sensibles. Este modulo evita ejecuciones peligrosas sin aprobacion.
      </Text>

      <View className="mt-6">
        {permissionRequests.map((item) => (
          <PermissionCard key={item.id} item={item} />
        ))}
      </View>
    </ScrollView>
  );
}
