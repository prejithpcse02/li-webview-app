import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import ListingCard from "@/components/ListingCard";
import Search from "@/components/Search";
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

const searchlist = () => {
  const [data, setData] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<Product[] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const categories = [
    "All",
    "Electronics",
    "Mobiles",
    "Hearables",
    "Watches",
    "Gadgets",
    "Laptops",
    "TV",
    "Cameras",
  ];

  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      const filtered = data.filter(
        (item) =>
          item.p_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (selectedCategory === "All" ||
            item.p_category.includes(selectedCategory))
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, selectedCategory, data]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setData(dummy);
      setFilteredData(dummy);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchConfirm = (query: string) => {
    if (query && !recentSearches.includes(query)) {
      setRecentSearches((prevSearches) => {
        const updatedSearches = [query, ...prevSearches];
        return updatedSearches.slice(0, 4); // Keep only the last 4 searches
      });
    }
  };

  const handleSearchClick = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <View className="flex-1 bg-white pt-2">
      <Search
        onSearch={handleSearch}
        onSearchConfirm={handleSearchConfirm}
        placeholder="Search for an item"
      />

      {/* Recent Searches */}
      {!searchQuery && (
        <View className="px-5 mt-5">
          <Text className="text-lg font-bold text-gray-700">
            Recent Searches
          </Text>
          {recentSearches.map((search, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSearchClick(search)}
            >
              <View className="flex-row items-center mt-3">
                <Text className="text-base text-gray-600">{search}</Text>
                <Text className="text-sm text-gray-400 ml-2">
                  In all categories
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Category Picker */}
      <View className="px-5 mt-5">
        <Text className="text-lg font-bold text-gray-700">
          Filter by Category
        </Text>
        <View className="flex-row justify-start items-center gap-2 mt-2 mb-2">
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {categories.map((category) => (
                <Picker.Item key={category} label={category} value={category} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {/* Listing Section */}
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
          <View className="flex-1 mt-2">
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

// **Improved Picker Styling**
const styles = StyleSheet.create({
  pickerContainer: {
    width: "90%",
    borderRadius: 8,
    backgroundColor: "#f0f9ff", // Light pleasant blue
    overflow: "hidden",
    elevation: 1, // Subtle shadow for better UI
  },
  picker: {
    height: 55,
    color: "#333",
  },
  pickerItem: {
    fontSize: 14,
  },
});

export default searchlist;
