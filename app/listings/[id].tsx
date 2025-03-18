import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import NavClose from "@/components/NavClose";
//import axios from "axios";
import Carousel from "react-native-reanimated-carousel";
import { icons } from "@/constants/icons";
import dummy from "@/constants/dummy";
import ListingBottomBar from "@/components/ListingBottomBar";
const { width } = Dimensions.get("window");

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
}

const ItemDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [data, setData] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      //const result = await axios.get(`http://192.168.31.134:3000/listings`);
      //setData(result.data);
      setData(dummy);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedItem = data?.find((item) => item.id === id);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-lg font-bold text-red-500">{error}</Text>
      </View>
    );
  }

  if (!selectedItem) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-lg font-bold text-red-500">Item not found</Text>
      </View>
    );
  }

  return (
    <>
      <NavClose link="/listings" />
      <View className="bg-gray-100 flex-1 p-4">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-white shadow-md rounded-lg p-4 pb-8">
            <Carousel
              loop
              width={width - 32}
              height={250}
              autoPlay={true}
              data={selectedItem.p_image}
              scrollAnimationDuration={1000}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/listings/fullImage",
                      params: {
                        images: JSON.stringify(selectedItem.p_image),
                        id: id,
                      },
                    })
                  }
                >
                  <Image
                    source={{ uri: item }}
                    className="w-full h-72 rounded-lg "
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
            />
            <View className="w-full flex-1 items-end mt-2">
              <Text className="text-white bg-green-600 w-fit px-3 py-1 mr-2">
                Available
              </Text>
            </View>
            <Text className="text-xl font-bold text-gray-900">
              {selectedItem.p_name}
            </Text>
            <View className="flex flex-row justify-between mt-4 items-center">
              <View className="flex-row gap-2">
                <Image source={icons.red} className="size-6" />
                <Text className="text-gray-700 font-semibold">
                  {selectedItem.p_likes} Likes
                </Text>
              </View>
              <Text className="text-gray-600 font-semibold">
                Owner:{" "}
                <Text className="text-blue-600 font-semibold">
                  {selectedItem.p_owner}
                </Text>
              </Text>
            </View>
            <Text className="mt-2 font-medium text-gray-900">
              Posted on:{" "}
              <Text className="font-light text-gray-700">
                {selectedItem.p_date}
              </Text>
            </Text>
            <Text className="text-green-600 text-lg font-semibold mt-4">
              {selectedItem.p_price}
            </Text>
            <View className="flex-1 w-full flex-col mt-4">
              <Text className="font-medium text-gray-900">Condition</Text>
              <Text className="font-light">{selectedItem.p_short}</Text>
            </View>
            <View className="flex-1 w-full flex-col mt-4">
              <Text className="font-medium text-gray-900">Description</Text>
              <Text className="font-light">{selectedItem.p_desc}</Text>
            </View>
            <View className="flex-1 w-full flex-col mt-4">
              <Text className="font-medium text-gray-900">Pickup</Text>
              <Text className="font-light">{selectedItem.p_pickup}</Text>
            </View>

            {/*<Link
              href={`/listings/${id}`}
              className="bg-green-600 mt-8 p-3 rounded-lg items-center"
              asChild
            >
              <TouchableOpacity>
                <Text className="text-white text-lg font-semibold text-center">
                  Make Offer
                </Text>
              </TouchableOpacity>
            </Link>*/}
          </View>
        </ScrollView>
      </View>
      <ListingBottomBar />
    </>
  );
};

export default ItemDetails;
