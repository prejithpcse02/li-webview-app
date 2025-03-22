import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter, Link } from "expo-router";

const signin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    // Here you would typically handle authentication
    // For now, we'll just redirect to listings
    router.replace("/(tabs)/listings");
  };

  const handleForgotPassword = () => {
    // Navigate to the forgot password page at the app root level
    router.push("/users/forgot");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 flex-col justify-end px-8 pb-12">
          <View className="space-y-8">
            <View>
              <View className="relative">
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {email === "" && (
                  <Text className="absolute left-4 top-3 text-gray-400">
                    email
                  </Text>
                )}
              </View>
            </View>

            <View className="mt-6">
              <View className="relative">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100"
                  secureTextEntry={password !== ""}
                />
                <View className="absolute inset-y-0 flex-row justify-between w-full px-4 items-center">
                  {password === "" && (
                    <Text className="text-gray-400">password</Text>
                  )}
                  {password === "" && (
                    <TouchableOpacity
                      onPress={handleForgotPassword}
                      hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                      className="z-10"
                    >
                      <Text className="text-primary font-medium">Forgot?</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSignIn}
              className="bg-blue-400 py-4 rounded-lg items-center mt-4"
            >
              <Text className="text-white font-bold text-lg">Sign In</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-500">Don't have SL account? </Text>
              <Link href="/users/signup" asChild>
                <TouchableOpacity>
                  <Text className="text-primary font-medium">Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default signin;
