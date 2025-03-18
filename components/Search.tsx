import { View, Image, TextInput, TouchableOpacity, Text } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants/icons";
import { useRouter } from "expo-router";

interface Props {
  placeholder: string;
  onSearch: (query: string) => void;
}

const Search = ({ placeholder, onSearch }: Props) => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  return (
    <View className="w-full mx-auto flex-row justify-center gap-2 items-center py-2 border-[1px] border-gray-100">
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute left-5"
      >
        <Text className="text-black text-xl font-bold">✕</Text>
      </TouchableOpacity>
      <View className="flex-row justify-around items-center bg-white border-[1px] border-blue-100 rounded-lg px-5 py-1 w-[75%]">
        <Image
          source={icons.search}
          className="size-5"
          resizeMode="contain"
          tintColor="#13274F"
        />
        <TextInput
          className="flex-1 text-base"
          placeholder={placeholder}
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            onSearch(text); // Ensure search updates correctly
          }}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setQuery("");
              onSearch("");
            }}
          >
            <Text className="text-black text-md font-light">X</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Search;
