import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "@/constants/icons";

const ListingBottomBar = () => {
  const [liked, setLiked] = useState(false);
  return (
    <View className="w-full h-16 border-2 border-gray-200 flex-row justify-between items-center px-8">
      <View className="flex-row w-[20%] justify-between">
        <TouchableOpacity onPress={() => setLiked(!liked)}>
          <Image
            source={liked ? icons.filled : icons.red}
            className={`${liked ? "size-7" : "size-6"}`}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={icons.chat} tintColor={"#000"} className="z-5" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity className="w-fit h-10 px-4 py-2 bg-green-600 rounded-lg">
        <Text className="text-white font-semibold">Make Offer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ListingBottomBar;
