import { useEffect } from "react";
import { Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { BopLogo } from "@/components/BopLogo";
import { useAuth } from "@/hooks/useAuth";
import { colors } from "@/theme/colors";
import { RootStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export function SplashScreen({ navigation }: Props) {
  const { isAuthenticated, isBootstrapping } = useAuth();

  useEffect(() => {
    if (isBootstrapping) return;
    const timer = setTimeout(() => navigation.replace(isAuthenticated ? "Chat" : "Login"), 900);
    return () => clearTimeout(timer);
  }, [isAuthenticated, isBootstrapping, navigation]);

  return (
    <View className="flex-1 items-center justify-center px-8" style={{ backgroundColor: colors.black }}>
      <BopLogo size="lg" />
      <Text className="mt-6 text-3xl font-black tracking-normal text-bop-white">BOP AI</Text>
      <Text className="mt-3 text-center text-base leading-6 tracking-normal text-bop-silver">
        {isBootstrapping ? "Verificando sesion segura..." : "Agente tecnologico privado con criterio, herramientas y control de permisos."}
      </Text>
    </View>
  );
}
