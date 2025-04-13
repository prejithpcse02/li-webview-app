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
            
            (function() {
              const style = document.createElement('style');
              style.textContent = \`
                nav, header, .navbar, .navigation { 
                  display: none !important; 
                }
                body {
                  background-color: #FFFFFF !important;
                  padding: 0 16px !important;
                }
                .profile-container {
                  max-width: 100% !important;
                  padding: 24px 0 !important;
                  margin: 0 !important;
                }
                .avatar {
                  width: 80px !important;
                  height: 80px !important;
                  border-radius: 40px !important;
                  margin-bottom: 16px !important;
                }
                .username {
                  font-size: 24px !important;
                  font-weight: 600 !important;
                  color: #000000 !important;
                  margin-bottom: 8px !important;
                }
                .joined-date {
                  font-size: 15px !important;
                  color: #666666 !important;
                  margin-bottom: 24px !important;
                }
                .account-details {
                  background: #F8F8F8 !important;
                  border-radius: 12px !important;
                  padding: 16px !important;
                  margin-bottom: 24px !important;
                }
                .reviews-section {
                  background: #F8F8F8 !important;
                  border-radius: 12px !important;
                  padding: 16px !important;
                  margin-bottom: 24px !important;
                }
                .tab-container {
                  border-top: 1px solid #E5E5E5 !important;
                  margin: 0 -16px !important;
                  padding: 0 16px !important;
                }
                .tab-button {
                  font-size: 16px !important;
                  font-weight: 500 !important;
                  color: #007AFF !important;
                  padding: 12px 0 !important;
                }
                .tab-button.active {
                  color: #000000 !important;
                  border-bottom: 2px solid #007AFF !important;
                }
              \`;
              document.head.appendChild(style);

              // Remove navigation elements
              const removeNavElements = () => {
                const navElements = document.querySelectorAll('nav, header, .navbar, .navigation');
                navElements.forEach(el => el.remove());
              };
              
              removeNavElements();
              
              const observer = new MutationObserver(removeNavElements);
              observer.observe(document.body, { childList: true, subtree: true });

              // Force layout recalculation
              requestAnimationFrame(() => {
                document.body.style.display = 'none';
                document.body.offsetHeight;
                document.body.style.display = '';
              });
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
    height: 60,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E5E5",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
    letterSpacing: 0.5,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  reloadButton: {
    padding: 8,
    marginRight: 4,
  },
  logoutButton: {
    padding: 8,
    marginRight: -8,
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginTop: 0,
    marginBottom: 40,
  },
  webview: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.98)",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  errorText: {
    color: "#FF3B30",
    textAlign: "center",
    marginBottom: 12,
    fontSize: 16,
    lineHeight: 22,
  },
  retryText: {
    color: "#007AFF",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
  },
});

export default Profile;
