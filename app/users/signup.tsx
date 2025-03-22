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

const SignUp = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    // Here you would typically handle registration
    // For now, we'll just redirect to listings
    router.replace("/(tabs)/listings");
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
            <View className="mb-4">
              <Text className="text-xl font-semibold text-primary mb-1">
                Create Account
              </Text>
              <Text className="text-gray-500">
                Sign up to start browsing items
              </Text>
            </View>

            <View className="mb-6">
              <View className="relative">
                <TextInput
                  value={name}
                  onChangeText={setName}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100"
                  autoCapitalize="words"
                />
                {name === "" && (
                  <Text className="absolute left-4 top-3 text-gray-400">
                    name
                  </Text>
                )}
              </View>
            </View>

            <View className="mb-6">
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

            <View className="mb-6">
              <View className="relative">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100"
                  secureTextEntry={password !== ""}
                />
                {password === "" && (
                  <Text className="absolute left-4 top-3 text-gray-400">
                    password
                  </Text>
                )}
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSignUp}
              className="bg-blue-400 py-4 rounded-lg items-center mt-8"
            >
              <Text className="text-white font-bold text-lg">Sign Up</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-500">Already have an account? </Text>
              <Link href="/users/signin" asChild>
                <TouchableOpacity>
                  <Text className="text-primary font-medium">Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
