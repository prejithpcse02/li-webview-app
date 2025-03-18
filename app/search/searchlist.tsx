import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
//import axios from "axios";
//import SearchBar from "@/components/SearchBar";
import { useRouter } from "expo-router";
import ListingCard from "@/components/ListingCard";
import Search from "@/components/Search";
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

const searchlist = () => {
  const [data, setData] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<Product[] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      const filtered = data.filter((item) =>
        item.p_name.toLocaleLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, data]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      /*const result = await axios("http://192.168.31.134:3000/listings");
      const likedItems = result.data.filter(
        (item: Product) => item.p_liked === "true"
      );*/
      /*const likedItems = dummy.filter(
        (item: Product) => item.p_liked === "true"
      );*/
      setData(dummy);
      setFilteredData(dummy);
    } catch (error) {
      // @ts-ignore
      setError(error instanceof Error ? error : new Error("An error occured"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white pt-2">
      <Search onSearch={setSearchQuery} placeholder="Search for an item" />
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
              Search listings
            </Text>
            {filteredData && filteredData.length > 0 ? (
              <FlatList
                data={filteredData}
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
            ) : (
              <Text className="text-gray-500 text-center mt-5 text-lg">
                No match found
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default searchlist;
