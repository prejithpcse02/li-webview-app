// li-app/app/users/signin.tsx
import SearchBar from "@/components/SearchBar";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { TokenStorage } from "../../services/tokenStorage";

const signin = () => {
  const router = useRouter();
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      const token = await TokenStorage.getAccessToken();
      if (token) {
        // If we already have a token, redirect to listings
        router.replace("/(tabs)/listings");
      }
    };
    getToken();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1 }}>
        <WebView
          source={{
            uri: "https://li-webjs-frontend.vercel.app/auth/signin",
          }}
          style={{ flex: 1 }}
          injectedJavaScript={`
            (function() {
              // Create and inject style override
              const style = document.createElement('style');
              style.textContent = \`
                nav { display: none !important; }
                body, html, #__next, main, .container, div {
                  margin-top: 0 !important;
                  padding-top: 0 !important;
                }
                main.container {
                  margin: 0 !important;
                  padding: 4px !important;
                  margin-top: 0 !important;
                }
                .mb-6 {
                  margin: 0 !important;
                  padding: 0 !important;
                }
                [class*="mt-"], [class*="pt-"] {
                  margin-top: 0 !important;
                  padding-top: 0 !important;
                }
              \`;
              document.head.appendChild(style);

              // Remove nav completely
              const nav = document.querySelector('nav');
              if (nav) nav.remove();

              // Monitor URL changes
              let lastUrl = window.location.href;
              setInterval(() => {
                if (window.location.href !== lastUrl) {
                  lastUrl = window.location.href;
                  
                  // If we're redirected to the listings page, notify the app
                  if (window.location.href.includes('/listings')) {
                    // Get the token from localStorage
                    const token = localStorage.getItem('token');
                    const refreshToken = localStorage.getItem('refreshToken');
                    
                    if (token && refreshToken) {
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'LOGIN_SUCCESS',
                        access: token,
                        refresh: refreshToken
                      }));
                    }
                  }
                }
              }, 500);

              // Force immediate execution of style changes
              requestAnimationFrame(() => {
                document.body.style.display = 'none';
                document.body.offsetHeight; // Force reflow
                document.body.style.display = '';
              });

              true;
            })();
          `}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === "LOGIN_SUCCESS") {
                // Store the tokens
                TokenStorage.setTokens(data.access, data.refresh);

                // Redirect to listings
                router.replace("/(tabs)/listings");
              }
            } catch (e) {
              console.error("Error parsing message from WebView:", e);
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default signin;
