import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { TokenStorage } from "../../services/tokenStorage";
import { WebView } from "react-native-webview";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, refreshToken, logout } = useAuth();
  const [webViewUrl, setWebViewUrl] = useState<string | null>(null);
  const webViewRef = useRef<WebView>(null);
  const [refreshKey, setRefreshKey] = useState(0);

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

      const url = `https://li-webjs-frontend.vercel.app/profile?token=${token}`;
      setWebViewUrl(url);
    } catch (error: any) {
      setError("Failed to load profile. Please try again later.");
      console.error("Error preparing WebView:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigationStateChange = (navState: any) => {
    // If the URL is different from our profile URL, prevent navigation
    if (navState.url !== webViewUrl) {
      webViewRef.current?.stopLoading();
      webViewRef.current?.reload();
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const checkForRefreshNeeded = async () => {
        try {
          const needsRefresh = await AsyncStorage.getItem(
            "profile_page_needs_refresh"
          );
          if (needsRefresh === "true") {
            await AsyncStorage.removeItem("profile_page_needs_refresh");
            setRefreshKey((prevKey) => prevKey + 1);
            handleReload();
          }
        } catch (error) {
          console.error("Error checking refresh status:", error);
        }
      };

      checkForRefreshNeeded();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      if (webViewRef.current && webViewUrl) {
        webViewRef.current.reload();
      }
    }, [webViewUrl])
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/users/signin");
      return;
    }
    prepareWebView();
  }, [isAuthenticated]);

  const handleWebViewError = () => {
    setError("Failed to load profile. Please check your internet connection.");
  };

  const handleWebViewLoad = () => {
    setLoading(false);
  };

  const handleReload = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/users/signin");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
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
        <Text style={styles.emptyText}>Unable to load profile</Text>
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
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.reloadButton} onPress={handleReload}>
            <Ionicons name="refresh" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
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
          onNavigationStateChange={handleNavigationStateChange}
          onError={handleWebViewError}
          onLoad={handleWebViewLoad}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
          incognito={false}
          cacheEnabled={true}
          cacheMode="LOAD_DEFAULT"
          injectedJavaScript={`
            localStorage.setItem('token', '${webViewUrl?.split("token=")[1]}');
            
            // Prevent navigation to other pages
            window.addEventListener('click', function(e) {
              const target = e.target.closest('a');
              if (target && !target.href.includes('profile')) {
                e.preventDefault();
                e.stopPropagation();
              }
            }, true);

            // Prevent form submissions to other pages
            document.addEventListener('submit', function(e) {
              if (e.target.action && !e.target.action.includes('profile')) {
                e.preventDefault();
                e.stopPropagation();
              }
            }, true);

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
                .profile-container {
                  margin-top: 0 !important;
                  padding-top: 0 !important;
                }
                .profile-header {
                  margin-top: 0 !important;
                  padding-top: 0 !important;
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  reloadButton: {
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    marginTop: 20,
    marginBottom: 40,
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

export default Profile;
