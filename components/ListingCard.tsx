import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import LikeButton from "./LikeButton";

interface ListingCardProps {
  item?: {
    product_id: number;
    slug: string;
    title: string;
    description: string;
    price: number;
    condition: string;
    location: string;
    status: string;
    created_at: string;
    seller_name: string;
    seller_id: number;
    images: { image_url: string }[];
    is_liked: boolean;
    likes_count: number;
  };
  id?: string;
  p_name?: string;
  p_image?: string[];
  p_date?: string;
  p_url?: string;
  p_likes?: number;
  p_owner?: string;
  p_price?: string;
  p_short?: string;
  p_desc?: string;
  p_pickup?: string;
  p_liked?: string;
  p_category?: string[];
  p_user_image?: string;
  p_reviews?: any[];
  p_stars?: number;
}

const ListingCard: React.FC<ListingCardProps> = (props) => {
  const router = useRouter();
  const { user } = useAuth();

  const isDummyData = !!props.id;

  const dummyLikesCount = props.p_likes || 0;
  const dummyIsLiked = props.p_liked === "true";

  const apiLikesCount = props.item?.likes_count || 0;
  const apiIsLiked = props.item?.is_liked || false;

  const [likesCount, setLikesCount] = useState(
    isDummyData ? dummyLikesCount : apiLikesCount
  );
  const [isLiked, setIsLiked] = useState(
    isDummyData ? dummyIsLiked : apiIsLiked
  );

  const handleLikeChange = (newIsLiked: boolean) => {
    setIsLiked(newIsLiked);
    setLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));
  };

  if (isDummyData) {
    return (
      <View className="w-full mb-4">
        <View className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <View className="relative aspect-square">
            {user && (
              <View className="absolute top-2 right-2 z-50">
                <LikeButton
                  listingId={parseInt(props.id || "0")}
                  initialIsLiked={isLiked}
                  onLikeChange={handleLikeChange}
                />
              </View>
            )}
            <TouchableOpacity
              onPress={() => router.push(`/listings/${props.id}`)}
            >
              <Image
                source={{ uri: props.p_image?.[0] }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
          <View className="p-4">
            <Text
              className="text-sm font-semibold text-gray-800"
              numberOfLines={2}
            >
              {props.p_name}
            </Text>
            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-lg font-bold text-blue-600">
                {props.p_price}
              </Text>
              <TouchableOpacity
                onPress={() => router.push(`/profiles/${props.p_owner}`)}
              >
                <Text className="text-xs font-medium text-blue-600">
                  {props.p_owner}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-xs text-gray-600" numberOfLines={1}>
                {props.p_pickup}
              </Text>
              <Text className="text-xs font-semibold text-gray-800">
                {props.p_date
                  ? new Date(props.p_date).toLocaleDateString()
                  : ""}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  const item = props.item;
  if (!item) return null;

  return (
    <View className="w-full mb-4">
      <View className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <View className="relative aspect-square">
          {user && (
            <View className="absolute top-2 right-2 z-50">
              <LikeButton
                listingId={item.product_id}
                initialIsLiked={isLiked}
                onLikeChange={handleLikeChange}
              />
            </View>
          )}
          <TouchableOpacity
            onPress={() =>
              router.push(`/listings/${item.slug}/${item.product_id}`)
            }
          >
            <Image
              source={{ uri: item.images[0].image_url }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
        <View className="p-4">
          <Text
            className="text-sm font-semibold text-gray-800"
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-lg font-bold text-blue-600">
              ₹{item.price}
            </Text>
            <TouchableOpacity
              onPress={() => router.push(`/profiles/${item.seller_name}`)}
            >
              <Text className="text-xs font-medium text-blue-600">
                {item.seller_name}
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-xs text-gray-600" numberOfLines={1}>
              {item.location}
            </Text>
            <Text className="text-xs font-semibold text-gray-800">
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ListingCard;
