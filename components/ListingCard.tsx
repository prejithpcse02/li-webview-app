import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";
import { icons } from "@/constants/icons";

interface Product {
  id: string;
  p_name: string;
  p_image: string[]; // Changed to an array of images
  p_date: string;
  p_url: string;
  p_likes: number;
  p_owner: string;
  p_price: string;
  p_short: string;
  p_desc: string;
  p_pickup: string;
  p_liked: string;
  p_category: string[];
  p_user_image: string;
  p_stars: number;
  p_reviews: {
    review_stars: number;
    reviewer_name: string;
    review_text: string;
  }[];
}

const ListingCard = ({
  id,
  p_name,
  p_image,
  p_date,
  p_url,
  p_likes,
  p_owner,
  p_price,
  p_desc,
  p_short,
  p_pickup,
  p_liked,
  p_category,
  p_user_image,
  p_stars,
  p_reviews,
}: Product) => {
  const [liked, setLiked] = useState(false);
  return (
    <Link href={`/listings/${id}`} asChild>
      <TouchableOpacity className="w-[48%] bg-white rounded-lg shadow-sm border-[1px] border-gray-100 p-4 pt-6 z-0">
        <Image
          source={{ uri: p_image[0] }}
          className="w-full h-48 rounded-lg mb-3"
          resizeMode="cover"
        />
        <Text className="text-sm font-semibold text-gray-800" numberOfLines={2}>
          {p_name}
        </Text>
        <View className="flex flex-row justify-between items-center">
          <Text className="text-md font-bold text-primary mt-2">{p_price}</Text>
          <Text className="text-xs font-bold text-dark-100 mt-2">
            {p_owner}
          </Text>
        </View>
        <View className="flex flex-row justify-between items-center">
          <Text className="text-xs font-light text-primary mt-2">
            {p_short}
          </Text>
          <Text className="text-xs font-bold text-primary mt-2">{p_date}</Text>
        </View>
        <View className="absolute flex-row top-2 right-2">
          <Link
            href="/listings"
            className={`z-10 ${
              liked ? "p-1" : "p-2"
            } flex w-fit bg-gray-50 border-2 border-gray-50 justify-center items-center rounded-full`}
          >
            <TouchableOpacity
              className="z-10"
              //onPress={() => setLiked(!liked)}
            >
              <Image
                source={p_liked === "true" ? icons.filled : icons.red}
                className={`${p_liked === "true" ? "size-6" : "size-5"} z-20`}
              />
            </TouchableOpacity>
          </Link>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default ListingCard;
