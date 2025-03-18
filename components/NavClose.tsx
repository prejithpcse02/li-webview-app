import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Link } from "expo-router";
//import { icons } from "@/constants/icons";

const NavClose = ({ link }) => {
  return (
    <View className="w-full h-16 bg-white flex justify-center items-start border-2 border-gray-200 px-4">
      <Link href={link} asChild>
        <TouchableOpacity>
          <Text className="text-black font-bold text-xl">✕</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default NavClose;
