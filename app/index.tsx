import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Link } from "expo-router";

const Index = () => {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-6">
      <Text className="text-5xl font-bold text-blue-600 mb-6 py-4">
        Listtra! 👋
      </Text>
      <Text className="text-lg text-gray-700 mb-6 text-center">
        Discover amazing listings with just one tap!
      </Text>
      <Link href="/users/signin" asChild>
        <TouchableOpacity className="bg-blue-600 px-6 py-3 rounded-full shadow-md">
          <Text className="text-white text-lg font-semibold">
            Explore Listings
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default Index;
