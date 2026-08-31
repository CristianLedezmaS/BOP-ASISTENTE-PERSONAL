import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "@/hooks/useAuth";
import { ChatScreen } from "@/screens/ChatScreen";
import { LoginScreen } from "@/screens/LoginScreen";
import { PermissionsScreen } from "@/screens/PermissionsScreen";
import { SplashScreen } from "@/screens/SplashScreen";
import { colors } from "@/theme/colors";
import { RootStackParamList } from "@/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.black }
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Permissions" component={PermissionsScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Permissions" component={PermissionsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
