import { Text, View, Image } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

interface Review {
  review_text: string;
  review_stars: number;
  reviewer_name: string;
}

interface Item {
  p_image: string;
  review: Review;
}

const ReviewCard = ({ p_image, review }: Item) => {
  return (
    <View className="w-full flex-row justify-center">
      <View className="w-[100%] rounded-lg bg-white m-2 p-4 shadow-md border border-gray-200">
        <View className="flex-row items-start space-x-4">
          <Image
            source={{ uri: p_image }}
            className="w-20 h-20 rounded-lg mr-2"
            resizeMode="cover"
          />
          <View className="flex-1 space-y-2">
            <View className="space-y-1">
              <View className="flex-row items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={
                      (review.review_stars ?? 0) >= star
                        ? "star"
                        : "star-outline"
                    }
                    size={14}
                    color="#FFD700"
                  />
                ))}
              </View>
              <Text className="text-black font-semibold text-base">
                {review.reviewer_name}
              </Text>
              <Text
                className="text-gray-600 text-sm leading-5"
                numberOfLines={3}
              >
                {review.review_text}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ReviewCard;
