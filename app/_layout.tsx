import "./globals.css";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="listings/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="listings/fullImage"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="search/searchlist" options={{ headerShown: false }} />
    </Stack>
  );
}
/*http://localhost:3000/listings/all*/
