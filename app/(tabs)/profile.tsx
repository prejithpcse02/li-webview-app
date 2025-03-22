import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import NavClose from "@/components/NavClose";
import dummy from "@/constants/dummy";
import { FlatList } from "react-native-gesture-handler";
import ListingCard from "@/components/ListingCard";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReviewCard from "@/components/ReviewCard";

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

const Profile = () => {
  const [selectedTab, setSelectedTab] = useState("Listings");
  const [data, setData] = useState<Product[] | null>(null);
  const [likedItems, setLikedItems] = useState<Product[] | null>(null);
  const selectedItem = data?.find((item) => item.id === "p01");
  const selectedListings =
    data?.filter((item) => item.p_owner === selectedItem?.p_owner) || [];
  const reviewCount = selectedListings.flatMap((item) => item.p_reviews).length;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const allReviews = selectedListings.flatMap((item) => item.p_reviews);
  const totalReviewStars = allReviews.reduce(
    (sum, review) => sum + (review.review_stars || 0),
    0
  );
  const averageStars = reviewCount > 0 ? totalReviewStars / reviewCount : 0;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setData(dummy);
      const likedItems = dummy.filter(
        (item: Product) => item.p_liked === "true"
      );
      setLikedItems(likedItems);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const Headings = ({ title, isActive, onPress }: any) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.headingContainer}>
        <Text style={[styles.headingText, isActive && styles.activeHeading]}>
          {title}
        </Text>
        {isActive && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : (
        <>
          <NavClose link="/listings" />

          <Text style={styles.ownerName}>{selectedItem?.p_owner}</Text>
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: selectedItem?.p_user_image }}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <View style={styles.reviewContainer}>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const starValue = averageStars - (star - 1);
                  return (
                    <Ionicons
                      key={star}
                      name={
                        starValue >= 1
                          ? "star"
                          : starValue > 0
                          ? "star-half"
                          : "star-outline"
                      }
                      size={24}
                      color="#FFD700"
                    />
                  );
                })}
              </View>
              <TouchableOpacity onPress={() => setSelectedTab("Reviews")}>
                <Text style={styles.reviewText}>{reviewCount} Reviews</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.tabsContainer}>
            {["Listings", "Reviews", "Likes"].map((tab) => (
              <Headings
                key={tab}
                title={tab}
                isActive={tab === selectedTab}
                onPress={() => setSelectedTab(tab)}
              />
            ))}
          </View>
          {selectedTab === "Listings" && (
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollViewContent}
              className="px-2"
            >
              <GestureHandlerRootView>
                <FlatList
                  data={selectedListings}
                  renderItem={({ item }) => <ListingCard {...item} />}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={2}
                  columnWrapperStyle={styles.listingColumn}
                  scrollEnabled={false}
                />
              </GestureHandlerRootView>
            </ScrollView>
          )}
          {selectedTab === "Reviews" && (
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollViewContent}
              className="px-2"
            >
              <GestureHandlerRootView>
                <FlatList
                  data={selectedListings.flatMap((item) =>
                    item.p_reviews.map((review) => ({
                      ...review,
                      p_image: item.p_image[0],
                    }))
                  )}
                  renderItem={({ item }) => (
                    <ReviewCard review={item} p_image={item.p_image} />
                  )}
                  keyExtractor={(item, index) =>
                    `${item.reviewer_name}-${index}`
                  }
                  scrollEnabled={false}
                />
              </GestureHandlerRootView>
            </ScrollView>
          )}
          {selectedTab === "Likes" && (
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollViewContent}
              className="px-2"
            >
              <GestureHandlerRootView>
                <FlatList
                  data={likedItems}
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
              </GestureHandlerRootView>
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  loader: {
    marginTop: 10,
    alignSelf: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 5,
  },
  ownerName: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    marginHorizontal: 20,
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  reviewContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginLeft: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  reviewText: {
    color: "#ff6347",
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  headingContainer: {
    alignItems: "center",
  },
  headingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  activeHeading: {
    color: "#007bff",
  },
  activeIndicator: {
    width: "100%",
    height: 2,
    backgroundColor: "#007bff",
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 10,
  },
  listingColumn: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
});

export default Profile;
