import React from "react";
//import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import ListingCard from "@/components/ListingCard";
//import axios from "axios";
import dummy from "@/constants/dummy";

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

const listings = () => {
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

      //const result = await axios("http://192.168.31.134:3000/listings");
      //console.log("Data: ", result.data);
      setData(dummy);
    } catch (error) {
      // @ts-ignore
      setError(error instanceof Error ? error : new Error("An error occured"));
    } finally {
      setLoading(false);
    }
  };
  return (
    <View className="flex-1 bg-white pt-2">
      <SearchBar
        onPress={() => router.push("/search/searchlist")}
        placeholder="Search for an item"
      />
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
          <Text className="text-red-500 text-center mt-5">
            Error: Something went wrong
          </Text>
        ) : (
          <View className="flex-1 mt-3">
            <Text className="text-lg text-primary font-bold mt-5 mb-3">
              Latest listings
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

export default listings;
