import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
//import SearchBar from "@/components/SearchBar";
import { useRouter } from "expo-router";
import ListingCard from "@/components/ListingCard";
import dummy from "@/constants/dummy";
interface Product {
  id: string;
  p_name: string;
  p_image: string[];
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

const likes = () => {
  const [data, setData] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchDataLiked();
  }, []);

  const fetchDataLiked = async () => {
    try {
      setLoading(true);
      setError(null);
      //const result = await axios("http://192.168.31.134:3000/listings");
      /*const likedItems = result.data.filter(
        (item: Product) => item.p_liked === "true"
      );*/
      const likedItems = dummy.filter(
        (item: Product) => item.p_liked === "true"
      );
      setData(likedItems);
    } catch (error) {
      // @ts-ignore
      setError(error instanceof Error ? error : new Error("An error occured"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white pt-2">
      {/*<SearchBar
        onPress={() => router.push("/listings")}
        placeholder="Search for an item"
      />*/}
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : error ? (
          <Text className="text-red-500 text-center mt-5">Error: {error}</Text>
        ) : (
          <View className="flex-1 mt-3">
            <Text className="text-lg text-primary font-bold mt-5 mb-3">
              Liked listings
            </Text>
            <FlatList
              data={data}
              renderItem={({ item }) => <ListingCard {...item} />}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginBottom: 10,
              }}
              className="mt-2 pb-32"
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default likes;
