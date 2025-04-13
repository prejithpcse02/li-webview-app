import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { TokenStorage } from "../../services/tokenStorage";
import { WebView } from "react-native-webview";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Constants from "expo-constants";

const SearchList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, refreshToken } = useAuth();
  const [webViewUrl, setWebViewUrl] = useState<string | null>(null);
  const webViewRef = useRef<WebView>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(Date.now());

  const prepareWebView = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isAuthenticated) {
        router.replace("/users/signin");
        return;
      }

      let token = await TokenStorage.getAccessToken();
      if (!token) {
        const refreshed = await refreshToken();
        if (!refreshed) {
          router.replace("/users/signin");
          return;
        }
        token = await TokenStorage.getAccessToken();
      }

      // Set the URL to the web frontend search page with the token
      const url = `https://li-webjs-frontend.vercel.app/search?token=${token}`;
      setWebViewUrl(url);
    } catch (error: any) {
      setError("Failed to load search page. Please try again later.");
      console.error("Error preparing WebView:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check for search events when the page gains focus
  useFocusEffect(
    React.useCallback(() => {
      const checkForRefreshNeeded = async () => {
        try {
          // Check if we need to refresh based on the flag
          const needsRefresh = await AsyncStorage.getItem(
            "search_page_needs_refresh"
          );

          // Also check if there are any recent search events
          const allKeys = await AsyncStorage.getAllKeys();
          const searchEventKeys = allKeys.filter((key) =>
            key.startsWith("search_event_")
          );

          // Get the most recent search event
          let mostRecentEventTime = 0;
          for (const key of searchEventKeys) {
            const eventData = await AsyncStorage.getItem(key);
            if (eventData) {
              try {
                const event = JSON.parse(eventData);
                const eventTime = new Date(event.timestamp).getTime();
                if (eventTime > mostRecentEventTime) {
                  mostRecentEventTime = eventTime;
                }
              } catch (e) {
                console.error("Error parsing event data:", e);
              }
            }
          }

          // If we have a recent event (within the last 30 seconds) or the refresh flag is set
          const shouldRefresh =
            needsRefresh === "true" ||
            (mostRecentEventTime > lastRefreshTime &&
              mostRecentEventTime > Date.now() - 30000);

          if (shouldRefresh) {
            console.log("Refreshing search page due to recent activity");
            // Clear the refresh flag
            await AsyncStorage.removeItem("search_page_needs_refresh");
            // Update the last refresh time
            setLastRefreshTime(Date.now());
            // Reload the WebView by updating the refresh key
            setRefreshKey((prevKey) => prevKey + 1);
            // Also call handleReload for immediate refresh
            handleReload();
          }
        } catch (error) {
          console.error("Error checking refresh status:", error);
        }
      };

      // Check immediately when the page gains focus
      checkForRefreshNeeded();

      // Set up an interval to check periodically while the page is focused
      const intervalId = setInterval(checkForRefreshNeeded, 5000);

      // Clean up the interval when the page loses focus
      return () => clearInterval(intervalId);
    }, [lastRefreshTime])
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/users/signin");
      return;
    }
    prepareWebView();
  }, [isAuthenticated]);

  const handleWebViewError = () => {
    setError(
      "Failed to load search page. Please check your internet connection."
    );
  };

  const handleWebViewLoad = () => {
    setLoading(false);
  };

  const handleReload = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retryText} onPress={prepareWebView}>
          Tap to retry
        </Text>
      </View>
    );
  }

  if (!webViewUrl) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Unable to load search page</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/(tabs)/listings")}
        >
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={handleReload}>
          <Ionicons name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.webviewContainer}>
        <WebView
          key={refreshKey}
          ref={webViewRef}
          source={{ uri: webViewUrl }}
          style={styles.webview}
          originWhitelist={["*"]}
          allowUniversalAccessFromFileURLs={true}
          mixedContentMode="always"
          onError={handleWebViewError}
          onLoad={handleWebViewLoad}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          )}
          incognito={false}
          cacheEnabled={true}
          cacheMode="LOAD_DEFAULT"
          injectedJavaScript={`
            localStorage.setItem('token', '${webViewUrl.split("token=")[1]}');
            
            (function() {
              const style = document.createElement('style');
              style.textContent = \`
                nav, header, .navbar, .navigation, [role="navigation"], [class*="nav"], [class*="header"], [class*="Navbar"], [class*="Header"] { 
                  display: none !important; 
                  visibility: hidden !important;
                  opacity: 0 !important;
                  height: 0 !important;
                  width: 0 !important;
                  position: absolute !important;
                  pointer-events: none !important;
                  z-index: -9999 !important;
                }
                body, html, #__next, main, .container, div {
                  margin-top: 0 !important;
                  padding-top: 0 !important;
                }
                main.container {
                  margin: 0 !important;
                  padding: 8px !important;
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
                .grid {
                  gap: 12px !important;
                  padding: 8px !important;
                }
                .card {
                  border-radius: 12px !important;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
                }
                .search-container {
                  margin-top: 0 !important;
                  padding-top: 0 !important;
                }
                .search-input {
                  border-radius: 8px !important;
                  border: 1px solid #E5E5E5 !important;
                }
                .category-filter {
                  border-radius: 8px !important;
                  border: 1px solid #E5E5E5 !important;
                }
              \`;
              document.head.appendChild(style);

              const removeNavElements = () => {
                const navElements = document.querySelectorAll('nav, header, .navbar, .navigation, [role="navigation"], [class*="nav"], [class*="header"], [class*="Navbar"], [class*="Header"]');
                navElements.forEach(el => {
                  if (el) el.remove();
                });
              };
              
              removeNavElements();
              
              const observer = new MutationObserver((mutations) => {
                removeNavElements();
              });
              
              observer.observe(document.body, { 
                childList: true, 
                subtree: true 
              });

              requestAnimationFrame(() => {
                document.body.style.display = 'none';
                document.body.offsetHeight;
                document.body.style.display = '';
              });

              setInterval(removeNavElements, 1000);
            })();
            true;
          `}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  reloadButton: {
    padding: 8,
    borderRadius: 8,
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  webview: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  errorText: {
    color: "#FF3B30",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
  },
  retryText: {
    color: "#007AFF",
    textAlign: "center",
    textDecorationLine: "underline",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  emptyText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
});

export default SearchList;
