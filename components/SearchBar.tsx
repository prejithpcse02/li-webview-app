import { View, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants/icons";
import { useRouter } from "expo-router"; // Use useRouter instead of useNavigation

interface Props {
  placeholder: string;
  onPress?: () => void;
}

const SearchBar = ({ placeholder, onPress }: Props) => {
  const [notification, setNotification] = useState(false);
  const router = useRouter(); // Use router for navigation

  return (
    <View className="w-full mx-auto flex-row justify-center gap-2 items-center py-2 border-[1px] border-gray-100">
      <View className="flex-row justify-around items-center bg-white border-[1px] border-blue-100 rounded-lg px-5 py-1 w-[75%]">
        <Image
          source={icons.search}
          className="size-5"
          resizeMode="contain"
          tintColor="#13274F"
        />
        <TextInput
          onPress={onPress}
          placeholder={placeholder}
          placeholderTextColor="#000"
          className="flex-1 ml-2 text-black"
          //onFocus={() => router.push("/search/searchlist")} // Correct navigation syntax
        />
      </View>
      <TouchableOpacity onPress={() => setNotification(!notification)}>
        <Image
          source={notification ? icons.noti_fill_static : icons.noti_outline}
          tintColor={notification ? "#FF5733" : "#A9A9A9"}
          className="size-9"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
