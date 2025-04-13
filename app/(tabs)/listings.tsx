import SearchBar from "@/components/SearchBar";
import React, { useEffect, useState, useRef } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { TokenStorage } from "../../services/tokenStorage";
import { useAuth } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const listings = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [injectedJS, setInjectedJS] = useState<string>("");
  const webViewRef = useRef<WebView>(null);
  const listingsUrl = "https://li-webjs-frontend.vercel.app/listings";

  // Function to inject JavaScript that listens for like/unlike events
  const prepareInjectedJavaScript = async () => {
    let token = "";
    if (isAuthenticated) {
      token = (await TokenStorage.getAccessToken()) || "";
    }

    const js = `
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

        // Store the token in localStorage for the web app to use
        // The LikeButton component expects 'token' not 'auth_token'
        if ('${token}') {
          localStorage.setItem('token', '${token}');
        }

        // Set up a simple event listener for the document
        document.addEventListener('click', function(event) {
          // Check if the clicked element is a like button or contains a like button
          const likeButton = event.target.closest('button[aria-label*="like"], button[aria-label*="favorite"], .like-button, .favorite-button, [data-liked]');
          
          if (likeButton) {
            // Get the listing ID from the closest parent element with a data-id attribute
            const listingElement = likeButton.closest('[data-id], [id*="listing"], [id*="item"], article, .card');
            const listingId = listingElement ? 
              (listingElement.getAttribute('data-id') || listingElement.id || 'unknown') : 
              'unknown';
            
            // Determine if this is a like or unlike action based on current state
            const isLiked = likeButton.getAttribute('data-liked') === 'true' || 
                           likeButton.classList.contains('liked') ||
                           likeButton.getAttribute('aria-pressed') === 'true';
            
            // Send message to React Native
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: isLiked ? 'unlike' : 'like',
              listingId: listingId
            }));
          }
        });

        // Force immediate execution of style changes
        requestAnimationFrame(() => {
          document.body.style.display = 'none';
          document.body.offsetHeight; // Force reflow
          document.body.style.display = '';
        });

        true;
      })();
    `;

    setInjectedJS(js);
  };

  useEffect(() => {
    prepareInjectedJavaScript();
  }, [isAuthenticated]);

  const handleWebViewMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log("Message from webview:", data);

      // Handle like/unlike events
      if (data.type === "like" || data.type === "unlike") {
        // Store the event in AsyncStorage to be picked up by the likes page
        const timestamp = new Date().toISOString();
        const eventKey = `like_event_${timestamp}`;
        await AsyncStorage.setItem(
          eventKey,
          JSON.stringify({
            type: data.type,
            listingId: data.listingId,
            timestamp,
          })
        );

        // Set a flag to indicate that the likes page should refresh
        await AsyncStorage.setItem("likes_page_needs_refresh", "true");

        console.log(`${data.type} event for listing ${data.listingId} stored`);
      }

      // Handle navigation events
      if (data.type === "navigate") {
        console.log(`Navigating to: ${data.to}`);
        router.push(data.to);
      }
    } catch (error) {
      console.error("Error parsing WebView message:", error);
    }
  };

  // Add this function to reload the WebView when the tab is focused
  useFocusEffect(
    React.useCallback(() => {
      if (webViewRef.current) {
        webViewRef.current.reload();
      }
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <SearchBar
        onPress={() => router.push("/search/searchlist")}
        placeholder="Search for an item"
      />
      <View style={{ flex: 1 }}>
        <WebView
          ref={webViewRef}
          source={{
            uri: listingsUrl,
          }}
          style={{ flex: 1, marginBottom: 60, marginTop: 10 }}
          injectedJavaScript={injectedJS}
          originWhitelist={["*"]}
          allowUniversalAccessFromFileURLs={true}
          onMessage={handleWebViewMessage}
          // Add these props to improve WebView behavior
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          cacheEnabled={true}
          cacheMode="LOAD_DEFAULT"
          mixedContentMode="always"
        />
      </View>
    </SafeAreaView>
  );
};

export default listings;
