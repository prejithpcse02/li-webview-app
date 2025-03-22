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
import { useRouter } from "expo-router";

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleProceed = () => {
    // Here you would typically handle password reset logic
    // For now, we'll just redirect to listings
    router.replace("/(tabs)/listings");
  };

  const handleBackToSignIn = () => {
    router.push("/users/signin");
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
              <View className="mb-4">
                <Text className="text-xl font-semibold text-primary mb-1">
                  Reset Password
                </Text>
                <Text className="text-gray-500">
                  Enter your email to receive a password reset link
                </Text>
              </View>
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

            <TouchableOpacity
              onPress={handleProceed}
              className="bg-blue-400 py-4 rounded-lg items-center mt-4"
            >
              <Text className="text-white font-bold text-lg">Proceed</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleBackToSignIn}
              className="items-center mt-4"
            >
              <Text className="text-primary font-medium">Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;
