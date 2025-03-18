import {
  View,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { useState, useRef } from "react";
import NavClose from "@/components/NavClose";
import { useLocalSearchParams } from "expo-router";

const { width, height } = Dimensions.get("window");

const FullImage = () => {
  const { images, id } = useLocalSearchParams();
  const imageList = JSON.parse(typeof images === "string" ? images : "[]");

  // State to track selected image index
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  // Function to scroll to the selected image
  const handleImageSelect = (index: number) => {
    setSelectedIndex(index);
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
  };

  return (
    <View className="flex-1 bg-white">
      {/* Navigation Close Button */}
      <NavClose link={`/listings/${id}`} />

      {/* Scrollable Main Image List */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        className="mt-8"
        contentContainerStyle={{ width: width * imageList.length }}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / width
          );
          setSelectedIndex(newIndex);
        }}
      >
        {imageList.map((img: string, index: number) => (
          <View key={index} className="flex items-center" style={{ width }}>
            <Image
              source={{ uri: img }}
              style={{
                width: width * 0.9,
                height: height * 0.6,
                borderRadius: 10,
              }}
              resizeMode="contain"
              className="border border-gray-200"
            />
          </View>
        ))}
      </ScrollView>

      {/* Navigation Dots */}
      <View className="flex-row justify-center my-2">
        {imageList.map((_, index) => (
          <View
            key={index}
            className={`w-3 h-3 mx-1 rounded-full border-2 ${
              selectedIndex === index
                ? "border-2 border-blue-500 bg-white"
                : "border-gray-300"
            }`}
          />
        ))}
      </View>

      {/* Thumbnail Scrollable List */}
      <View className="py-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            paddingHorizontal: 10,
          }}
          className="flex-row mx-auto"
        >
          {imageList.map((img: string, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleImageSelect(index)}
              className={`mx-2 p-[2px] rounded-xl ${
                selectedIndex === index
                  ? "border-2 border-blue-500"
                  : "border-0"
              }`}
            >
              <Image
                source={{ uri: img }}
                className="w-16 h-16 rounded-lg"
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default FullImage;
