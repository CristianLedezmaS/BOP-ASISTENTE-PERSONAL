import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { Lock, Mail, Server, ShieldCheck } from "lucide-react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { getBopApiHealth } from "@/api/bopApi";
import { BopLogo } from "@/components/BopLogo";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { hasRemoteApi } from "@/config/env";
import { useAuth } from "@/hooks/useAuth";
import { colors } from "@/theme/colors";
import { RootStackParamList } from "@/types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const { error, isLoading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apiStatus, setApiStatus] = useState<"local" | "checking" | "online" | "offline">(
    hasRemoteApi ? "checking" : "local"
  );

  useEffect(() => {
    let isMounted = true;

    if (!hasRemoteApi) return;

    getBopApiHealth()
      .then(() => {
        if (isMounted) setApiStatus("online");
      })
      .catch(() => {
        if (isMounted) setApiStatus("offline");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const submit = async () => {
    try {
      await login({ email, password });
      navigation.replace("Chat");
    } catch {
      // El mensaje visible lo expone AuthContext.
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ backgroundColor: colors.black }}
    >
      <View className="flex-1 justify-between px-5 pb-8 pt-16">
        <View>
          <View className="flex-row items-center justify-between">
            <BopLogo size="md" />
            <View className="rounded-full border px-3 py-1" style={{ borderColor: colors.border }}>
              <Text className="text-xs font-bold uppercase tracking-normal text-bop-red">Privado</Text>
            </View>
          </View>

          <Text className="mt-10 text-4xl font-black leading-tight tracking-normal text-bop-white">
            Acceso seguro a BOP
          </Text>
          <Text className="mt-3 text-base leading-6 tracking-normal text-bop-silver">
            Ingeniero, disenador, investigador, manager y asistente personal dentro de una sola app.
          </Text>
        </View>

        <View className="gap-3">
          <View className="rounded-bop border p-3" style={{ backgroundColor: colors.panel, borderColor: colors.border }}>
            <View className="flex-row items-center gap-2">
              <Server size={18} color={apiStatus === "online" ? colors.red : colors.silver} />
              <Text className="text-sm font-bold tracking-normal text-bop-white">
                {apiStatus === "local"
                  ? "Modo local de desarrollo"
                  : apiStatus === "checking"
                    ? "Verificando backend"
                    : apiStatus === "online"
                      ? "Backend conectado"
                      : "Backend no disponible"}
              </Text>
            </View>
            <Text className="mt-1 text-sm leading-5 tracking-normal text-bop-silver">
              {apiStatus === "offline"
                ? "Revisa EXPO_PUBLIC_BOP_API_URL o levanta Laravel antes de iniciar sesion."
                : "La app puede trabajar con API Laravel o fallback local para pruebas visuales."}
            </Text>
          </View>

          <Input icon={Mail} placeholder="Correo autorizado" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <Input icon={Lock} placeholder="Clave privada" secureTextEntry value={password} onChangeText={setPassword} />

          <View className="mt-2 rounded-bop border p-3" style={{ backgroundColor: colors.panel, borderColor: colors.border }}>
            <View className="flex-row items-center gap-2">
              <ShieldCheck size={18} color={colors.red} />
              <Text className="text-sm font-bold tracking-normal text-bop-white">Autonomia controlada</Text>
            </View>
            <Text className="mt-1 text-sm leading-5 tracking-normal text-bop-silver">
              BOP prepara, analiza y propone. Las acciones sensibles requieren aprobacion.
            </Text>
          </View>

          {error ? (
            <Text className="text-sm font-semibold tracking-normal text-bop-red">{error}</Text>
          ) : null}

          <Button label="Entrar a BOP" onPress={submit} loading={isLoading} />
          <Button label="Ver permisos" variant="secondary" onPress={() => navigation.navigate("Permissions")} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
