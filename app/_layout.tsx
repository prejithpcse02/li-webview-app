import "./globals.css";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/*<Stack.Screen name="listings/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="listings/fullImage"
          options={{ headerShown: false }}
        />*/}
        <Stack.Screen
          name="search/searchlist"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="users/signin" options={{ headerShown: false }} />
        <Stack.Screen name="users/signup" options={{ headerShown: false }} />
        <Stack.Screen name="users/forgot" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
/*http://localhost:3000/listings/all*/
